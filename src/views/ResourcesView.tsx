import React from 'react';
import { FileText, Download, ShieldCheck, Terminal, BookOpen, Layers } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const whitepapers = [
    {
      title: 'Achieving First-Pass Silicon Tapeout on 16nm and 7nm Nodes',
      category: 'ASIC Architecture & Design',
      size: '3.8 MB',
      date: 'Q3 2026',
      desc: 'A comprehensive methodology paper on constrained-random UVM sign-off, MCMM timing closure, and multi-corner electromigration prevention.',
    },
    {
      title: 'Functional Safety in Modern Automotive SoCs (ISO 26262 ASIL-D)',
      category: 'Automotive & Functional Safety',
      size: '5.1 MB',
      date: 'Q2 2026',
      desc: 'Architectural implementation of dual-core lockstep CPU verification, hardware safety mechanisms, and diagnostic test coverage metrics.',
    },
    {
      title: 'Radiation Hardening Techniques for Commercial LEO Satellites',
      category: 'Aerospace & Mil-Aero',
      size: '4.4 MB',
      date: 'Q1 2026',
      desc: 'Design considerations for Triple Modular Redundancy (TMR) flip-flops, single-event latchup (SEL) protection, and TID tolerance exceeding 100 krad.',
    },
    {
      title: '112Gbps PAM4 SerDes Signal Integrity & Channel Budget Analysis',
      category: 'High-Speed Hardware & SI/PI',
      size: '6.2 MB',
      date: 'Q3 2026',
      desc: 'Eye-diagram mask simulations, 3D electromagnetic via transition modeling, and adaptive CTLE/FFE equalization performance under 35dB insertion loss.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base & Technical Publications</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Technical Resources</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Peer-reviewed engineering whitepapers, reference architecture guides, and compliance manuals authored by Silphor Senior Technical Fellows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {whitepapers.map((wp, i) => (
          <div
            key={i}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-teal-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono">
                <span>{wp.category}</span>
                <span className="text-slate-500">{wp.date}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-2 leading-snug">{wp.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{wp.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">PDF · {wp.size}</span>
              <button
                onClick={() => alert(`Simulated download for whitepaper: ${wp.title}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-md font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Whitepaper</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
