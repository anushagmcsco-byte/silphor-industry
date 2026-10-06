/**
 * Silphor Technologies Enterprise Data Models & Type Definitions
 */

export type PublicationState = 'draft' | 'under_review' | 'published' | 'archived';

export type UserRole =
  | 'customer'
  | 'principal_oem'
  | 'distributor'
  | 'vendor'
  | 'engineering_provider'
  | 'silphor_business_user';

export type RFQLifecycleStatus =
  | 'draft'
  | 'submitted'
  | 'qualified'
  | 'routed'
  | 'bidding'
  | 'comparison'
  | 'negotiation'
  | 'awarded'
  | 'closed_won'
  | 'closed_lost'
  | 'cancelled'
  | 'deferred';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type MobilizationStatus =
  | 'requested'
  | 'submitted_profiles'
  | 'interviewing'
  | 'selected'
  | 'mobilizing'
  | 'deployed'
  | 'released';

export type CRMOpportunityStage =
  | 'prospect'
  | 'qualified'
  | 'solutioning'
  | 'proposal_rfq'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface TechnologyCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  publicationState: PublicationState;
}

export interface ProductDocument {
  id: string;
  title: string;
  docType: 'datasheet' | 'user_manual' | 'application_note' | 'compliance_cert';
  fileSize: string;
  version: string;
  downloadUrl: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  tagline: string;
  description: string;
  specs: Record<string, string>;
  industryIds: string[];
  publicationState: PublicationState;
  vendorId?: string;
  vendorName?: string;
  featured: boolean;
  documents: ProductDocument[];
  lifecyclePhase: 'Active' | 'Sampling' | 'Mature' | 'Preview';
}

export interface Partner {
  id: string;
  name: string;
  type: 'principal_oem' | 'distributor' | 'vendor' | 'engineering_provider' | 'foundry';
  tier: 'Strategic' | 'Certified' | 'Premier';
  country: string;
  headquarters: string;
  website: string;
  description: string;
  capabilities: string[];
  certifications: string[];
  publicationState: PublicationState;
  profileApprovalStatus: 'pending' | 'approved' | 'rejected';
  contactEmail: string;
}

export interface IndustrySolution {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  keyUseCases: string[];
  complianceStandards: string[];
  featuredTech: string[];
  publicationState: PublicationState;
}

export interface EngineeringService {
  id: string;
  title: string;
  domain: 'ASIC & SoC' | 'FPGA' | 'Embedded & Firmware' | 'Verification & UVM' | 'PCB & Hardware' | 'Turnkey Silicon';
  description: string;
  deliverables: string[];
  toolsAndStandards: string[];
  leadTimeWeeks: string;
  publicationState: PublicationState;
}

export interface CaseStudy {
  id: string;
  title: string;
  clientIndustry: string;
  challenge: string;
  solution: string;
  quantifiedImpact: string;
  durationMonths: number;
  featured: boolean;
  publicationState: PublicationState;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Customer' | 'Principal' | 'Distributor' | 'Vendor' | 'EngineeringPartner' | 'SilphorInternal';
  country: string;
  domain: string;
  kybStatus: 'verified' | 'pending' | 'under_review';
  ndaSigned: boolean;
}

export interface OrgUser {
  id: string;
  orgId: string;
  orgName: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  token?: string;
}

export interface Invitation {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
}

export interface RFQAttachment {
  id: string;
  filename: string;
  fileSize: string;
  uploadedAt: string;
}

export interface QuotationVersion {
  version: number;
  nreCostUsd: number;
  unitPriceUsd: number;
  currency: string;
  moq: number;
  leadTimeWeeks: number;
  technicalProposalNotes: string;
  commercialNotes: string;
  attachmentName?: string;
  submittedAt: string;
  submittedBy: string;
}

export interface PartnerQuotation {
  id: string;
  rfqId: string;
  partnerId: string;
  partnerName: string;
  currentVersion: number;
  versions: QuotationVersion[];
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'awarded' | 'declined';
  updatedAt: string;
}

export interface RFQAssignment {
  partnerId: string;
  partnerName: string;
  assignedAt: string;
  dueDate: string;
  status: 'notified' | 'viewed' | 'submitted' | 'declined';
  confidentialityAccepted: boolean;
}

export interface SilphorQualification {
  category: string;
  geography: string;
  urgency: UrgencyLevel;
  completenessScore: number; // 0-100
  assignedOwner: string;
  followUpDate: string;
  qualificationNotes: string;
}

export interface ClosureRecord {
  outcome: 'won' | 'lost' | 'cancelled' | 'deferred';
  reason: string;
  closedAt: string;
  closedBy: string;
  feedbackNotes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  actorRole: string;
  details: string;
}

export interface RFQ {
  id: string; // e.g. RFQ-2026-1042
  title: string;
  customerId: string;
  customerName: string;
  customerOrgId: string;
  customerOrgName: string;
  requirementDescription: string;
  tags: string[];
  targetDate: string;
  estimatedVolumePerYear: number;
  lifecycleStatus: RFQLifecycleStatus;
  qualification: SilphorQualification;
  assignedPartners: RFQAssignment[];
  quotations: PartnerQuotation[];
  attachments: RFQAttachment[];
  closureRecord?: ClosureRecord;
  auditTrail: AuditLogItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  providerId: string;
  providerName: string;
  candidateName: string;
  experienceYears: number;
  keySkills: string[];
  noticePeriodDays: number;
  proposedHourlyRateUsd: number;
  status: 'submitted' | 'interview_scheduled' | 'selected' | 'rejected' | 'mobilized';
  submissionNotes: string;
}

export interface ResourceRequirement {
  id: string; // e.g. RES-2026-088
  title: string;
  customerId: string;
  customerOrgName: string;
  skill: string;
  subSkills: string[];
  quantity: number;
  experienceLevel: 'Junior (2-4y)' | 'Mid-Senior (5-8y)' | 'Principal/Staff (9-14y)' | 'Domain Fellow';
  location: string;
  workModel: 'Onsite' | 'Hybrid' | 'Remote';
  startDate: string;
  durationMonths: number;
  shiftAndSite: string;
  complianceStandards: string[]; // e.g. ITAR, ISO 26262, AS9100
  budgetHourlyRateMaxUsd: number;
  mobilizationStatus: MobilizationStatus;
  assignedProviders: {
    providerId: string;
    providerName: string;
    routedAt: string;
  }[];
  candidates: CandidateProfile[];
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'call' | 'email' | 'technical_review' | 'site_audit' | 'status_change';
  note: string;
  loggedBy: string;
  timestamp: string;
}

export interface CRMOpportunity {
  id: string; // e.g. OPP-2026-409
  title: string;
  clientName: string;
  clientOrgName: string;
  stage: CRMOpportunityStage;
  estimatedValueUsd: number;
  leadSource: 'Web Enquiry' | 'Partner Referral' | 'Direct Sales' | 'RFQ Submission' | 'Industry Expo';
  owner: string;
  linkedRfqId?: string;
  nextAction: string;
  followUpDate: string;
  activities: ActivityLog[];
  outcome?: 'won' | 'lost';
  outcomeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicEnquiry {
  id: string;
  fullName: string;
  companyName: string;
  businessEmail: string;
  phone?: string;
  enquiryType: 'Hardware Solutions' | 'Engineering Services' | 'Global Partnership' | 'General Inquiry';
  requirementDetails: string;
  country: string;
  honeypotCheckPassed: boolean;
  ipAddressMasked: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'converted_to_rfq' | 'closed';
}

export interface FeatureFlagsMap {
  public_partner_directory: boolean;
  product_catalog: boolean;
  contact_forms: boolean;
  enterprise_login: boolean;
  partner_login: boolean;
  rfq_submission: boolean;
  rfq_partner_routing: boolean;
  quotation_upload: boolean;
  engineering_requirements: boolean;
  crm_workspace: boolean;
  advanced_search: boolean;
}
