import React from 'react';
import { Product, Partner, CaseStudy, TechnologyCategory } from '../types';
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  Search,
  CheckCircle2,
  Layers,
  Award,
  Terminal,
  FileText,
  Activity,
} from 'lucide-react';

interface HomeViewProps {
  categories: TechnologyCategory[];
  featuredProducts: Product[];
  partners: Partner[];
  caseStudies: CaseStudy[];
  onNavigate: (route: string, itemId?: string) => void;
  onOpenSearch: () => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  featuredProducts,
  partners,
  caseStudies,
  onNavigate,
  onOpenSearch,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-700 shadow-md shrink-0 flex items-center justify-center">
                  <img
                    src="/silphor-logo-badge.svg"
                    alt="Silphor Technologies Official Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>Silphor Technologies · Official Semiconductor Solutions</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Complete Silicon Lifecycle: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-emerald-300">
                  Design · Innovate · Verify · Deliver
                </span>
              </h1>

              <p className="text-base text-slate-300 max-w-xl leading-relaxed">
                Silphor Technologies connects global silicon foundries, IP providers, and engineering design teams. We engineer custom ASICs, high-speed SerDes, safety-critical automotive systems, and aerospace avionics with first-pass silicon certainty.
              </p>

              {/* Fast interactive CTA Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('rfq-enquiry')}
                  className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-all shadow-lg shadow-teal-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit Enterprise RFQ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('products')}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Explore Technologies & IP
                </button>

                <button
                  onClick={onOpenSearch}
                  className="px-4 py-3 text-xs sm:text-sm text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-teal-400" />
                  <span className="hidden sm:inline">Quick Search</span>
                </button>
              </div>

              {/* Quantitative Proof Anchors */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 sm:gap-4 text-left">
                <div>
                  <div className="text-lg sm:text-2xl font-extrabold text-white font-mono tabular-nums">
                    99.8%
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">Coverage Sign-off SLA</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-extrabold text-white font-mono tabular-nums">
                    3nm – 28nm
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">Foundry Capability</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-extrabold text-teal-400 font-mono tabular-nums">
                    100%
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">First-Pass Rate</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
                <img
                  src="/images/hero_silphor_semiconductor_1791295424734.jpg"
                  alt="Silphor Technologies Semiconductor Cleanroom Fabrication and VLSI Engineering"
                  className="w-full h-64 sm:h-80 lg:h-[380px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Silicon Engineering Operations</span>
                    <span className="text-[10px] font-mono text-teal-400">ISO 9001 · IATF 16949</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct integration with TSMC, GlobalFoundries, Cadence, and Synopsys ecosystems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PILLARS: DESIGN · INNOVATE · VERIFY · DELIVER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest">
            The Silphor Execution Model
          </h2>
          <p className="text-2xl font-bold text-white mt-1">
            Engineered for High-Reliability Semiconductor Deployment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">01. Design</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                RTL microarchitecture, RISC-V SoC synthesis, custom analog front-ends, and ultra-high-speed SerDes implementation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              SystemVerilog · VHDL · Chisel
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">02. Innovate</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Edge AI NPU acceleration, radiation-hardened CubeSat payloads, and low-latency automotive TSN Ethernet gateways.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              Edge AI · Space-Grade · Sub-3W
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">03. Verify</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Exhaustive UVM constrained-random testbenches, formal assertion proofs, and hardware emulation on multi-million gate FPGAs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              UVM 1.2 · SVA · Palladium · ZeBu
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">04. Deliver</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Turnkey GDSII sign-off, foundry tapeout logistics, post-silicon characterization, and high-volume box build.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              GDSII · Sign-off · AEC-Q100
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SILICON TECHNOLOGIES & PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest">
              Commercial Products & Hardware
            </h2>
            <p className="text-2xl font-bold text-white mt-1">
              Silicon IP Cores, Development Modules & Kits
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Complete Product Catalog ({featuredProducts.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProducts.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 hover:border-teal-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono text-teal-400 font-bold">{p.sku}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {p.lifecyclePhase}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {p.tagline}
                </p>

                {/* Specs snapshot */}
                <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-800/80 text-[11px]">
                  {Object.entries(p.specs).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-slate-400">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-mono text-slate-300 truncate max-w-[160px]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectProduct(p)}
                  className="text-xs text-slate-300 hover:text-white font-medium cursor-pointer"
                >
                  View Datasheet
                </button>
                <button
                  onClick={() => onNavigate('rfq-enquiry')}
                  className="px-3 py-1.5 text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500 hover:text-slate-950 rounded-md transition-all cursor-pointer"
                >
                  Request RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GLOBAL PARTNER NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-widest">
                <Globe2 className="w-4 h-4" />
                <span>Global Certified Ecosystem</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Tier-1 Silicon Alliances & Foundry Access
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Silphor coordinates seamless engagement between semiconductor fabricators (TSMC, GlobalFoundries), EDA automation giants (Cadence, Synopsys), and precision contract manufacturers.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {partners.slice(0, 6).map((partner) => (
                  <span
                    key={partner.id}
                    className="px-3 py-1 text-xs rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 font-medium"
                  >
                    {partner.name}
                  </span>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('partners')}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-md transition-colors cursor-pointer"
                >
                  Explore Partner Directory & KYB Status
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                <img
                  src="/images/partner_network_global_1791295445686.jpg"
                  alt="Global Semiconductor Partner Network"
                  className="w-full h-56 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CASE STUDIES & METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest">
            Proven Silicon Milestones
          </h2>
          <p className="text-2xl font-bold text-white mt-1">
            Quantified Business & Technical Impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-teal-400">{cs.clientIndustry}</span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">{cs.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cs.challenge}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Outcome:</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                  {cs.quantifiedImpact}
                </p>
                <div className="text-[11px] text-slate-500 mt-2 font-mono">
                  Execution Duration: {cs.durationMonths} Months
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to tape out your next silicon architecture?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Submit your RFQ requirement specification or reach out to Silphor technical solution architects for an initial feasibility review.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('rfq-enquiry')}
              className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
            >
              Start RFQ Submission
            </button>
            <button
              onClick={() => onNavigate('resources-talent')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Request Engineering Talent Requisition
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
