import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Partner, EngineeringService, IndustrySolution } from '../types';
import { Search, X, Cpu, Users, Wrench, Globe, ExternalLink, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, itemId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'partners' | 'services'>('all');
  const [results, setResults] = useState<{
    products: Product[];
    partners: Partner[];
    services: EngineeringService[];
    industries: IndustrySolution[];
    totalCount: number;
  }>({
    products: [],
    partners: [],
    services: [],
    industries: [],
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    const timer = setTimeout(() => {
      fetchResults();
    }, 150);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await api.search({ q: query });
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search semiconductor IP, SerDes, partners, UVM services, automotive..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Facet Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-900/90 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              activeTab === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Results ({results.totalCount})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Products ({results.products.length})
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              activeTab === 'partners'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Partners ({results.partners.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              activeTab === 'services'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Services ({results.services.length})
          </button>
        </div>

        {/* Results Stream */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {loading && (
            <div className="text-center py-8 text-xs text-slate-400">
              Querying Silphor catalog index...
            </div>
          )}

          {!loading && results.totalCount === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-300">No matching technical records found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for "RISC-V", "112G", "Foundry", "ISO 26262", or "Physical Design".
              </p>
            </div>
          )}

          {/* Products */}
          {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                Silicon Products & IP Cores
              </div>
              <div className="space-y-2">
                {results.products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigate('products', p.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-teal-500/60 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white group-hover:text-teal-300">
                        {p.name}
                      </span>
                      <span className="text-xs font-mono text-teal-400">{p.sku}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{p.tagline}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                      <span>{p.categoryName}</span>
                      <span>·</span>
                      <span>Phase: {p.lifecyclePhase}</span>
                      <span>·</span>
                      <span>{p.documents.length} Docs Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partners */}
          {(activeTab === 'all' || activeTab === 'partners') && results.partners.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Global Partners & Ecosystem
              </div>
              <div className="space-y-2">
                {results.partners.map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => {
                      onNavigate('partners', partner.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-purple-500/60 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white group-hover:text-purple-300">
                        {partner.name}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{partner.tier} {partner.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{partner.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                      <span>{partner.country}</span>
                      <span>·</span>
                      <span>{partner.certifications.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engineering Services */}
          {(activeTab === 'all' || activeTab === 'services') && results.services.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-sky-400" />
                Engineering Services
              </div>
              <div className="space-y-2">
                {results.services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onNavigate('services', s.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-sky-500/60 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white group-hover:text-sky-300">
                        {s.title}
                      </span>
                      <span className="text-xs text-sky-400">{s.leadTimeWeeks}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search indexed across Silphor master catalog</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
