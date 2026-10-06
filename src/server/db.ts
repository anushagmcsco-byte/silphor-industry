import {
  TechnologyCategory,
  Product,
  Partner,
  IndustrySolution,
  EngineeringService,
  CaseStudy,
  Organization,
  OrgUser,
  Invitation,
  RFQ,
  ResourceRequirement,
  CRMOpportunity,
  PublicEnquiry,
  FeatureFlagsMap,
  AuditLogItem,
  UserRole,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialPartners,
  initialIndustries,
  initialEngineeringServices,
  initialCaseStudies,
  initialOrganizations,
  initialUsers,
  initialRFQs,
  initialResourceRequirements,
  initialOpportunities,
  initialEnquiries,
  initialFeatureFlags,
} from './data';

class DatabaseStore {
  public categories: TechnologyCategory[] = [...initialCategories];
  public products: Product[] = [...initialProducts];
  public partners: Partner[] = [...initialPartners];
  public industries: IndustrySolution[] = [...initialIndustries];
  public services: EngineeringService[] = [...initialEngineeringServices];
  public caseStudies: CaseStudy[] = [...initialCaseStudies];
  public organizations: Organization[] = [...initialOrganizations];
  public users: OrgUser[] = [...initialUsers];
  public invitations: Invitation[] = [];
  public rfqs: RFQ[] = [...initialRFQs];
  public resourceRequirements: ResourceRequirement[] = [...initialResourceRequirements];
  public opportunities: CRMOpportunity[] = [...initialOpportunities];
  public enquiries: PublicEnquiry[] = [...initialEnquiries];
  public featureFlags: FeatureFlagsMap = { ...initialFeatureFlags };
  public auditLogs: AuditLogItem[] = [];

  constructor() {
    this.logAudit(
      'SYSTEM_INITIALIZED',
      'system@silphor.com',
      'silphor_business_user',
      'Database store initialized with semiconductor catalog masters.'
    );
  }

  public logAudit(action: string, actorEmail: string, actorRole: string, details: string): AuditLogItem {
    const item: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actorEmail,
      actorRole,
      details,
    };
    this.auditLogs.unshift(item);
    return item;
  }

  // Search Engine: Full-Text and Faceted Search
  public searchCatalog(params: {
    query?: string;
    categoryId?: string;
    industryId?: string;
    partnerType?: string;
    publicationState?: string;
  }) {
    const q = (params.query || '').trim().toLowerCase();

    const filteredProducts = this.products.filter((p) => {
      if (params.publicationState && p.publicationState !== params.publicationState) return false;
      if (params.categoryId && p.categoryId !== params.categoryId) return false;
      if (params.industryId && !p.industryIds.includes(params.industryId)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        Object.values(p.specs).some((v) => v.toLowerCase().includes(q))
      );
    });

    const filteredPartners = this.partners.filter((p) => {
      if (params.publicationState && p.publicationState !== params.publicationState) return false;
      if (params.partnerType && p.type !== params.partnerType) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.capabilities.some((c) => c.toLowerCase().includes(q)) ||
        p.certifications.some((c) => c.toLowerCase().includes(q))
      );
    });

    const filteredServices = this.services.filter((s) => {
      if (params.publicationState && s.publicationState !== params.publicationState) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.deliverables.some((d) => d.toLowerCase().includes(q))
      );
    });

    const filteredIndustries = this.industries.filter((ind) => {
      if (!q) return true;
      return (
        ind.name.toLowerCase().includes(q) ||
        ind.summary.toLowerCase().includes(q) ||
        ind.keyUseCases.some((k) => k.toLowerCase().includes(q))
      );
    });

    return {
      products: filteredProducts,
      partners: filteredPartners,
      services: filteredServices,
      industries: filteredIndustries,
      totalCount:
        filteredProducts.length +
        filteredPartners.length +
        filteredServices.length +
        filteredIndustries.length,
    };
  }

  // RFQ Analytics & Dashboards
  public getOperationalMetrics() {
    const now = Date.now();
    const rfqAgeing = {
      under7Days: 0,
      days7to14: 0,
      days14to30: 0,
      over30Days: 0,
    };

    let totalSlaMinutes = 0;
    let quotedCount = 0;

    this.rfqs.forEach((rfq) => {
      const created = new Date(rfq.createdAt).getTime();
      const ageDays = (now - created) / (1000 * 60 * 60 * 24);
      if (ageDays <= 7) rfqAgeing.under7Days++;
      else if (ageDays <= 14) rfqAgeing.days7to14++;
      else if (ageDays <= 30) rfqAgeing.days14to30++;
      else rfqAgeing.over30Days++;

      if (rfq.quotations.length > 0) {
        rfq.quotations.forEach((q) => {
          if (q.versions.length > 0) {
            const firstSubmitted = new Date(q.versions[0].submittedAt).getTime();
            totalSlaMinutes += Math.max(0, (firstSubmitted - created) / (1000 * 60));
            quotedCount++;
          }
        });
      }
    });

    const avgPartnerResponseHours =
      quotedCount > 0 ? (totalSlaMinutes / quotedCount / 60).toFixed(1) : '28.4';

    // Opportunity pipeline stages
    const opportunityPipeline = this.opportunities.reduce(
      (acc, opp) => {
        acc[opp.stage] = (acc[opp.stage] || 0) + opp.estimatedValueUsd;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalPipelineValue = this.opportunities.reduce(
      (sum, opp) => (opp.outcome !== 'lost' ? sum + opp.estimatedValueUsd : sum),
      0
    );

    // Open Resource requirements
    const totalRequiredPositions = this.resourceRequirements.reduce((sum, r) => sum + r.quantity, 0);
    const mobilizedOrSelectedCandidates = this.resourceRequirements.reduce((sum, r) => {
      const active = r.candidates.filter(
        (c) => c.status === 'selected' || c.status === 'mobilized'
      ).length;
      return sum + active;
    }, 0);

    return {
      totalRfqs: this.rfqs.length,
      activeBiddingRfqs: this.rfqs.filter((r) => r.lifecycleStatus === 'bidding' || r.lifecycleStatus === 'comparison').length,
      rfqAgeing,
      avgPartnerResponseHours: Number(avgPartnerResponseHours),
      totalPipelineValue,
      opportunityPipeline,
      totalRequiredPositions,
      mobilizedOrSelectedCandidates,
      resourceFulfillmentRate:
        totalRequiredPositions > 0
          ? Math.round((mobilizedOrSelectedCandidates / totalRequiredPositions) * 100)
          : 0,
      recentAuditLogs: this.auditLogs.slice(0, 10),
    };
  }
}

export const db = new DatabaseStore();
