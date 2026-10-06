import {
  TechnologyCategory,
  Product,
  Partner,
  IndustrySolution,
  EngineeringService,
  CaseStudy,
  OrgUser,
  Organization,
  RFQ,
  ResourceRequirement,
  CRMOpportunity,
  PublicEnquiry,
  FeatureFlagsMap,
} from '../types';

export const api = {
  // Feature Flags
  async getFeatureFlags(): Promise<FeatureFlagsMap> {
    const res = await fetch('/api/feature-flags');
    return res.json();
  },

  async updateFeatureFlags(flags: Partial<FeatureFlagsMap>): Promise<FeatureFlagsMap> {
    const res = await fetch('/api/feature-flags', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flags),
    });
    return res.json();
  },

  // Auth / Role Switching
  async getCurrentUser(): Promise<{ user: OrgUser; allAvailableTestUsers: OrgUser[] }> {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  async switchRole(role: string, userId?: string): Promise<{ success: boolean; user: OrgUser }> {
    const res = await fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, userId }),
    });
    return res.json();
  },

  // Content Masters
  async getCategories(): Promise<TechnologyCategory[]> {
    const res = await fetch('/api/content/categories');
    return res.json();
  },

  async getProducts(params?: { category?: string; industry?: string; state?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.industry) query.append('industry', params.industry);
    if (params?.state) query.append('state', params.state);
    if (params?.featured) query.append('featured', 'true');
    const res = await fetch(`/api/content/products?${query.toString()}`);
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/content/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/content/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/content/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getPartners(params?: { type?: string; tier?: string; state?: string; approval?: string }): Promise<Partner[]> {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.tier) query.append('tier', params.tier);
    if (params?.state) query.append('state', params.state);
    if (params?.approval) query.append('approval', params.approval);
    const res = await fetch(`/api/content/partners?${query.toString()}`);
    return res.json();
  },

  async createPartner(partner: Partial<Partner>): Promise<Partner> {
    const res = await fetch('/api/content/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partner),
    });
    return res.json();
  },

  async updatePartnerApproval(id: string, status: 'approved' | 'rejected'): Promise<Partner> {
    const res = await fetch(`/api/content/partners/${id}/approval`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async getIndustries(): Promise<IndustrySolution[]> {
    const res = await fetch('/api/content/industries');
    return res.json();
  },

  async getServices(): Promise<EngineeringService[]> {
    const res = await fetch('/api/content/services');
    return res.json();
  },

  async getCaseStudies(): Promise<CaseStudy[]> {
    const res = await fetch('/api/content/case-studies');
    return res.json();
  },

  // Search Engine
  async search(params: { q?: string; categoryId?: string; industryId?: string; partnerType?: string }) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.industryId) query.append('industryId', params.industryId);
    if (params.partnerType) query.append('partnerType', params.partnerType);
    const res = await fetch(`/api/search?${query.toString()}`);
    return res.json();
  },

  // Public Enquiry
  async submitEnquiry(enquiry: {
    fullName: string;
    businessEmail: string;
    companyName: string;
    phone?: string;
    enquiryType: string;
    requirementDetails: string;
    country: string;
    _company_fax_code?: string; // honeypot
  }) {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Submission failed');
    }
    return res.json();
  },

  // RFQ Workflow
  async getRfqs(): Promise<RFQ[]> {
    const res = await fetch('/api/rfqs');
    return res.json();
  },

  async getRfqById(id: string): Promise<RFQ> {
    const res = await fetch(`/api/rfqs/${id}`);
    return res.json();
  },

  async createRfq(rfq: Partial<RFQ>): Promise<RFQ> {
    const res = await fetch('/api/rfqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfq),
    });
    return res.json();
  },

  async qualifyRfq(id: string, qualification: any): Promise<RFQ> {
    const res = await fetch(`/api/rfqs/${id}/qualify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(qualification),
    });
    return res.json();
  },

  async assignPartners(id: string, partnerIds: string[], dueDate?: string): Promise<RFQ> {
    const res = await fetch(`/api/rfqs/${id}/assign-partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerIds, dueDate }),
    });
    return res.json();
  },

  async submitQuotation(id: string, quotationData: any): Promise<RFQ> {
    const res = await fetch(`/api/rfqs/${id}/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotationData),
    });
    return res.json();
  },

  async updateRfqStatus(id: string, status: string, closureReason?: string, awardedPartnerId?: string): Promise<RFQ> {
    const res = await fetch(`/api/rfqs/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, closureReason, awardedPartnerId }),
    });
    return res.json();
  },

  // Engineering Resources
  async getResources(): Promise<ResourceRequirement[]> {
    const res = await fetch('/api/resources');
    return res.json();
  },

  async createResourceRequirement(data: any): Promise<ResourceRequirement> {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async routeResourceToProviders(id: string, providerIds: string[]): Promise<ResourceRequirement> {
    const res = await fetch(`/api/resources/${id}/route-providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerIds }),
    });
    return res.json();
  },

  async submitCandidate(id: string, candidateData: any): Promise<ResourceRequirement> {
    const res = await fetch(`/api/resources/${id}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData),
    });
    return res.json();
  },

  async updateCandidateStatus(id: string, candId: string, status: string): Promise<ResourceRequirement> {
    const res = await fetch(`/api/resources/${id}/candidates/${candId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // CRM
  async getCrmOpportunities(): Promise<CRMOpportunity[]> {
    const res = await fetch('/api/crm/opportunities');
    return res.json();
  },

  async createOpportunity(data: any): Promise<CRMOpportunity> {
    const res = await fetch('/api/crm/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateOpportunityStage(id: string, stage: string): Promise<CRMOpportunity> {
    const res = await fetch(`/api/crm/opportunities/${id}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    return res.json();
  },

  async addOpportunityActivity(id: string, activity: { type: string; note: string }): Promise<CRMOpportunity> {
    const res = await fetch(`/api/crm/opportunities/${id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return res.json();
  },

  // Operational Dashboards
  async getOperationalMetrics() {
    const res = await fetch('/api/operational-dashboards');
    return res.json();
  },
};
