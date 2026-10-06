import React from 'react';
import { EngineeringService } from '../types';
import { Wrench, CheckCircle, Clock, Cpu, ShieldAlert, ArrowRight } from 'lucide-react';

interface EngineeringServicesViewProps {
  services: EngineeringService[];
  onNavigateRfq: () => void;
  onNavigateTalent: () => void;
}

export const EngineeringServicesView: React.FC<EngineeringServicesViewProps> = ({
  services,
  onNavigateRfq,
  onNavigateTalent,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>Turnkey Engineering Pods & Services</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Engineering Services</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            From architectural specification to tapeout sign-off. We provide dedicated verification pods, physical design specialists, and embedded firmware engineers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateTalent}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Resource Requirements Desk
          </button>
          <button
            onClick={onNavigateRfq}
            className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Scope Turnkey Project
          </button>
        </div>
      </div>

      {/* Featured Microelectronics Engineering Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-8 p-6 sm:p-8 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded border border-teal-500/30">
              Silicon Turnkey Guarantee
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Deep-Submicron VLSI Pods: 3nm, 5nm & FinFET Sign-off
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Equipped with Synopsys, Cadence, and Siemens EDA toolflows. Our dedicated engineering pods work on-site or off-site with full IP confidentiality under strict cleanroom NDAs.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">UVM 1.2 Sign-off</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">STA & PrimeTime Closure</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">DRC/LVS Clean</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Zero-Defect Silicon</span>
            </div>
          </div>
          <div className="md:col-span-4 h-48 sm:h-56 md:h-full relative overflow-hidden">
            <img
              src="/images/engineering_services_vlsi_1791295461850.jpg"
              alt="VLSI Silicon Microchip Engineering"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent md:block hidden" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, index) => (
          <div
            key={s.id}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-teal-400 font-bold">{`0${index + 1}. ${s.domain}`}</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {s.leadTimeWeeks}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{s.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.description}</p>

              {/* Deliverables */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Core Deliverables
                </div>
                {s.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <span className="leading-snug">{d}</span>
                  </div>
                ))}
              </div>

              {/* Tools & EDA Stacks */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-500 mb-1">
                  Supported Tool Suites:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.toolsAndStandards.map((tool, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Sign-off Guarantee</span>
              <button
                onClick={onNavigateRfq}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Request Scoping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
