import React, { useState } from 'react';
import { ResourceRequirement, OrgUser } from '../types';
import { api } from '../services/api';
import {
  Users,
  Briefcase,
  Plus,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  Send,
  UserCheck,
} from 'lucide-react';

interface ResourceRequirementsViewProps {
  resources: ResourceRequirement[];
  currentUser: OrgUser;
  onRefresh: () => void;
  onNavigateWorkspace: () => void;
}

export const ResourceRequirementsView: React.FC<ResourceRequirementsViewProps> = ({
  resources,
  currentUser,
  onRefresh,
  onNavigateWorkspace,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submittingCandidateForReq, setSubmittingCandidateForReq] = useState<ResourceRequirement | null>(null);

  // Form states for creating requirement
  const [reqTitle, setReqTitle] = useState('');
  const [reqSkill, setReqSkill] = useState('SystemVerilog & UVM Testbench Architecture');
  const [reqQuantity, setReqQuantity] = useState(2);
  const [reqExperience, setReqExperience] = useState('Principal/Staff (9-14y)');
  const [reqLocation, setReqLocation] = useState('Munich, Germany / Hybrid');
  const [reqBudget, setReqBudget] = useState(140);
  const [creatingReq, setCreatingReq] = useState(false);

  // Form states for submitting candidate profile
  const [candName, setCandName] = useState('');
  const [candExp, setCandExp] = useState(8);
  const [candSkillsStr, setCandSkillsStr] = useState('UVM, SVA, PCIe Gen 5');
  const [candRate, setCandRate] = useState(130);
  const [candNotice, setCandNotice] = useState(15);
  const [submittingCand, setSubmittingCand] = useState(false);

  const filtered = resources.filter((r) => {
    if (selectedSkillFilter !== 'all' && !r.skill.toLowerCase().includes(selectedSkillFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingReq(true);
    try {
      await api.createResourceRequirement({
        title: reqTitle,
        skill: reqSkill,
        quantity: reqQuantity,
        experienceLevel: reqExperience,
        location: reqLocation,
        budgetHourlyRateMaxUsd: reqBudget,
        durationMonths: 12,
        shiftAndSite: 'Standard Day shift / Secured VPN',
        complianceStandards: ['ITAR Compliance', 'Clean IP Background Check'],
      });
      setShowCreateModal(false);
      setReqTitle('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit requisition.');
    } finally {
      setCreatingReq(false);
    }
  };

  const handleSubmitCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingCandidateForReq) return;
    setSubmittingCand(true);
    try {
      await api.submitCandidate(submittingCandidateForReq.id, {
        candidateName: candName,
        experienceYears: candExp,
        keySkills: candSkillsStr.split(',').map((s) => s.trim()),
        proposedHourlyRateUsd: candRate,
        noticePeriodDays: candNotice,
        submissionNotes: `Verified candidate profile submitted by ${currentUser.name} (${currentUser.orgName}).`,
      });
      setSubmittingCandidateForReq(null);
      setCandName('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit candidate profile.');
    } finally {
      setSubmittingCand(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Phase I-D · Specialized Engineering Talent</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Engineering Resource Requirements</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Enterprise requisitions for mission-critical VLSI, physical design, and verification engineers. Routed through verified engineering providers with rapid mobilization tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Requisition</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <button
          onClick={() => setSelectedSkillFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedSkillFilter === 'all'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Open Requisitions ({resources.length})
        </button>
        <button
          onClick={() => setSelectedSkillFilter('verification')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedSkillFilter === 'verification'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          UVM Verification
        </button>
        <button
          onClick={() => setSelectedSkillFilter('physical')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedSkillFilter === 'physical'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Physical Design (5nm/3nm)
        </button>
      </div>

      {/* Requisitions List */}
      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-teal-400 font-bold">{r.id}</span>
                  <span>·</span>
                  <span className="text-slate-300 font-medium">{r.customerOrgName}</span>
                  <span>·</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px]">
                    Status: {r.mobilizationStatus.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{r.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-emerald-400">
                  ${r.budgetHourlyRateMaxUsd}/hr max
                </span>
                <button
                  onClick={() => setSubmittingCandidateForReq(r)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  Submit Candidate Profile
                </button>
              </div>
            </div>

            {/* Requisition Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-slate-500 text-[11px] block">Positions Needed:</span>
                <span className="text-white font-semibold font-mono">{r.quantity} Engineers</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Experience Band:</span>
                <span className="text-white font-medium">{r.experienceLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Location & Model:</span>
                <span className="text-white font-medium">{r.location} ({r.workModel})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Start & Duration:</span>
                <span className="text-white font-mono">{r.startDate} ({r.durationMonths}mo)</span>
              </div>
            </div>

            {/* Subskills & Compliance */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Sub-Skills:</span>
              {r.subSkills.map((sk, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                  {sk}
                </span>
              ))}
              <span className="text-slate-600">|</span>
              <span className="text-slate-500 text-[11px]">Compliance:</span>
              {r.complianceStandards.map((st, i) => (
                <span key={i} className="text-teal-400 font-mono text-[11px]">
                  {st}
                </span>
              ))}
            </div>

            {/* Candidate Submissions Stream */}
            {r.candidates.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Candidate Pipeline ({r.candidates.length} Profiles Submitted):</span>
                  <button
                    onClick={onNavigateWorkspace}
                    className="text-teal-400 hover:underline text-[11px]"
                  >
                    Manage on Mobilization Board →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {r.candidates.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{c.candidateName}</div>
                        <div className="text-[11px] text-slate-400">
                          {c.experienceYears}y exp · ${c.proposedHourlyRateUsd}/hr · Notice: {c.noticePeriodDays}d
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 capitalize">
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Create Requisition */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold text-white">Create Engineering Resource Requisition</h2>
            <form onSubmit={handleCreateRequirement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Requisition Title *</label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Lead UVM Verification Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Hourly Rate (USD) *</label>
                  <input
                    type="number"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Location / Work Model *</label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  placeholder="e.g. Munich, Germany (Hybrid) or Remote"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingReq}
                  className="px-5 py-2 bg-teal-400 text-slate-950 font-bold rounded-lg"
                >
                  {creatingReq ? 'Submitting...' : 'Post Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Candidate Profile */}
      {submittingCandidateForReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold text-white">
              Submit Candidate: {submittingCandidateForReq.id}
            </h2>
            <p className="text-xs text-slate-400">
              Submit an engineered profile from your talent roster for "{submittingCandidateForReq.title}".
            </p>
            <form onSubmit={handleSubmitCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="e.g. Arunav Sengupta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Exp (Years) *</label>
                  <input
                    type="number"
                    min="1"
                    value={candExp}
                    onChange={(e) => setCandExp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rate ($/hr) *</label>
                  <input
                    type="number"
                    value={candRate}
                    onChange={(e) => setCandRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Notice (Days) *</label>
                  <input
                    type="number"
                    value={candNotice}
                    onChange={(e) => setCandNotice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Key Skills (comma-separated)</label>
                <input
                  type="text"
                  value={candSkillsStr}
                  onChange={(e) => setCandSkillsStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittingCandidateForReq(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCand}
                  className="px-5 py-2 bg-teal-400 text-slate-950 font-bold rounded-lg"
                >
                  {submittingCand ? 'Submitting...' : 'Submit Profile to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
