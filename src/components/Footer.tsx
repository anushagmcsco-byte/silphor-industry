import React from 'react';
import {
  ShieldCheck,
  Globe2,
  Cpu,
  ArrowUpRight,
  Phone,
  Mail,
  Search,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenSearch?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenRoleSwitcher,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs select-none">
      {/* 1. ABOVE FOOTER BAR (Identical in style, data & function to the Above Top Navbar) */}
      <div className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-900 font-mono tracking-tight">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-2 md:h-9 gap-2">
            {/* Left: Global Hubs & Standards */}
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Globe2 className="w-3 h-3 text-teal-400" />
                <span className="font-semibold text-slate-200">Global Delivery:</span>
                <span className="text-slate-400">Santa Clara · Munich · Hsinchu · Bangalore</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 text-slate-500">
                <span>|</span>
                <span className="text-teal-300/90 font-medium">ISO 9001:2015</span>
                <span>·</span>
                <span className="text-teal-300/90 font-medium">IATF 16949</span>
                <span>·</span>
                <span className="text-teal-300/90 font-medium">ISO 26262 ASIL-D</span>
              </div>
            </div>

            {/* Right: Hotline, Tapeout SLA, and Direct Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4 text-slate-300">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <a
                  href="tel:+14085557457"
                  className="flex items-center space-x-1 hover:text-teal-300 transition-colors"
                >
                  <Phone className="w-2.5 h-2.5 text-teal-400" />
                  <span>+1 (408) 555-SILP</span>
                </a>
                <span className="text-slate-700">|</span>
                <a
                  href="mailto:rfq@silphor.com"
                  className="flex items-center space-x-1 hover:text-teal-300 transition-colors"
                >
                  <Mail className="w-2.5 h-2.5 text-teal-400" />
                  <span>rfq@silphor.com</span>
                </a>
              </div>

              {/* Status indicator */}
              <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">First-Pass SLA:</span>
                <span className="text-teal-300 font-bold">99.98%</span>
              </div>

              {onOpenRoleSwitcher && (
                <button
                  onClick={onOpenRoleSwitcher}
                  className="hidden xl:flex items-center space-x-1 text-slate-400 hover:text-teal-300 transition-colors cursor-pointer text-[10px]"
                >
                  <UserCheck className="w-3 h-3 text-teal-400" />
                  <span>Switch Persona</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER (Matching Navbar Brand Lockup, Exact Logo & Complete Navigation Suite) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-900">
          {/* Brand lockup identical to Navbar */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer text-left group"
              aria-label="Silphor Technologies Home"
            >
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-700 shadow-md shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/silphor-logo-badge.svg"
                  alt="Silphor Technologies Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider leading-none text-white">
                  SILPHOR
                </span>
                <div className="flex items-center gap-1.5 my-1">
                  <div className="h-[2px] w-3 bg-[#008080]" />
                  <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#008080] uppercase leading-none">
                    TECHNOLOGIES
                  </span>
                  <div className="h-[2px] w-3 bg-[#008080]" />
                </div>
                <span className="text-[8px] font-bold tracking-[0.14em] text-slate-400 uppercase leading-none whitespace-nowrap">
                  DESIGN • INNOVATE • VERIFY • DELIVER
                </span>
              </div>
            </button>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Leading global semiconductor and microelectronics solutions provider. Specializing in advanced ASIC architecture, UVM verification, physical design tapeout, and specialized engineering talent mobilization.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                TSMC OIP & Open Innovation Partner
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-teal-300">
                ASIL-D Automotive Ready
              </span>
            </div>
          </div>

          {/* Nav Column 1: Core Technologies & Solutions */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Technologies & Design</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Technologies & Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('industries')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Industry Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Engineering Services
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Ecosystem & Engagement */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Ecosystem & RFQ</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('partners')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Global Partners Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rfq-enquiry')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  RFQ / Enquiry Fast-Track
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources-talent')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Resource Requirements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Resources & Whitepapers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  About Silphor Technologies
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Enterprise Portal & Login */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Enterprise Hub</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('workspace')}
                  className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Enterprise Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('workspace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Workspace Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rfq-enquiry')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Submit Technical Proposal
                </button>
              </li>
              {onOpenSearch && (
                <li>
                  <button
                    onClick={onOpenSearch}
                    className="hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1 text-slate-400"
                  >
                    <Search className="w-3 h-3 text-teal-400" />
                    <span>Search Semiconductor Catalog</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* 3. Bottom Strip: Copyright, Global Centers & Compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Silphor Technologies. All rights reserved. Registered under ISO 9001:2015 & IATF 16949.
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-slate-400 transition-colors">Santa Clara, CA</span>
            <span>·</span>
            <span className="hover:text-slate-400 transition-colors">Munich</span>
            <span>·</span>
            <span className="hover:text-slate-400 transition-colors">Hsinchu Science Park</span>
            <span>·</span>
            <span className="hover:text-slate-400 transition-colors">Bangalore Electronic City</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
