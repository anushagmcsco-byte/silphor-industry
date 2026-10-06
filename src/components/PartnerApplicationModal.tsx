import React, { useState } from 'react';
import { api } from '../services/api';
import { Partner } from '../types';
import { X, CheckCircle, Building, Globe, Mail, ShieldAlert } from 'lucide-react';

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerCreated: (partner: Partner) => void;
}

export const PartnerApplicationModal: React.FC<PartnerApplicationModalProps> = ({
  isOpen,
  onClose,
  onPartnerCreated,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'principal_oem' | 'distributor' | 'vendor' | 'engineering_provider' | 'foundry'>('vendor');
  const [country, setCountry] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [capabilitiesStr, setCapabilitiesStr] = useState('');
  const [certificationsStr, setCertificationsStr] = useState('ISO 9001, IATF 16949');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const capabilities = capabilitiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const certifications = certificationsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await api.createPartner({
        name,
        type,
        tier: 'Certified',
        country,
        headquarters,
        website,
        contactEmail,
        description,
        capabilities,
        certifications,
      });

      onPartnerCreated(created);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit partner application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 sm:p-6 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-teal-400" />
              <span>Join Global Partner Ecosystem</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Onboard your foundry, EDA design house, component supply chain, or engineering practice.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-md cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-4">
            <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Partner Application Submitted</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your profile has been queued for Silphor KYB verification and technical qualification. You will receive an operational review token at <strong className="text-slate-200">{contactEmail}</strong>.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2 bg-teal-500 text-slate-950 font-semibold rounded-lg text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto pr-1 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nippon Semiconductor Packaging"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Partner Ecosystem Track *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="principal_oem">Principal / Silicon OEM</option>
                  <option value="foundry">Silicon Foundry / Wafer Fab</option>
                  <option value="vendor">Manufacturing Vendor / Packaging</option>
                  <option value="engineering_provider">Engineering Provider (VLSI / Design House)</option>
                  <option value="distributor">Distributor / Channel Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Primary Business Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alliance@partner.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Headquarters City & Country *</label>
                <input
                  type="text"
                  required
                  value={headquarters}
                  onChange={(e) => {
                    setHeadquarters(e.target.value);
                    if (!country) setCountry(e.target.value);
                  }}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Technical Profile & Domain Capabilities *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your silicon process nodes, packaging types, engineering team capacity, or distribution logistics."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Key Capabilities (comma-separated)</label>
                <input
                  type="text"
                  value={capabilitiesStr}
                  onChange={(e) => setCapabilitiesStr(e.target.value)}
                  placeholder="e.g. 5nm FinFET, Wafer Probing, BGA Packaging"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Industry Certifications (comma-separated)</label>
                <input
                  type="text"
                  value={certificationsStr}
                  onChange={(e) => setCertificationsStr(e.target.value)}
                  placeholder="e.g. ISO 9001, IATF 16949, AS9100, ITAR"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Silphor verifies KYB and export compliance prior to directory publication.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Partner Application'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
