import React, { useState } from 'react';
import { IndustrySolution } from '../types';
import { ShieldCheck, ArrowRight, CheckCircle2, Award } from 'lucide-react';

interface IndustriesViewProps {
  industries: IndustrySolution[];
  onNavigateRfq: () => void;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({ industries, onNavigateRfq }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustrySolution>(industries[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold text-white">Industry Solutions</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Application-specific semiconductor engineering tailored to stringent functional safety, radiation tolerance, extreme temperature, and deterministic latency standards.
        </p>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Industry selector list (horizontal on mobile, vertical sidebar on desktop) */}
        <div className="lg:col-span-4 flex lg:flex-col gap-2.5 overflow-x-auto whitespace-nowrap lg:whitespace-normal scrollbar-none pb-2 lg:pb-0">
          {industries.map((ind) => {
            const isSelected = selectedIndustry.id === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`shrink-0 w-64 sm:w-72 lg:w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-teal-500 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="text-sm font-bold text-white">{ind.name}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2 whitespace-normal">{ind.summary}</div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-400 font-medium">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed architectural breakdown */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">
              Target Vertical
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              {selectedIndustry.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {selectedIndustry.description}
            </p>
          </div>

          {/* Key Use Cases */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Mission-Critical Deployments & Use Cases
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedIndustry.keyUseCases.map((uc, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-slate-200">{uc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Certified Compliance Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedIndustry.complianceStandards.map((std, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs font-mono font-medium flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{std}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Featured Tech */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Featured Silicon Modules
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedIndustry.featuredTech.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Need custom certification mapping for {selectedIndustry.name}?
            </span>
            <button
              onClick={onNavigateRfq}
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Request Solution Architecture RFQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
