import React from 'react';
import { OrgUser, UserRole } from '../types';
import { X, Check, Shield, Building2, Cpu, Wrench, Package, Briefcase } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: OrgUser;
  availableUsers: OrgUser[];
  onSelectUser: (user: OrgUser) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  availableUsers,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const roleMeta: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
    customer: {
      label: 'Customer (OEM / Tier-1)',
      icon: Building2,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      desc: 'Create RFQs, view partner quote comparisons, submit talent requirements, track milestone deliverables.',
    },
    principal_oem: {
      label: 'Principal / Silicon OEM',
      icon: Cpu,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      desc: 'Submit chip IP, publish verified specifications, evaluate joint roadmap opportunities.',
    },
    distributor: {
      label: 'Distributor / Logistics Hub',
      icon: Package,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      desc: 'Manage regional silicon territory distribution, buffer stock agreements, delivery schedules.',
    },
    vendor: {
      label: 'Manufacturing Vendor / Foundry',
      icon: Wrench,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      desc: 'Quote on RFQ BOMs, provide PCB SMT / box build lead times, upload engineering versioned bids.',
    },
    engineering_provider: {
      label: 'Engineering Provider / Design House',
      icon: Briefcase,
      color: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
      desc: 'Submit engineer profiles for requisitions (UVM, 5nm P&R), manage assigned turnkey projects.',
    },
    silphor_business_user: {
      label: 'Silphor Business User / Admin Ops',
      icon: Shield,
      color: 'text-red-400 border-red-500/30 bg-red-500/10',
      desc: 'Triage & qualify RFQs, route to partners, manage CRM pipeline, review partner approvals & feature flags.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 sm:p-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              <span>Enterprise Role Persona Simulation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any persona to experience role-scoped APIs and customized workspace dashboards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Persona List */}
        <div className="mt-3 sm:mt-4 space-y-2.5 overflow-y-auto pr-1 flex-1">
          {availableUsers.map((u) => {
            const isSelected = currentUser.id === u.id;
            const meta = roleMeta[u.role] || {
              label: u.role,
              icon: Building2,
              color: 'text-slate-400 border-slate-700 bg-slate-800',
              desc: '',
            };
            const Icon = meta.icon;

            return (
              <button
                key={u.id}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className={`w-full text-left p-3 sm:p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 sm:gap-3.5 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-950/30 shadow-sm'
                    : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className={`p-2 rounded-md border shrink-0 ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-white truncate">{u.name}</span>
                    <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 w-fit shrink-0">
                      {meta.label}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    {u.title} · <span className="text-teal-400">{u.orgName}</span>
                  </div>

                  <p className="text-[11px] sm:text-[11.5px] text-slate-400 mt-1 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="shrink-0 p-1 bg-teal-500 text-slate-950 rounded-full mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400 shrink-0">
          <span>Active Context: <strong className="text-teal-300">{currentUser.name}</strong></span>
          <span className="font-mono text-[10px] sm:text-[11px] text-slate-500">API Tokens Scoped by RBAC</span>
        </div>
      </div>
    </div>
  );
};
