import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.ts';
import {
  UserRole,
  Product,
  Partner,
  RFQ,
  QuotationVersion,
  PartnerQuotation,
  SilphorQualification,
  ResourceRequirement,
  CRMOpportunity,
  PublicEnquiry,
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Active session state for demonstration (can be switched via /api/auth/switch-role)
  let activeCurrentUser = db.users.find((u) => u.role === 'customer') || db.users[0];

  // Rate-limiting in-memory counter for anti-abuse
  const rateLimitMap: Record<string, { count: number; lastReset: number }> = {};
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_ENQUIRIES_PER_WINDOW = 5;

  // Middleware: Resolve current user from Authorization header or activeCurrentUser
  const authenticate = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = db.users.find((u) => u.token === token);
      if (user) {
        (req as any).user = user;
        return next();
      }
    }
    (req as any).user = activeCurrentUser;
    next();
  };

  app.use('/api', authenticate);

  // ----------------------------------------------------
  // 1. HEALTH & METRICS
  // ----------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'Silphor Technologies Enterprise Platform',
      version: '1.4.0',
      timestamp: new Date().toISOString(),
    });
  });

  // ----------------------------------------------------
  // 2. FEATURE FLAGS
  // ----------------------------------------------------
  app.get('/api/feature-flags', (req, res) => {
    res.json(db.featureFlags);
  });

  app.put('/api/feature-flags', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Only Silphor business users can modify feature flags.' });
    }
    db.featureFlags = { ...db.featureFlags, ...req.body };
    db.logAudit(
      'FEATURE_FLAGS_UPDATED',
      user.email,
      user.role,
      `Updated flags: ${JSON.stringify(req.body)}`
    );
    res.json(db.featureFlags);
  });

  // ----------------------------------------------------
  // 3. CATALOG & CONTENT ROUTES (Phase I-A)
  // ----------------------------------------------------
  app.get('/api/content/categories', (req, res) => {
    res.json(db.categories);
  });

  app.get('/api/content/products', (req, res) => {
    const { category, industry, state, featured, q } = req.query as Record<string, string>;
    let results = [...db.products];

    if (category) {
      results = results.filter((p) => p.categoryId === category);
    }
    if (industry) {
      results = results.filter((p) => p.industryIds.includes(industry));
    }
    if (state) {
      results = results.filter((p) => p.publicationState === state);
    }
    if (featured === 'true') {
      results = results.filter((p) => p.featured);
    }
    if (q) {
      const query = q.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    res.json(results);
  });

  app.get('/api/content/products/:id', (req, res) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  // Admin CRUD for Products
  app.post('/api/content/products', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Requires Silphor business user authority' });
    }
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: req.body.sku || `SP-PROD-${Math.floor(Math.random() * 900 + 100)}`,
      name: req.body.name,
      slug: (req.body.name || '').toLowerCase().replace(/\s+/g, '-'),
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName || 'ASIC & SoC Architecture',
      tagline: req.body.tagline || '',
      description: req.body.description || '',
      specs: req.body.specs || {},
      industryIds: req.body.industryIds || [],
      publicationState: req.body.publicationState || 'draft',
      vendorName: req.body.vendorName || 'Silphor Technologies IP Division',
      featured: Boolean(req.body.featured),
      documents: req.body.documents || [],
      lifecyclePhase: req.body.lifecyclePhase || 'Sampling',
    };
    db.products.unshift(newProduct);
    db.logAudit('PRODUCT_CREATED', user.email, user.role, `Created product ${newProduct.sku} (${newProduct.name})`);
    res.status(201).json(newProduct);
  });

  app.put('/api/content/products/:id', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Requires Silphor business user authority' });
    }
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    db.products[idx] = { ...db.products[idx], ...req.body };
    db.logAudit('PRODUCT_UPDATED', user.email, user.role, `Updated product ${db.products[idx].sku}`);
    res.json(db.products[idx]);
  });

  app.delete('/api/content/products/:id', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Requires Silphor business user authority' });
    }
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const deleted = db.products.splice(idx, 1)[0];
    db.logAudit('PRODUCT_DELETED', user.email, user.role, `Deleted product ${deleted.sku}`);
    res.json({ success: true, deletedId: deleted.id });
  });

  // Partners & Vendors Master
  app.get('/api/content/partners', (req, res) => {
    const { type, tier, state, approval } = req.query as Record<string, string>;
    let results = [...db.partners];
    if (type) results = results.filter((p) => p.type === type);
    if (tier) results = results.filter((p) => p.tier === tier);
    if (state) results = results.filter((p) => p.publicationState === state);
    if (approval) results = results.filter((p) => p.profileApprovalStatus === approval);
    res.json(results);
  });

  app.post('/api/content/partners', (req, res) => {
    const user = (req as any).user;
    const newPartner: Partner = {
      id: `part-${Date.now()}`,
      name: req.body.name,
      type: req.body.type || 'vendor',
      tier: req.body.tier || 'Certified',
      country: req.body.country || 'Global',
      headquarters: req.body.headquarters || '',
      website: req.body.website || '',
      description: req.body.description || '',
      capabilities: req.body.capabilities || [],
      certifications: req.body.certifications || [],
      publicationState: user.role === 'silphor_business_user' ? 'published' : 'under_review',
      profileApprovalStatus: user.role === 'silphor_business_user' ? 'approved' : 'pending',
      contactEmail: req.body.contactEmail || user.email,
    };
    db.partners.unshift(newPartner);
    db.logAudit('PARTNER_REGISTERED', user.email, user.role, `Partner registered: ${newPartner.name}`);
    res.status(201).json(newPartner);
  });

  app.put('/api/content/partners/:id/approval', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Only Silphor business users can approve partner profiles' });
    }
    const partner = db.partners.find((p) => p.id === req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    partner.profileApprovalStatus = req.body.status || 'approved';
    if (req.body.status === 'approved') {
      partner.publicationState = 'published';
    }
    db.logAudit(
      'PARTNER_APPROVAL_UPDATED',
      user.email,
      user.role,
      `Partner ${partner.name} approval set to ${partner.profileApprovalStatus}`
    );
    res.json(partner);
  });

  app.get('/api/content/industries', (req, res) => {
    res.json(db.industries);
  });

  app.get('/api/content/services', (req, res) => {
    res.json(db.services);
  });

  app.get('/api/content/case-studies', (req, res) => {
    res.json(db.caseStudies);
  });

  // Search Engine (Faceted and Full-text)
  app.get('/api/search', (req, res) => {
    const { q, categoryId, industryId, partnerType, publicationState } = req.query as Record<string, string>;
    const results = db.searchCatalog({
      query: q,
      categoryId,
      industryId,
      partnerType,
      publicationState,
    });
    res.json(results);
  });

  // Public Enquiry with Anti-Abuse (Honeypot, Validation & Telemetry)
  app.post('/api/enquiry', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    // 1. Rate Limiting Check
    if (!rateLimitMap[ip] || now - rateLimitMap[ip].lastReset > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap[ip] = { count: 1, lastReset: now };
    } else {
      rateLimitMap[ip].count++;
      if (rateLimitMap[ip].count > MAX_ENQUIRIES_PER_WINDOW) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please wait a minute before submitting again.',
        });
      }
    }

    // 2. Anti-Abuse Honeypot check (hidden field should remain empty)
    if (req.body._company_fax_code) {
      // Bot detected silently
      return res.status(200).json({
        success: true,
        referenceId: 'ENQ-BOT-TRAPPED',
        message: 'Thank you for your enquiry.',
      });
    }

    // 3. Validation
    const { fullName, businessEmail, companyName, enquiryType, requirementDetails, country } = req.body;
    if (!fullName || !businessEmail || !companyName || !requirementDetails) {
      return res.status(400).json({
        error: 'Missing required fields: fullName, businessEmail, companyName, requirementDetails are mandatory.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return res.status(400).json({ error: 'Invalid business email format.' });
    }

    // Mask IP for privacy telemetry
    const ipParts = ip.split('.');
    const ipMasked = ipParts.length === 4 ? `${ipParts[0]}.${ipParts[1]}.***.***` : '192.168.***.***';

    const enquiry: PublicEnquiry = {
      id: `ENQ-2026-${Math.floor(Math.random() * 900 + 100)}`,
      fullName,
      companyName,
      businessEmail,
      phone: req.body.phone,
      enquiryType: enquiryType || 'General Inquiry',
      requirementDetails,
      country: country || 'Global',
      honeypotCheckPassed: true,
      ipAddressMasked: ipMasked,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    db.enquiries.unshift(enquiry);
    db.logAudit(
      'PUBLIC_ENQUIRY_RECEIVED',
      businessEmail,
      'public_guest',
      `Enquiry ${enquiry.id} from ${companyName} (${enquiry.enquiryType})`
    );

    res.status(201).json({
      success: true,
      referenceId: enquiry.id,
      message: 'Your enquiry has been securely received by Silphor Solutions Engineering. A technical advisor will respond within 24 hours.',
      telemetry: {
        timestamp: enquiry.submittedAt,
        antiAbuseVerified: true,
        clientHash: enquiry.ipAddressMasked,
      },
    });
  });

  app.get('/api/enquiries', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Requires Silphor operations clearance' });
    }
    res.json(db.enquiries);
  });

  // ----------------------------------------------------
  // 4. ENTERPRISE & PARTNER IDENTITY (Phase I-B)
  // ----------------------------------------------------
  app.get('/api/auth/me', (req, res) => {
    res.json({
      user: (req as any).user,
      allAvailableTestUsers: db.users,
    });
  });

  app.post('/api/auth/switch-role', (req, res) => {
    const { role, userId } = req.body;
    let targetUser = userId ? db.users.find((u) => u.id === userId) : null;
    if (!targetUser && role) {
      targetUser = db.users.find((u) => u.role === role);
    }
    if (!targetUser) {
      return res.status(404).json({ error: 'Requested user role not found' });
    }
    activeCurrentUser = targetUser;
    db.logAudit('USER_ROLE_SWITCHED', targetUser.email, targetUser.role, `Switched context to ${targetUser.name} (${targetUser.role})`);
    res.json({ success: true, user: activeCurrentUser });
  });

  app.get('/api/organizations', (req, res) => {
    res.json(db.organizations);
  });

  app.post('/api/organizations/invite', (req, res) => {
    const user = (req as any).user;
    const { email, role, orgId } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'Email and role required' });

    const invite = {
      id: `inv-${Date.now()}`,
      orgId: orgId || user.orgId,
      email,
      role: role as UserRole,
      invitedBy: user.email,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    db.invitations.unshift(invite);
    db.logAudit('INVITATION_SENT', user.email, user.role, `Invited ${email} as ${role}`);
    res.status(201).json(invite);
  });

  // ----------------------------------------------------
  // 5. RFQ / ENQUIRY WORKFLOW (Phase I-C)
  // ----------------------------------------------------
  app.get('/api/rfqs', (req, res) => {
    const user = (req as any).user;
    // Role scoping
    if (user.role === 'silphor_business_user') {
      return res.json(db.rfqs);
    }
    if (user.role === 'customer') {
      return res.json(db.rfqs.filter((r) => r.customerOrgId === user.orgId || r.customerId === user.id));
    }
    // Partner roles (principal_oem, distributor, vendor, engineering_provider)
    const partnerRecord = db.partners.find((p) => p.name === user.orgName || p.id === user.orgId);
    const partnerId = partnerRecord?.id;

    const assigned = db.rfqs.filter((r) =>
      r.assignedPartners.some((ap) => ap.partnerId === partnerId || ap.partnerName === user.orgName)
    );
    res.json(assigned);
  });

  app.get('/api/rfqs/:id', (req, res) => {
    const rfq = db.rfqs.find((r) => r.id === req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    res.json(rfq);
  });

  app.post('/api/rfqs', (req, res) => {
    const user = (req as any).user;
    const newId = `RFQ-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    const rfq: RFQ = {
      id: newId,
      title: req.body.title || 'Custom Semiconductor Solution Request',
      customerId: user.id,
      customerName: user.name,
      customerOrgId: user.orgId,
      customerOrgName: user.orgName,
      requirementDescription: req.body.requirementDescription,
      tags: req.body.tags || ['Custom ASIC', 'Engineering Services'],
      targetDate: req.body.targetDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedVolumePerYear: Number(req.body.estimatedVolumePerYear) || 10000,
      lifecycleStatus: 'submitted',
      qualification: {
        category: req.body.category || 'ASIC & SoC Architecture',
        geography: req.body.geography || 'Global',
        urgency: req.body.urgency || 'medium',
        completenessScore: 85,
        assignedOwner: 'Silphor Operations Queue',
        followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        qualificationNotes: 'Initial submission under Silphor triage.',
      },
      assignedPartners: [],
      quotations: [],
      attachments: req.body.attachments || [
        {
          id: `att-${Date.now()}`,
          filename: 'Requirements_Spec_Sheet.pdf',
          fileSize: '2.8 MB',
          uploadedAt: new Date().toISOString(),
        },
      ],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'RFQ_CREATED',
          actorEmail: user.email,
          actorRole: user.role,
          details: `RFQ ${newId} submitted by ${user.name} (${user.orgName}).`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.rfqs.unshift(rfq);
    db.logAudit('RFQ_SUBMITTED', user.email, user.role, `RFQ ${newId} created`);
    res.status(201).json(rfq);
  });

  // Silphor qualification
  app.put('/api/rfqs/:id/qualify', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Requires Silphor operations clearance' });
    }
    const rfq = db.rfqs.find((r) => r.id === req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    rfq.qualification = { ...rfq.qualification, ...req.body };
    rfq.lifecycleStatus = 'qualified';
    rfq.updatedAt = new Date().toISOString();

    const audit = db.logAudit(
      'RFQ_QUALIFIED',
      user.email,
      user.role,
      `Qualified RFQ ${rfq.id}. Score: ${rfq.qualification.completenessScore}%, Urgency: ${rfq.qualification.urgency}`
    );
    rfq.auditTrail.unshift(audit);
    res.json(rfq);
  });

  // Assign partners/vendors
  app.post('/api/rfqs/:id/assign-partners', (req, res) => {
    const user = (req as any).user;
    if (user.role !== 'silphor_business_user') {
      return res.status(403).json({ error: 'Requires Silphor operations clearance' });
    }
    const rfq = db.rfqs.find((r) => r.id === req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    const { partnerIds, dueDate } = req.body;
    if (!Array.isArray(partnerIds) || partnerIds.length === 0) {
      return res.status(400).json({ error: 'partnerIds array required' });
    }

    partnerIds.forEach((pid: string) => {
      const partner = db.partners.find((p) => p.id === pid);
      if (partner && !rfq.assignedPartners.some((ap) => ap.partnerId === pid)) {
        rfq.assignedPartners.push({
          partnerId: partner.id,
          partnerName: partner.name,
          assignedAt: new Date().toISOString(),
          dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'notified',
          confidentialityAccepted: true,
        });
      }
    });

    rfq.lifecycleStatus = 'bidding';
    rfq.updatedAt = new Date().toISOString();

    const audit = db.logAudit(
      'RFQ_PARTNERS_ROUTED',
      user.email,
      user.role,
      `Routed RFQ ${rfq.id} to ${partnerIds.length} partners.`
    );
    rfq.auditTrail.unshift(audit);
    res.json(rfq);
  });

  // Upload/Update partner quotation
  app.post('/api/rfqs/:id/quotations', (req, res) => {
    const user = (req as any).user;
    const rfq = db.rfqs.find((r) => r.id === req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    const partnerRecord = db.partners.find((p) => p.name === user.orgName || p.id === user.orgId);
    const partnerId = partnerRecord?.id || `part-${user.orgId}`;
    const partnerName = user.orgName;

    let existingQuote = rfq.quotations.find((q) => q.partnerId === partnerId || q.partnerName === partnerName);

    const versionNum = existingQuote ? existingQuote.versions.length + 1 : 1;
    const newVersion: QuotationVersion = {
      version: versionNum,
      nreCostUsd: Number(req.body.nreCostUsd) || 0,
      unitPriceUsd: Number(req.body.unitPriceUsd) || 0,
      currency: req.body.currency || 'USD',
      moq: Number(req.body.moq) || 1000,
      leadTimeWeeks: Number(req.body.leadTimeWeeks) || 16,
      technicalProposalNotes: req.body.technicalProposalNotes || '',
      commercialNotes: req.body.commercialNotes || '',
      attachmentName: req.body.attachmentName || `Proposal_${partnerName.replace(/\s+/g, '_')}_v${versionNum}.pdf`,
      submittedAt: new Date().toISOString(),
      submittedBy: user.name,
    };

    if (existingQuote) {
      existingQuote.currentVersion = versionNum;
      existingQuote.versions.unshift(newVersion);
      existingQuote.status = 'submitted';
      existingQuote.updatedAt = new Date().toISOString();
    } else {
      const newQuote: PartnerQuotation = {
        id: `quote-${Date.now()}`,
        rfqId: rfq.id,
        partnerId,
        partnerName,
        currentVersion: 1,
        versions: [newVersion],
        status: 'submitted',
        updatedAt: new Date().toISOString(),
      };
      rfq.quotations.push(newQuote);
    }

    rfq.lifecycleStatus = 'comparison';
    rfq.updatedAt = new Date().toISOString();

    const audit = db.logAudit(
      'QUOTATION_SUBMITTED',
      user.email,
      user.role,
      `Quotation v${versionNum} submitted by ${partnerName} for RFQ ${rfq.id}.`
    );
    rfq.auditTrail.unshift(audit);

    res.status(201).json(rfq);
  });

  // RFQ Closure / Status Update
  app.put('/api/rfqs/:id/status', (req, res) => {
    const user = (req as any).user;
    const rfq = db.rfqs.find((r) => r.id === req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    const { status, closureReason, awardedPartnerId } = req.body;
    rfq.lifecycleStatus = status;
    rfq.updatedAt = new Date().toISOString();

    if (['closed_won', 'closed_lost', 'cancelled', 'deferred', 'awarded'].includes(status)) {
      rfq.closureRecord = {
        outcome: status === 'awarded' ? 'won' : (status.replace('closed_', '') as any),
        reason: closureReason || `Status shifted to ${status} by ${user.name}`,
        closedAt: new Date().toISOString(),
        closedBy: user.email,
      };

      if (awardedPartnerId) {
        rfq.quotations.forEach((q) => {
          if (q.partnerId === awardedPartnerId) q.status = 'awarded';
          else q.status = 'declined';
        });
      }
    }

    const audit = db.logAudit(
      'RFQ_STATUS_TRANSITION',
      user.email,
      user.role,
      `RFQ ${rfq.id} moved to status ${status}. Reason: ${closureReason || 'N/A'}`
    );
    rfq.auditTrail.unshift(audit);
    res.json(rfq);
  });

  // ----------------------------------------------------
  // 6. ENGINEERING RESOURCE REQUIREMENTS & CRM (Phase I-D)
  // ----------------------------------------------------
  app.get('/api/resources', (req, res) => {
    res.json(db.resourceRequirements);
  });

  app.post('/api/resources', (req, res) => {
    const user = (req as any).user;
    const newId = `RES-2026-${Math.floor(Math.random() * 900 + 100)}`;

    const reqRecord: ResourceRequirement = {
      id: newId,
      title: req.body.title || 'Engineering Resource Requisition',
      customerId: user.id,
      customerOrgName: user.orgName,
      skill: req.body.skill,
      subSkills: req.body.subSkills || [],
      quantity: Number(req.body.quantity) || 1,
      experienceLevel: req.body.experienceLevel || 'Mid-Senior (5-8y)',
      location: req.body.location || 'Remote',
      workModel: req.body.workModel || 'Hybrid',
      startDate: req.body.startDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      durationMonths: Number(req.body.durationMonths) || 6,
      shiftAndSite: req.body.shiftAndSite || 'Day shift',
      complianceStandards: req.body.complianceStandards || ['Clean IP Check'],
      budgetHourlyRateMaxUsd: Number(req.body.budgetHourlyRateMaxUsd) || 120,
      mobilizationStatus: 'requested',
      assignedProviders: [],
      candidates: [],
      createdAt: new Date().toISOString(),
    };

    db.resourceRequirements.unshift(reqRecord);
    db.logAudit(
      'RESOURCE_REQUISITION_CREATED',
      user.email,
      user.role,
      `Created requisition ${newId} for ${reqRecord.quantity}x ${reqRecord.skill}`
    );
    res.status(201).json(reqRecord);
  });

  app.post('/api/resources/:id/route-providers', (req, res) => {
    const user = (req as any).user;
    const resource = db.resourceRequirements.find((r) => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Requisition not found' });

    const { providerIds } = req.body;
    providerIds.forEach((pid: string) => {
      const provider = db.partners.find((p) => p.id === pid);
      if (provider && !resource.assignedProviders.some((ap) => ap.providerId === pid)) {
        resource.assignedProviders.push({
          providerId: provider.id,
          providerName: provider.name,
          routedAt: new Date().toISOString(),
        });
      }
    });

    db.logAudit(
      'RESOURCE_ROUTED_TO_PROVIDERS',
      user.email,
      user.role,
      `Routed ${resource.id} to ${providerIds.length} talent providers.`
    );
    res.json(resource);
  });

  app.post('/api/resources/:id/candidates', (req, res) => {
    const user = (req as any).user;
    const resource = db.resourceRequirements.find((r) => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Requisition not found' });

    const newCandidate = {
      id: `cand-${Date.now()}`,
      providerId: user.orgId,
      providerName: user.orgName,
      candidateName: req.body.candidateName,
      experienceYears: Number(req.body.experienceYears) || 5,
      keySkills: req.body.keySkills || [],
      noticePeriodDays: Number(req.body.noticePeriodDays) || 15,
      proposedHourlyRateUsd: Number(req.body.proposedHourlyRateUsd) || 120,
      status: 'submitted' as const,
      submissionNotes: req.body.submissionNotes || '',
    };

    resource.candidates.push(newCandidate);
    resource.mobilizationStatus = 'submitted_profiles';

    db.logAudit(
      'CANDIDATE_SUBMITTED',
      user.email,
      user.role,
      `Candidate ${newCandidate.candidateName} submitted for ${resource.id}`
    );
    res.status(201).json(resource);
  });

  app.put('/api/resources/:id/candidates/:candId/status', (req, res) => {
    const user = (req as any).user;
    const resource = db.resourceRequirements.find((r) => r.id === req.params.id);
    if (!resource) return res.status(404).json({ error: 'Requisition not found' });

    const candidate = resource.candidates.find((c) => c.id === req.params.candId);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    candidate.status = req.body.status;
    if (req.body.status === 'selected' || req.body.status === 'mobilized') {
      resource.mobilizationStatus = 'mobilizing';
    }

    db.logAudit(
      'CANDIDATE_STATUS_UPDATED',
      user.email,
      user.role,
      `Candidate ${candidate.candidateName} shifted to ${candidate.status}`
    );
    res.json(resource);
  });

  // CRM Pipeline Opportunities
  app.get('/api/crm/opportunities', (req, res) => {
    res.json(db.opportunities);
  });

  app.post('/api/crm/opportunities', (req, res) => {
    const user = (req as any).user;
    const opp: CRMOpportunity = {
      id: `OPP-2026-${Math.floor(Math.random() * 900 + 100)}`,
      title: req.body.title,
      clientName: req.body.clientName,
      clientOrgName: req.body.clientOrgName,
      stage: req.body.stage || 'prospect',
      estimatedValueUsd: Number(req.body.estimatedValueUsd) || 100000,
      leadSource: req.body.leadSource || 'Direct Sales',
      owner: req.body.owner || user.name,
      nextAction: req.body.nextAction || 'Discovery call',
      followUpDate: req.body.followUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.opportunities.unshift(opp);
    db.logAudit('CRM_OPPORTUNITY_CREATED', user.email, user.role, `Created opportunity ${opp.id}: ${opp.title}`);
    res.status(201).json(opp);
  });

  app.put('/api/crm/opportunities/:id/stage', (req, res) => {
    const user = (req as any).user;
    const opp = db.opportunities.find((o) => o.id === req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    opp.stage = req.body.stage;
    opp.updatedAt = new Date().toISOString();
    if (req.body.stage === 'closed_won') opp.outcome = 'won';
    if (req.body.stage === 'closed_lost') opp.outcome = 'lost';

    db.logAudit('CRM_STAGE_UPDATED', user.email, user.role, `Opportunity ${opp.id} moved to ${opp.stage}`);
    res.json(opp);
  });

  app.post('/api/crm/opportunities/:id/activities', (req, res) => {
    const user = (req as any).user;
    const opp = db.opportunities.find((o) => o.id === req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    const activity = {
      id: `act-${Date.now()}`,
      type: req.body.type || 'call',
      note: req.body.note || '',
      loggedBy: user.name,
      timestamp: new Date().toISOString(),
    };
    opp.activities.unshift(activity);
    opp.updatedAt = new Date().toISOString();
    res.status(201).json(opp);
  });

  // Operational Dashboards
  app.get('/api/operational-dashboards', (req, res) => {
    const metrics = db.getOperationalMetrics();
    res.json(metrics);
  });

  // ----------------------------------------------------
  // VITE DEV MIDDLEWARE OR PRODUCTION STATIC FILE SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Silphor Technologies Enterprise server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
