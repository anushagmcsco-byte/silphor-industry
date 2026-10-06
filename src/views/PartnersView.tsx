import React, { useState } from 'react';
import { Partner } from '../types';
import {
  Globe2,
  Building,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Plus,
  Filter,
  Search,
} from 'lucide-react';

interface PartnersViewProps {
  partners: Partner[];
  onOpenApplicationModal: () => void;
  onNavigateRfq: () => void;
}

export const PartnersView: React.FC<PartnersViewProps> = ({
  partners,
  onOpenApplicationModal,
  onNavigateRfq,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = partners.filter((p) => {
    if (selectedType !== 'all' && p.type !== selectedType) return false;
    if (selectedTier !== 'all' && p.tier !== selectedTier) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.capabilities.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const typeTabs = [
    { id: 'all', label: 'All Partners' },
    { id: 'foundry', label: 'Foundries & Wafer Fabs' },
    { id: 'principal_oem', label: 'Principals & IP OEMs' },
    { id: 'vendor', label: 'Manufacturing & SMT' },
    { id: 'engineering_provider', label: 'Engineering Providers' },
    { id: 'distributor', label: 'Distributors' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global Ecosystem & Supply Chain</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Global Partner Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verified semiconductor foundries, electronic design automation (EDA) software leaders, IP vendors, and specialized VLSI engineering houses.
          </p>
        </div>

        <button
          onClick={onOpenApplicationModal}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply as Global Partner</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          {typeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedType === tab.id
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input & Tier filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, process nodes, certifications, or capabilities..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="Strategic">Strategic Alliance</option>
              <option value="Premier">Premier Partner</option>
              <option value="Certified">Certified Partner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-teal-400 uppercase">
                    {partner.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{partner.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    partner.tier === 'Strategic'
                      ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                      : partner.tier === 'Premier'
                      ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {partner.tier}
                </span>
              </div>

              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span>{partner.headquarters}</span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified KYB
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {partner.description}
              </p>

              {/* Capabilities */}
              <div className="mt-4 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Core Capabilities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {partner.capabilities.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300 font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-3 text-[11px] text-slate-400">
                <span className="text-slate-500">Standards: </span>
                <span className="font-medium text-slate-300">
                  {partner.certifications.join(' · ')}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-teal-400 flex items-center gap-1"
              >
                <span>Portal Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={onNavigateRfq}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium cursor-pointer"
              >
                Direct RFQ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
