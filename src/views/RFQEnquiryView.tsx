import React, { useState } from 'react';
import { api } from '../services/api';
import { Product, OrgUser } from '../types';
import {
  FileText,
  Send,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Upload,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface RFQEnquiryViewProps {
  currentUser: OrgUser;
  prefilledProduct?: Product | null;
  onRfqCreated: () => void;
  onNavigateWorkspace: () => void;
}

export const RFQEnquiryView: React.FC<RFQEnquiryViewProps> = ({
  currentUser,
  prefilledProduct,
  onRfqCreated,
  onNavigateWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'rfq' | 'public_enquiry'>('rfq');

  // Enterprise RFQ State
  const [rfqTitle, setRfqTitle] = useState(
    prefilledProduct ? `RFQ: Custom Silicon / Integration for ${prefilledProduct.name}` : ''
  );
  const [category, setCategory] = useState(prefilledProduct?.categoryName || 'ASIC & SoC Architecture');
  const [volume, setVolume] = useState('25000');
  const [targetDate, setTargetDate] = useState('2026-12-01');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [description, setDescription] = useState(
    prefilledProduct
      ? `Requesting turnkey custom adaptation of ${prefilledProduct.sku} (${prefilledProduct.name}). Need integration guidelines, custom packaging constraints, and tapeout NRE estimates.`
      : ''
  );
  const [submittingRfq, setSubmittingRfq] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState<string | null>(null);

  // Public Enquiry State (with honeypot anti-abuse)
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState('Hardware Solutions');
  const [requirementDetails, setRequirementDetails] = useState('');
  const [country, setCountry] = useState('United States');
  const [honeypot, setHoneypot] = useState(''); // Anti-abuse honeypot trap
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState<any | null>(null);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRfq(true);
    try {
      const created = await api.createRfq({
        title: rfqTitle,
        requirementDescription: description,
        estimatedVolumePerYear: Number(volume),
        targetDate,
        tags: [category, urgency.toUpperCase()],
      });
      setRfqSuccess(created.id);
      onRfqCreated();
    } catch (err) {
      console.error(err);
      alert('Failed to submit RFQ.');
    } finally {
      setSubmittingRfq(false);
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEnquiry(true);
    setEnquiryError(null);
    try {
      const res = await api.submitEnquiry({
        fullName,
        companyName,
        businessEmail,
        phone,
        enquiryType,
        requirementDetails,
        country,
        _company_fax_code: honeypot, // Honeypot trap check
      });
      setEnquirySuccess(res);
    } catch (err: any) {
      console.error(err);
      setEnquiryError(err.message || 'Submission error');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold text-white">RFQ / Technical Enquiry</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Submit formal enterprise Requests for Quotation (RFQs) for silicon design & turnkey fabrication, or send a general technical discovery enquiry.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6 p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-fit text-xs">
          <button
            onClick={() => setActiveTab('rfq')}
            className={`px-4 py-2.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
              activeTab === 'rfq'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Enterprise RFQ Builder (Phase I-C)
          </button>
          <button
            onClick={() => setActiveTab('public_enquiry')}
            className={`px-4 py-2.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
              activeTab === 'public_enquiry'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Public Enquiry Form (Anti-Abuse + Audit)
          </button>
        </div>
      </div>

      {/* TAB 1: ENTERPRISE RFQ BUILDER */}
      {activeTab === 'rfq' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-8">
          {rfqSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">RFQ Registered Successfully!</h2>
              <div className="font-mono text-sm text-teal-400 font-bold">{rfqSuccess}</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Your RFQ has been logged and queued for Silphor Solutions Engineering qualification. It is now visible under your Enterprise Workspace.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setRfqSuccess(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  Create Another RFQ
                </button>
                <button
                  onClick={onNavigateWorkspace}
                  className="px-5 py-2 bg-teal-400 text-slate-950 text-xs font-bold rounded-lg hover:bg-teal-300"
                >
                  View in Enterprise Workspace →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRfqSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">
                    RFQ Title / Project Codename *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqTitle}
                    onChange={(e) => setRfqTitle(e.target.value)}
                    placeholder="e.g. 16nm Automotive Gateway Controller & Custom Silicon Tapeout"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Technology Domain / Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="ASIC & SoC Architecture">ASIC & SoC Architecture</option>
                    <option value="Verification & UVM Testbenches">Verification & UVM Testbenches</option>
                    <option value="FPGA Prototyping & Emulation">FPGA Prototyping & Emulation</option>
                    <option value="Physical Design & STA">Physical Design & STA</option>
                    <option value="Embedded Systems & Firmware">Embedded Systems & Firmware</option>
                    <option value="High-Speed Hardware & SI/PI">High-Speed Hardware & SI/PI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Project Urgency *</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="low">Standard Roadmap (6+ months)</option>
                    <option value="medium">Medium Priority (3-6 months)</option>
                    <option value="high">High Priority (1-3 months)</option>
                    <option value="critical">Critical / Tapeout Blocked (Immediate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Estimated Annual Silicon / Board Volume
                  </label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Delivery / First Silicon Date *</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Detailed Architectural Specification & Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline interfaces, clock speeds, target power budgets, foundry PDK preference (TSMC, GF, Intel), safety levels (ISO 26262 ASIL, DO-254), or BOM constraints."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Attachments Note */}
              <div className="p-4 bg-slate-950 border border-dashed border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Architecture & BOM Attachments</div>
                    <div className="text-[11px] text-slate-500">
                      Standard NDA applies. Default attachment: Requirements_Spec_Sheet.pdf (Auto-attached)
                    </div>
                  </div>
                </div>
                <span className="text-xs text-teal-400 font-mono">1 Default Attached</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Submitting as: <strong className="text-slate-300">{currentUser.name}</strong> ({currentUser.orgName})
                </span>
                <button
                  type="submit"
                  disabled={submittingRfq}
                  className="px-6 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {submittingRfq ? 'Registering RFQ...' : 'Submit Enterprise RFQ'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: PUBLIC TECHNICAL ENQUIRY FORM */}
      {activeTab === 'public_enquiry' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          {enquirySuccess ? (
            <div className="py-10 text-center space-y-4">
              <div className="inline-flex p-3 bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Enquiry Securely Received</h2>
              <div className="font-mono text-sm text-teal-400 font-bold">
                Tracking Ref: {enquirySuccess.referenceId}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {enquirySuccess.message}
              </p>

              {/* Telemetry info */}
              <div className="max-w-md mx-auto p-3 bg-slate-950 border border-slate-800 rounded-lg text-left text-[11px] font-mono text-slate-400 space-y-1">
                <div className="text-slate-500 font-bold">Server Audit Telemetry:</div>
                <div>Timestamp: {enquirySuccess.telemetry.timestamp}</div>
                <div>Anti-Abuse Verification: Passed (Honeypot clean, Rate-Limit OK)</div>
                <div>Client Masked IP: {enquirySuccess.telemetry.clientHash}</div>
              </div>

              <button
                onClick={() => setEnquirySuccess(null)}
                className="mt-4 px-5 py-2 bg-slate-800 text-white rounded-lg text-xs"
              >
                Send Another Technical Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
              {enquiryError && (
                <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{enquiryError}</span>
                </div>
              )}

              {/* Honeypot field (hidden from legitimate users, bots fill it in) */}
              <div className="hidden" aria-hidden="true">
                <label>Company Fax Code (Leave blank)</label>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Christian Meyer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Continental Automotive"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="christian.meyer@continental.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Enquiry Type *</label>
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Hardware Solutions">Hardware Solutions & Silicon IP</option>
                    <option value="Engineering Services">Engineering Services & Verification Pods</option>
                    <option value="Global Partnership">Global Ecosystem Partnership</option>
                    <option value="General Inquiry">General Technical Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Technical Requirement Details *</label>
                <textarea
                  rows={4}
                  required
                  value={requirementDetails}
                  onChange={(e) => setRequirementDetails(e.target.value)}
                  placeholder="Describe your design objectives, timeline, volumes, or engineering support requirements."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protected by server rate-limits and anti-abuse telemetry.</span>
                </span>
                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="px-6 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {submittingEnquiry ? 'Sending...' : 'Transmit Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
