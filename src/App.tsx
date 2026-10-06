import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PartnerApplicationModal } from './components/PartnerApplicationModal';

import { HomeView } from './views/HomeView';
import { PartnersView } from './views/PartnersView';
import { ProductsView } from './views/ProductsView';
import { IndustriesView } from './views/IndustriesView';
import { EngineeringServicesView } from './views/EngineeringServicesView';
import { ResourceRequirementsView } from './views/ResourceRequirementsView';
import { RFQEnquiryView } from './views/RFQEnquiryView';
import { ResourcesView } from './views/ResourcesView';
import { AboutView } from './views/AboutView';
import { WorkspaceView } from './views/WorkspaceView';

import { api } from './services/api';
import {
  Product,
  Partner,
  TechnologyCategory,
  IndustrySolution,
  EngineeringService,
  CaseStudy,
  OrgUser,
  ResourceRequirement,
} from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<OrgUser | null>(null);
  const [availableUsers, setAvailableUsers] = useState<OrgUser[]>([]);

  // Master Content State
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [industries, setIndustries] = useState<IndustrySolution[]>([]);
  const [services, setServices] = useState<EngineeringService[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [resources, setResources] = useState<ResourceRequirement[]>([]);

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [partnerApplicationModalOpen, setPartnerApplicationModalOpen] = useState(false);
  const [prefilledRfqProduct, setPrefilledRfqProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadInitialData();

    // Keyboard shortcut for Cmd/Ctrl+K search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadInitialData = async () => {
    try {
      const [
        authData,
        catData,
        prodData,
        partData,
        indData,
        servData,
        csData,
        resData,
      ] = await Promise.all([
        api.getCurrentUser(),
        api.getCategories(),
        api.getProducts(),
        api.getPartners(),
        api.getIndustries(),
        api.getServices(),
        api.getCaseStudies(),
        api.getResources(),
      ]);

      setCurrentUser(authData.user);
      setAvailableUsers(authData.allAvailableTestUsers);
      setCategories(catData);
      setProducts(prodData);
      setPartners(partData);
      setIndustries(indData);
      setServices(servData);
      setCaseStudies(csData);
      setResources(resData);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const handleSelectUserPersona = async (targetUser: OrgUser) => {
    try {
      const res = await api.switchRole(targetUser.role, targetUser.id);
      setCurrentUser(res.user);
    } catch (e) {
      console.error(e);
      alert('Failed to switch role persona.');
    }
  };

  const handleNavigateWithProduct = (product: Product) => {
    setPrefilledRfqProduct(product);
    setCurrentRoute('rfq-enquiry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (route: string, itemId?: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (itemId && route === 'products') {
      const p = products.find((prod) => prod.id === itemId);
      if (p) setSelectedProductForModal(p);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-slate-400 font-mono">
        Connecting to Silphor Technologies platform...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Universal Top Navigation */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={handleNavigate}
        currentUser={currentUser}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomeView
            categories={categories}
            featuredProducts={products}
            partners={partners}
            caseStudies={caseStudies}
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchOpen(true)}
            onSelectProduct={(p) => setSelectedProductForModal(p)}
          />
        )}

        {currentRoute === 'partners' && (
          <PartnersView
            partners={partners}
            onOpenApplicationModal={() => setPartnerApplicationModalOpen(true)}
            onNavigateRfq={() => handleNavigate('rfq-enquiry')}
          />
        )}

        {currentRoute === 'products' && (
          <ProductsView
            products={products}
            categories={categories}
            onSelectProduct={(p) => setSelectedProductForModal(p)}
            onNavigateRfqWithProduct={handleNavigateWithProduct}
          />
        )}

        {currentRoute === 'industries' && (
          <IndustriesView
            industries={industries}
            onNavigateRfq={() => handleNavigate('rfq-enquiry')}
          />
        )}

        {currentRoute === 'services' && (
          <EngineeringServicesView
            services={services}
            onNavigateRfq={() => handleNavigate('rfq-enquiry')}
            onNavigateTalent={() => handleNavigate('resources-talent')}
          />
        )}

        {currentRoute === 'resources-talent' && (
          <ResourceRequirementsView
            resources={resources}
            currentUser={currentUser}
            onRefresh={loadInitialData}
            onNavigateWorkspace={() => handleNavigate('workspace')}
          />
        )}

        {currentRoute === 'rfq-enquiry' && (
          <RFQEnquiryView
            currentUser={currentUser}
            prefilledProduct={prefilledRfqProduct}
            onRfqCreated={loadInitialData}
            onNavigateWorkspace={() => handleNavigate('workspace')}
          />
        )}

        {currentRoute === 'resources' && <ResourcesView />}

        {currentRoute === 'about' && <AboutView />}

        {currentRoute === 'workspace' && (
          <WorkspaceView
            currentUser={currentUser}
            onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
            onNavigateRfqBuilder={() => handleNavigate('rfq-enquiry')}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
      />

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <RoleSwitcherModal
        isOpen={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
        currentUser={currentUser}
        availableUsers={availableUsers}
        onSelectUser={handleSelectUserPersona}
      />

      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onRequestRfq={handleNavigateWithProduct}
      />

      <PartnerApplicationModal
        isOpen={partnerApplicationModalOpen}
        onClose={() => setPartnerApplicationModalOpen(false)}
        onPartnerCreated={(p) => {
          setPartners((prev) => [p, ...prev]);
        }}
      />
    </div>
  );
}
