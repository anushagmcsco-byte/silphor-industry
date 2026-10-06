import React from 'react';
import { SilphorLogo } from '../components/SilphorLogo';
import { ShieldCheck, MapPin, Award, CheckCircle2, Globe2, Cpu } from 'lucide-react';

export const AboutView: React.FC = () => {
  const offices = [
    { city: 'Santa Clara, CA', country: 'United States', focus: 'Silicon Architecture & North American Operations' },
    { city: 'Munich', country: 'Germany', focus: 'Automotive ISO 26262 & Functional Safety Excellence Lab' },
    { city: 'Hsinchu Science Park', country: 'Taiwan', focus: 'Foundry Integration & Advanced Packaging Hub' },
    { city: 'Bangalore', country: 'India', focus: 'Deep-Submicron VLSI Design & Verification Center' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-28 h-28 rounded-2xl bg-white p-2 border border-slate-700 shadow-xl shrink-0 flex items-center justify-center">
            <img
              src="/silphor-logo-badge.svg"
              alt="Silphor Technologies Official Brand Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
              SILPHOR TECHNOLOGIES
            </h1>
            <div className="text-xs font-bold text-teal-400 tracking-[0.2em] uppercase">
              DESIGN • INNOVATE • VERIFY • DELIVER
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mt-2">
              Silphor Technologies is a global engineering and semiconductor solutions enterprise. We partner with Tier-1 OEMs, automotive leaders, and aerospace contractors to architect, verify, and deliver custom silicon with first-pass tapeout precision.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-2xl font-extrabold text-teal-400 font-mono">15+</div>
            <div className="text-[11px] text-slate-400">Years of Silicon Heritage</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-2xl font-extrabold text-white font-mono">85+</div>
            <div className="text-[11px] text-slate-400">Tapeouts Delivered</div>
          </div>
        </div>
      </div>

      {/* Engineering Philosophy: Design · Innovate · Verify · Deliver */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">Our Engineering Creed</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-mono text-teal-400 font-bold">01. DESIGN</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We engineer microarchitectures with rigorous PPA (power, performance, area) optimization, modular synthesizable RTL, and comprehensive register maps.
            </p>
          </div>
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-mono text-sky-400 font-bold">02. INNOVATE</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pioneering sub-3W Edge AI acceleration, rad-hard CubeSat telemetry, and multi-gigabit PAM4 SerDes interconnects for next-gen computing.
            </p>
          </div>
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-mono text-purple-400 font-bold">03. VERIFY</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zero-compromise functional verification using UVM constrained-random testbenches, formal assertions (SVA), and multi-FPGA emulation boxes.
            </p>
          </div>
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">04. DELIVER</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Turnkey delivery from foundry GDSII sign-off and packaging through post-silicon laboratory bring-up and high-volume quality control.
            </p>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Global Engineering Labs & Facilities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1"
            >
              <div className="text-sm font-bold text-white">{office.city}</div>
              <div className="text-xs text-teal-400 font-medium">{office.country}</div>
              <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">{office.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications and Compliance */}
      <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-white">Enterprise Standards & Security</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Silphor operations and laboratories comply with ISO 9001:2015, IATF 16949 automotive quality standards, ITAR export regulations, and ISO 27001 data isolation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-teal-300">
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">ISO 9001:2015</span>
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">IATF 16949</span>
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">ITAR Compliant</span>
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">ISO 26262 ASIL-D</span>
        </div>
      </section>
    </div>
  );
};
