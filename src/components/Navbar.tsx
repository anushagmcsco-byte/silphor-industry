import React, { useState } from 'react';
import { OrgUser } from '../types';
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Phone,
  Mail,
  Globe2,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  currentUser: OrgUser;
  onOpenSearch: () => void;
  onOpenRoleSwitcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onRouteChange,
  currentUser,
  onOpenSearch,
  onOpenRoleSwitcher,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'partners', label: 'Global Partners' },
    { id: 'products', label: 'Technologies & Products' },
    { id: 'industries', label: 'Industry Solutions' },
    { id: 'services', label: 'Engineering Services' },
    { id: 'resources-talent', label: 'Resource Requirements' },
    { id: 'rfq-enquiry', label: 'RFQ / Enquiry' },
    { id: 'resources', label: 'Resources' },
    { id: 'about', label: 'About' },
    { id: 'workspace', label: 'Enterprise Login', isEnterprise: true },
  ];

  const handleNavClick = (routeId: string) => {
    onRouteChange(routeId);
    setMobileMenuOpen(false);
  };

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'silphor_business_user':
        return 'Silphor Admin';
      case 'customer':
        return 'Customer';
      case 'principal_oem':
        return 'Principal/OEM';
      case 'distributor':
        return 'Distributor';
      case 'vendor':
        return 'Vendor';
      case 'engineering_provider':
        return 'Eng Provider';
      default:
        return 'Enterprise';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-slate-950/98 transition-colors">
      {/* 5.1 ABOVE TOP NAVBAR: Global Operations, Certification, Hotline & Status */}
      <div className="bg-slate-950 text-slate-400 text-[10px] sm:text-[11px] border-b border-slate-900 font-mono tracking-tight select-none w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-7 sm:h-8">
            {/* Left: Global Hubs & Standards */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 truncate">
              <div className="flex items-center space-x-1.5 text-slate-300 shrink-0">
                <Globe2 className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="font-semibold text-slate-200 hidden md:inline">Global Delivery:</span>
                <span className="text-slate-400 truncate text-[10px] sm:text-[11px]">
                  Santa Clara · Munich · Hsinchu · Bangalore
                </span>
              </div>
              <div className="hidden xl:flex items-center space-x-2 text-slate-500 shrink-0">
                <span>|</span>
                <span className="text-teal-300/90 font-medium">ISO 9001:2015</span>
                <span>·</span>
                <span className="text-teal-300/90 font-medium">IATF 16949</span>
                <span>·</span>
                <span className="text-teal-300/90 font-medium">ISO 26262 ASIL-D</span>
              </div>
            </div>

            {/* Right: Hotline, SLA, and Role Persona Badge */}
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 text-slate-300">
              <div className="hidden lg:flex items-center space-x-3">
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
                <span className="text-slate-700">|</span>
              </div>

              {/* Status pill */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 px-1.5 sm:px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[9.5px] sm:text-[10px] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-400 hidden xs:inline sm:inline">Tapeout SLA:</span>
                <span className="text-teal-300 font-bold">99.98%</span>
              </div>

              {/* Quick Persona Trigger on tablet/desktop */}
              <button
                onClick={onOpenRoleSwitcher}
                className="hidden md:flex items-center space-x-1 text-slate-400 hover:text-teal-300 transition-colors cursor-pointer text-[10px]"
                title="Switch demo persona"
              >
                <UserCheck className="w-3 h-3 text-teal-400" />
                <span className="font-semibold text-slate-300">{currentUser.name.split(' ')[0]}</span>
                <span className="text-slate-500">({getRoleBadgeLabel(currentUser.role)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="border-b border-slate-800/80 backdrop-blur-md w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
            {/* ZONE 1: Brand lockup with exact logo badge */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-1.5 sm:gap-2.5 text-left focus:outline-none group cursor-pointer shrink-0 min-w-0"
              aria-label="Silphor Technologies Home"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white p-0.5 sm:p-1 border border-slate-700 shadow-sm shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/silphor-logo-badge.svg"
                  alt="Silphor Technologies Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-base font-black tracking-wider leading-none text-white truncate">
                  SILPHOR
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 my-0.5">
                  <div className="h-[1.5px] w-1.5 sm:w-2.5 bg-[#008080]" />
                  <span className="text-[7.5px] sm:text-[9.5px] font-extrabold tracking-[0.16em] sm:tracking-[0.2em] text-[#008080] uppercase leading-none">
                    TECHNOLOGIES
                  </span>
                  <div className="h-[1.5px] w-1.5 sm:w-2.5 bg-[#008080]" />
                </div>
                <span className="hidden lg:block text-[7.5px] font-bold tracking-[0.14em] text-slate-400 uppercase leading-none whitespace-nowrap">
                  DESIGN • INNOVATE • VERIFY • DELIVER
                </span>
              </div>
            </button>

            {/* ZONE 2: Desktop text navigation links (Hidden on screens < 2xl) */}
            <nav className="hidden 2xl:flex items-center space-x-3.5 text-xs font-semibold tracking-wide">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.id;
                if (link.isEnterprise) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`transition-all whitespace-nowrap cursor-pointer px-2.5 py-1 rounded-md border text-xs font-bold flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                          : 'bg-slate-900/90 text-teal-300 border-teal-500/40 hover:border-teal-400 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  );
                }
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                      isActive
                        ? 'text-teal-400 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Fallback for XL desktops */}
            <nav className="hidden xl:flex 2xl:hidden items-center space-x-3 text-xs font-semibold tracking-wide">
              {navLinks.filter((l) => !l.isEnterprise).slice(0, 6).map((link) => {
                const isActive = currentRoute === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                      isActive ? 'text-teal-400 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
              >
                More ▾
              </button>
            </nav>

            {/* ZONE 3: Actions (Strictly responsive with zero mobile overflow) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Search shortcut button */}
              <button
                onClick={onOpenSearch}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                title="Search catalog (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden lg:inline text-[10px] text-slate-500 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                  ⌘K
                </kbd>
              </button>

              {/* Enterprise Workspace Button */}
              <button
                onClick={() => handleNavClick('workspace')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  currentRoute === 'workspace'
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-teal-500/60 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                {/* On mobile: compact "Portal" or "Work" */}
                <span className="sm:hidden font-bold">Portal</span>
                {/* On tablet/desktop: full text */}
                <span className="hidden sm:inline">
                  {currentRoute === 'workspace' ? 'Workspace' : 'Enterprise'}
                </span>
                {/* Role badge hidden on small mobile, visible on sm and above */}
                <span className="hidden sm:inline text-[9.5px] px-1.5 py-0.2 bg-slate-800/90 text-teal-300 rounded font-mono shrink-0">
                  {getRoleBadgeLabel(currentUser.role)}
                </span>
              </button>

              {/* Fast role switcher button on tablet & desktop */}
              <button
                onClick={onOpenRoleSwitcher}
                className="hidden sm:flex p-1.5 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 cursor-pointer shrink-0"
                title="Switch demo enterprise role persona"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
              </button>

              {/* Mobile Menu Hamburger Button - ALWAYS visible and accessible on mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 sm:p-2 text-slate-200 hover:text-white rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-0.5"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-teal-400" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER: Complete responsive navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/98 px-3 sm:px-6 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto animate-fade-in shadow-2xl">
          {/* Active Persona Banner with Switch Role CTA */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Workspace User:</span>
              <strong className="text-slate-100 text-xs truncate block">{currentUser.name}</strong>
              <div className="text-[10px] text-teal-400 font-mono truncate">{currentUser.orgName} · {getRoleBadgeLabel(currentUser.role)}</div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoleSwitcher();
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer shrink-0 flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Switch Role</span>
            </button>
          </div>

          {/* All 10 Navigation Links */}
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  currentRoute === link.id
                    ? 'bg-teal-950/60 text-teal-300 border-l-4 border-teal-400 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {currentRoute === link.id && (
                  <span className="text-[10px] font-mono text-teal-400 font-bold">● Active</span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => handleNavClick('workspace')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
            >
              <span>Access Enterprise Workspace</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:text-white cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span>Search Semiconductor Catalog</span>
            </button>

            {/* Quick Contact Hotline */}
            <div className="pt-2 flex items-center justify-around text-[10px] text-slate-400 border-t border-slate-900">
              <a href="tel:+14085557457" className="hover:text-teal-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-teal-400" />
                <span>+1 (408) 555-SILP</span>
              </a>
              <span>·</span>
              <a href="mailto:rfq@silphor.com" className="hover:text-teal-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-teal-400" />
                <span>rfq@silphor.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
