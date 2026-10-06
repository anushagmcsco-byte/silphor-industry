import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  OrgUser,
  RFQ,
  ResourceRequirement,
  CRMOpportunity,
  Partner,
  Product,
  FeatureFlagsMap,
  AuditLogItem,
} from '../types';
import {
  Shield,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  TrendingUp,
  Sliders,
  DollarSign,
  Plus,
  RefreshCw,
  Eye,
  Check,
  X,
  FileCheck,
  Award,
  Layers,
  ArrowUpRight,
  Briefcase,
  Activity,
  History,
} from 'lucide-react';

interface WorkspaceViewProps {
  currentUser: OrgUser;
  onOpenRoleSwitcher: () => void;
  onNavigateRfqBuilder: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  currentUser,
  onOpenRoleSwitcher,
  onNavigateRfqBuilder,
}) => {
  // Navigation tabs within workspace
  const [activeTab, setActiveTab] = useState<
    'rfqs' | 'quotations' | 'resources' | 'crm' | 'admin_catalog' | 'feature_flags' | 'analytics'
  >('rfqs');

  // Data states
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [resources, setResources] = useState<ResourceRequirement[]>([]);
  const [crmOpportunities, setCrmOpportunities] = useState<CRMOpportunity[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagsMap | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Active detail modal/drawer for RFQ
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);

  // Quote upload modal state (for partners)
  const [quoteRfq, setQuoteRfq] = useState<RFQ | null>(null);
  const [nreCost, setNreCost] = useState('420000');
  const [unitPrice, setUnitPrice] = useState('130.00');
  const [moq, setMoq] = useState('1000');
  const [leadTime, setLeadTime] = useState('18');
  const [techNotes, setTechNotes] = useState('Verified against PDK 16nm DRC/LVS rules.');
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Qualification form state (for Silphor Admin)
  const [qualUrgency, setQualUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [qualScore, setQualScore] = useState(90);
  const [qualCategory, setQualCategory] = useState('ASIC & SoC Architecture');
  const [qualNotes, setQualNotes] = useState('Specification vetted by Silphor Architecture Team.');

  // Partner routing state (for Silphor Admin)
  const [selectedPartnerIdsToRoute, setSelectedPartnerIdsToRoute] = useState<string[]>([]);

  // Closure state
  const [closureStatus, setClosureStatus] = useState<'closed_won' | 'closed_lost' | 'cancelled' | 'deferred'>('closed_won');
  const [closureReason, setClosureReason] = useState('Terms and NRE schedule agreed by both parties.');

  // CRM new opportunity form
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppClient, setNewOppClient] = useState('');
  const [newOppValue, setNewOppValue] = useState('500000');
  const [newOppStage, setNewOppStage] = useState<any>('prospect');

  useEffect(() => {
    loadAllWorkspaceData();
  }, [currentUser]);

  const loadAllWorkspaceData = async () => {
    setLoading(true);
    try {
      const [rfqData, resData, crmData, partData, prodData, flagsData, metricsData] =
        await Promise.all([
          api.getRfqs(),
          api.getResources(),
          api.getCrmOpportunities(),
          api.getPartners(),
          api.getProducts(),
          api.getFeatureFlags(),
          api.getOperationalMetrics(),
        ]);
      setRfqs(rfqData);
      setResources(resData);
      setCrmOpportunities(crmData);
      setPartners(partData);
      setProducts(prodData);
      setFeatureFlags(flagsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerApproval = async (partnerId: string, status: 'approved' | 'rejected') => {
    try {
      await api.updatePartnerApproval(partnerId, status);
      await loadAllWorkspaceData();
    } catch (e) {
      console.error(e);
      alert('Error updating partner approval.');
    }
  };

  const handleFlagToggle = async (key: keyof FeatureFlagsMap) => {
    if (!featureFlags) return;
    try {
      const updated = await api.updateFeatureFlags({
        [key]: !featureFlags[key],
      });
      setFeatureFlags(updated);
    } catch (e) {
      console.error(e);
      alert('Failed to update feature flag. Only Silphor business users have clearance.');
    }
  };

  const handleQualifyRfq = async (rfqId: string) => {
    try {
      const updated = await api.qualifyRfq(rfqId, {
        urgency: qualUrgency,
        completenessScore: Number(qualScore),
        category: qualCategory,
        qualificationNotes: qualNotes,
      });
      setSelectedRfq(updated);
      await loadAllWorkspaceData();
      alert('RFQ successfully qualified and moved to lifecycle state.');
    } catch (e) {
      console.error(e);
      alert('Failed to qualify RFQ.');
    }
  };

  const handleRoutePartners = async (rfqId: string) => {
    if (selectedPartnerIdsToRoute.length === 0) {
      alert('Select at least one partner to route.');
      return;
    }
    try {
      const updated = await api.assignPartners(rfqId, selectedPartnerIdsToRoute);
      setSelectedRfq(updated);
      setSelectedPartnerIdsToRoute([]);
      await loadAllWorkspaceData();
      alert(`RFQ routed to ${selectedPartnerIdsToRoute.length} partner(s) with controlled access.`);
    } catch (e) {
      console.error(e);
      alert('Failed to route RFQ.');
    }
  };

  const handleSubmitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteRfq) return;
    setSubmittingQuote(true);
    try {
      await api.submitQuotation(quoteRfq.id, {
        nreCostUsd: Number(nreCost),
        unitPriceUsd: Number(unitPrice),
        moq: Number(moq),
        leadTimeWeeks: Number(leadTime),
        technicalProposalNotes: techNotes,
        commercialNotes: 'Standard 45-day commercial terms. FOB shipping point.',
      });
      setQuoteRfq(null);
      await loadAllWorkspaceData();
      alert('Quotation version submitted successfully.');
    } catch (e) {
      console.error(e);
      alert('Failed to submit quotation.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleCloseRfq = async (rfqId: string) => {
    try {
      const updated = await api.updateRfqStatus(rfqId, closureStatus, closureReason);
      setSelectedRfq(updated);
      await loadAllWorkspaceData();
      alert(`RFQ closed with status: ${closureStatus}.`);
    } catch (e) {
      console.error(e);
      alert('Failed to update closure status.');
    }
  };

  const handleCreateCrmOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createOpportunity({
        title: newOppTitle,
        clientName: newOppClient,
        clientOrgName: newOppClient,
        stage: newOppStage,
        estimatedValueUsd: Number(newOppValue),
      });
      setNewOppTitle('');
      setNewOppClient('');
      await loadAllWorkspaceData();
    } catch (e) {
      console.error(e);
      alert('Failed to create opportunity.');
    }
  };

  const handleCrmStageChange = async (oppId: string, stage: string) => {
    try {
      await api.updateOpportunityStage(oppId, stage);
      await loadAllWorkspaceData();
    } catch (e) {
      console.error(e);
      alert('Failed to update stage.');
    }
  };

  const isSilphorAdmin = currentUser.role === 'silphor_business_user';
  const isCustomer = currentUser.role === 'customer';
  const isPartner = ['principal_oem', 'distributor', 'vendor', 'engineering_provider'].includes(currentUser.role);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Top Workspace Header Bar */}
      <div className="p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        <div className="min-w-0 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
            <span className="font-mono text-teal-400 font-bold uppercase">
              {currentUser.role.replace('_', ' ')} WORKSPACE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none">
              Org: <strong className="text-white">{currentUser.orgName}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px] sm:text-[11px]">
              <Shield className="w-3 h-3" /> KYB Verified
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 break-words">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-400 break-words">
            {currentUser.title} · Role-scoped permissions active
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenRoleSwitcher}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Switch Role Persona</span>
          </button>

          {isCustomer && (
            <button
              onClick={onNavigateRfqBuilder}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New RFQ</span>
            </button>
          )}

          <button
            onClick={loadAllWorkspaceData}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs overflow-x-auto whitespace-nowrap scrollbar-none max-w-full w-full min-w-0">
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'rfqs'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>RFQs & Workflows ({rfqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'quotations'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Quotation Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'resources'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Talent & Mobilization ({resources.length})</span>
        </button>

        {isSilphorAdmin && (
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'crm'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>CRM Pipeline ({crmOpportunities.length})</span>
          </button>
        )}

        {isSilphorAdmin && (
          <button
            onClick={() => setActiveTab('admin_catalog')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'admin_catalog'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catalog & Partner Approvals</span>
          </button>
        )}

        {isSilphorAdmin && (
          <button
            onClick={() => setActiveTab('feature_flags')}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'feature_flags'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Rollout Flags</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Operational Dashboards</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. RFQ & WORKFLOWS TAB */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4 w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-400">
            <span className="leading-relaxed">
              {isCustomer
                ? 'Showing your company RFQs with live quotation status and comparison matrix'
                : isSilphorAdmin
                ? 'Showing all active RFQs for Silphor qualification, routing, and award follow-up'
                : 'Showing RFQs assigned to your partner organization with controlled access'}
            </span>
            <span className="font-mono text-teal-400 shrink-0 font-bold">{rfqs.length} Records</span>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            {rfqs.map((rfq) => {
              const myQuote = rfq.quotations.find((q) => q.partnerName === currentUser.orgName);
              return (
                <div
                  key={rfq.id}
                  className="p-4 sm:p-6 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-4 w-full"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-teal-400 font-bold text-sm">{rfq.id}</span>
                        <span>·</span>
                        <span className="text-slate-200 font-semibold">{rfq.customerOrgName}</span>
                        <span>·</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono capitalize">
                          Status: {rfq.lifecycleStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1 break-words">{rfq.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedRfq(rfq)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold cursor-pointer"
                      >
                        Inspect Details & Audit
                      </button>

                      {isPartner && (
                        <button
                          onClick={() => setQuoteRfq(rfq)}
                          className="px-3.5 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-md text-xs font-bold cursor-pointer"
                        >
                          {myQuote ? `Update Quote (v${myQuote.currentVersion + 1})` : 'Submit Quotation'}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                    {rfq.requirementDescription}
                  </p>

                  {/* Silphor Qualification Badge */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Completeness Score:</span>
                      <span className="text-teal-400 font-mono font-bold">
                        {rfq.qualification?.completenessScore || 85}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Urgency:</span>
                      <span className="text-white font-medium capitalize">
                        {rfq.qualification?.urgency || 'medium'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Assigned Silphor Owner:</span>
                      <span className="text-slate-300">
                        {rfq.qualification?.assignedOwner || 'Unassigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Annual Volume:</span>
                      <span className="text-white font-mono">
                        {rfq.estimatedVolumePerYear.toLocaleString()} units
                      </span>
                    </div>
                  </div>

                  {/* Quotations summary pill */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">
                      Assigned Partners: <strong className="text-slate-200">{rfq.assignedPartners.length}</strong> · Received Quotations: <strong className="text-teal-400 font-mono">{rfq.quotations.length}</strong>
                    </span>

                    {rfq.closureRecord && (
                      <span className="text-emerald-400 text-xs font-semibold">
                        Resolved: {rfq.closureRecord.outcome.toUpperCase()} ({rfq.closureRecord.reason})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. QUOTATION MATRIX TAB */}
      {activeTab === 'quotations' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Quotation Comparison Matrix</h2>
            <p className="text-xs text-slate-400">
              Side-by-side technical and commercial comparison across partner responses.
            </p>
          </div>

          {rfqs.map((rfq) => (
            <div key={rfq.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-teal-400 text-xs font-bold">{rfq.id}</span>
                  <h3 className="text-sm font-bold text-white">{rfq.title}</h3>
                </div>
                <span className="text-xs text-slate-400">
                  Target Date: <strong className="text-slate-200 font-mono">{rfq.targetDate}</strong>
                </span>
              </div>

              {rfq.quotations.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">
                  No quotes submitted yet for this RFQ.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2 pr-4">Partner / Vendor</th>
                        <th className="py-2 pr-4">Version</th>
                        <th className="py-2 pr-4">NRE Cost (USD)</th>
                        <th className="py-2 pr-4">Unit Price</th>
                        <th className="py-2 pr-4">Lead Time</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2">Proposal Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {rfq.quotations.map((q) => {
                        const latest = q.versions[0];
                        return (
                          <tr key={q.id} className="text-slate-300">
                            <td className="py-2.5 pr-4 font-semibold text-white">{q.partnerName}</td>
                            <td className="py-2.5 pr-4 font-mono text-teal-400">v{q.currentVersion}</td>
                            <td className="py-2.5 pr-4 font-mono tabular-nums text-white">
                              ${latest?.nreCostUsd?.toLocaleString()}
                            </td>
                            <td className="py-2.5 pr-4 font-mono tabular-nums text-emerald-400">
                              ${latest?.unitPriceUsd?.toFixed(2)}
                            </td>
                            <td className="py-2.5 pr-4 font-mono">{latest?.leadTimeWeeks} Wks</td>
                            <td className="py-2.5 pr-4">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono capitalize">
                                {q.status}
                              </span>
                            </td>
                            <td className="py-2.5 max-w-xs truncate text-slate-400">
                              {latest?.technicalProposalNotes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. TALENT & MOBILIZATION BOARD TAB */}
      {activeTab === 'resources' && (
        <div className="space-y-6 w-full max-w-full">
          <div className="p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Engineering Talent Mobilization Board</h2>
              <p className="text-xs text-slate-400">
                Track candidates through screening, interviewing, selection, and site deployment.
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-500">Active Requisitions:</span>
              <div className="text-xl font-bold font-mono text-teal-400">{resources.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-teal-400 font-bold">{res.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {res.experienceLevel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{res.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Req: {res.quantity} Positions · Location: {res.location}
                  </div>

                  {/* Candidates */}
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-slate-400">Candidate Pipeline:</div>
                    {res.candidates.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">No candidates submitted yet.</div>
                    ) : (
                      res.candidates.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-white">{c.candidateName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              ${c.proposedHourlyRateUsd}/hr · {c.experienceYears}y exp
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 capitalize">
                            {c.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Max ${res.budgetHourlyRateMaxUsd}/hr
                  </span>
                  <span className="text-emerald-400 font-semibold capitalize text-[11px]">
                    Status: {res.mobilizationStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CRM SALES PIPELINE KANBAN (Silphor Admin) */}
      {activeTab === 'crm' && isSilphorAdmin && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Silphor CRM & Commercial Funnel</h2>
              <p className="text-xs text-slate-400">
                Opportunity stages, lead tracking, next actions, and pipeline value.
              </p>
            </div>

            <form onSubmit={handleCreateCrmOpportunity} className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                required
                placeholder="Opportunity Title"
                value={newOppTitle}
                onChange={(e) => setNewOppTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                required
                placeholder="Client Org"
                value={newOppClient}
                onChange={(e) => setNewOppClient(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="number"
                placeholder="Value USD"
                value={newOppValue}
                onChange={(e) => setNewOppValue(e.target.value)}
                className="w-28 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg cursor-pointer"
              >
                + Add Deal
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['prospect', 'qualified', 'proposal_rfq', 'negotiation'].map((stageName) => {
              const oppsInStage = crmOpportunities.filter((o) => o.stage === stageName);
              const stageTotal = oppsInStage.reduce((sum, o) => sum + o.estimatedValueUsd, 0);

              return (
                <div
                  key={stageName}
                  className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-mono text-xs font-bold text-teal-400 uppercase">
                      {stageName.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ${(stageTotal / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="space-y-3">
                    {oppsInStage.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-teal-400">{opp.id}</span>
                          <span className="font-mono font-bold text-white">
                            ${opp.estimatedValueUsd.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-white">{opp.title}</h4>
                        <div className="text-[11px] text-slate-400">{opp.clientOrgName}</div>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                          Next Action: {opp.nextAction}
                        </div>

                        {/* Move stage controls */}
                        <div className="pt-2 flex items-center justify-between text-[11px]">
                          <select
                            value={opp.stage}
                            onChange={(e) => handleCrmStageChange(opp.id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-300"
                          >
                            <option value="prospect">Prospect</option>
                            <option value="qualified">Qualified</option>
                            <option value="solutioning">Solutioning</option>
                            <option value="proposal_rfq">Proposal/RFQ</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="closed_won">Closed Won</option>
                            <option value="closed_lost">Closed Lost</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MASTER DATA ADMIN & PARTNER APPROVALS (Silphor Admin) */}
      {activeTab === 'admin_catalog' && isSilphorAdmin && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-lg font-bold text-white">Partner Profiles & Sensitive Catalog Approvals</h2>
            <p className="text-xs text-slate-400">
              Silphor admin control for verifying newly onboarded partner accounts and publishing products.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Partner Approval Queue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2 pr-4">Partner Name</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Country</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Operational Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {partners.map((p) => (
                    <tr key={p.id} className="text-slate-300">
                      <td className="py-3 pr-4 font-semibold text-white">{p.name}</td>
                      <td className="py-3 pr-4 font-mono capitalize">{p.type.replace('_', ' ')}</td>
                      <td className="py-3 pr-4">{p.country}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            p.profileApprovalStatus === 'approved'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.profileApprovalStatus}
                        </span>
                      </td>
                      <td className="py-3 flex items-center gap-2">
                        {p.profileApprovalStatus !== 'approved' && (
                          <button
                            onClick={() => handlePartnerApproval(p.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded hover:bg-emerald-500 hover:text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Approve Profile
                          </button>
                        )}
                        {p.profileApprovalStatus === 'approved' && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. ROLLOUT FEATURE FLAGS CONTROL ROOM */}
      {activeTab === 'feature_flags' && isSilphorAdmin && (
        <div className="p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Release Phasing & Industry Feature Flags</h2>
              <p className="text-xs text-slate-400">
                Directly manages the production rollout strategy for Silphor modules across environments.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-md shrink-0 w-fit">
              Rollout Engine Active
            </span>
          </div>

          {featureFlags && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(featureFlags).map(([key, isEnabled]) => (
                <div
                  key={key}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-semibold text-white block">
                      {key}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isEnabled ? 'Enabled / Active' : 'Off / Pilot Stage'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleFlagToggle(key as keyof FeatureFlagsMap)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isEnabled ? 'bg-teal-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. OPERATIONAL DASHBOARDS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 w-full max-w-full">
          <div className="p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Operational Dashboards & SLAs</h2>
              <p className="text-xs text-slate-400">
                RFQ ageing distribution, partner response SLAs, and resource fulfillment metrics.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400 shrink-0">Live Telemetry</span>
          </div>

          {metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs text-slate-500 font-medium">Avg Partner Response SLA</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {metrics.avgPartnerResponseHours} hrs
                </div>
                <span className="text-[11px] text-emerald-400">Target SLA &lt; 48 hrs</span>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs text-slate-500 font-medium">Total Pipeline Value</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  ${(metrics.totalPipelineValue / 1000).toFixed(0)}k
                </div>
                <span className="text-[11px] text-slate-400">Across Active Deals</span>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs text-slate-500 font-medium">Resource Fulfillment</span>
                <div className="text-2xl font-bold font-mono text-teal-400">
                  {metrics.resourceFulfillmentRate}%
                </div>
                <span className="text-[11px] text-slate-400">
                  {metrics.mobilizedOrSelectedCandidates} of {metrics.totalRequiredPositions} Positions
                </span>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs text-slate-500 font-medium">RFQ Ageing (&lt; 7 Days)</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {metrics.rfqAgeing?.under7Days || 0} RFQs
                </div>
                <span className="text-[11px] text-slate-400">Current active cohort</span>
              </div>
            </div>
          )}

          {/* Audit telemetry feed */}
          {metrics?.recentAuditLogs && (
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-teal-400" />
                Live System Audit & Telemetry Feed
              </h3>
              <div className="space-y-2">
                {metrics.recentAuditLogs.map((log: AuditLogItem) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <div>
                      <span className="font-mono text-teal-400 font-semibold">{log.action}: </span>
                      <span className="text-slate-300">{log.details}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()} · {log.actorEmail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RFQ DETAIL MODAL (Qualification, Routing, Comparison, Closure) */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
                  <span>{selectedRfq.id}</span>
                  <span>·</span>
                  <span className="text-slate-300">{selectedRfq.customerOrgName}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">{selectedRfq.title}</h2>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Requirement Description
              </h3>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {selectedRfq.requirementDescription}
              </p>
            </div>

            {/* Silphor Admin Qualification Section */}
            {isSilphorAdmin && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Silphor Triage & Qualification Desk
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Urgency Level</label>
                    <select
                      value={qualUrgency}
                      onChange={(e) => setQualUrgency(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Completeness Score (0-100)</label>
                    <input
                      type="number"
                      value={qualScore}
                      onChange={(e) => setQualScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={qualCategory}
                      onChange={(e) => setQualCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleQualifyRfq(selectedRfq.id)}
                  className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Silphor Qualification
                </button>
              </div>
            )}

            {/* Route to Partners Section */}
            {isSilphorAdmin && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Route RFQ to Qualified Partners & Foundries
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {partners.map((p) => {
                    const isChecked = selectedPartnerIdsToRoute.includes(p.id);
                    const isAlreadyAssigned = selectedRfq.assignedPartners.some(
                      (ap) => ap.partnerId === p.id
                    );
                    return (
                      <label
                        key={p.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer ${
                          isAlreadyAssigned
                            ? 'bg-slate-900/40 border-slate-800 opacity-60'
                            : isChecked
                            ? 'bg-teal-950/40 border-teal-500/50'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <span className="text-slate-200">
                          {p.name} ({p.tier})
                        </span>
                        <input
                          type="checkbox"
                          disabled={isAlreadyAssigned}
                          checked={isChecked || isAlreadyAssigned}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPartnerIdsToRoute([...selectedPartnerIdsToRoute, p.id]);
                            } else {
                              setSelectedPartnerIdsToRoute(
                                selectedPartnerIdsToRoute.filter((id) => id !== p.id)
                              );
                            }
                          }}
                        />
                      </label>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleRoutePartners(selectedRfq.id)}
                  className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Dispatch Access to Selected Partners
                </button>
              </div>
            )}

            {/* Quotations on this RFQ */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Submitted Quotations ({selectedRfq.quotations.length})
              </h3>
              {selectedRfq.quotations.length === 0 ? (
                <p className="text-xs text-slate-500">No partner quotes uploaded yet.</p>
              ) : (
                <div className="space-y-3">
                  {selectedRfq.quotations.map((q) => {
                    const v = q.versions[0];
                    return (
                      <div
                        key={q.id}
                        className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{q.partnerName}</span>
                          <span className="font-mono text-teal-400">Current Rev: v{q.currentVersion}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <div>NRE: ${v?.nreCostUsd?.toLocaleString()}</div>
                          <div>Unit: ${v?.unitPriceUsd?.toFixed(2)}</div>
                          <div>Lead: {v?.leadTimeWeeks} Wks</div>
                        </div>
                        <p className="text-slate-400 text-[11px]">{v?.technicalProposalNotes}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Closure Controls */}
            {isSilphorAdmin && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  RFQ Closure & Award State
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <select
                    value={closureStatus}
                    onChange={(e) => setClosureStatus(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="closed_won">Award & Close Won</option>
                    <option value="closed_lost">Close Lost</option>
                    <option value="cancelled">Cancel RFQ</option>
                    <option value="deferred">Defer Project</option>
                  </select>
                  <input
                    type="text"
                    value={closureReason}
                    onChange={(e) => setClosureReason(e.target.value)}
                    placeholder="Reason for closure..."
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
                <button
                  onClick={() => handleCloseRfq(selectedRfq.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg text-xs"
                >
                  Finalize RFQ Closure
                </button>
              </div>
            )}

            {/* Audit Trail */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                RFQ Audit Trail
              </h3>
              <div className="space-y-1.5 max-h-36 overflow-y-auto text-[11px] font-mono text-slate-400">
                {selectedRfq.auditTrail.map((aud) => (
                  <div key={aud.id} className="p-2 bg-slate-950 rounded border border-slate-800/80">
                    <span className="text-teal-400">[{aud.action}]</span> {aud.details} (by {aud.actorEmail})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER QUOTATION UPLOAD MODAL */}
      {quoteRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold text-white">
              Submit Quotation for {quoteRfq.id}
            </h2>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.orgName}).
            </p>

            <form onSubmit={handleSubmitQuotation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">NRE Cost (USD) *</label>
                  <input
                    type="number"
                    required
                    value={nreCost}
                    onChange={(e) => setNreCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">MOQ (Units)</label>
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Lead Time (Weeks)</label>
                  <input
                    type="number"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technical Proposal & PDK Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuoteRfq(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuote}
                  className="px-5 py-2 bg-teal-400 text-slate-950 font-bold rounded-lg"
                >
                  {submittingQuote ? 'Uploading...' : 'Submit Quotation Version'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
