import React, { useState } from 'react';
import { Product, TechnologyCategory } from '../types';
import { Cpu, Search, Filter, FileText, ArrowRight, Layers, Check } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  categories: TechnologyCategory[];
  onSelectProduct: (product: Product) => void;
  onNavigateRfqWithProduct: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  categories,
  onSelectProduct,
  onNavigateRfqWithProduct,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (selectedPhase !== 'all' && p.lifecyclePhase !== selectedPhase) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        Object.values(p.specs).some((v) => v.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Silphor Technologies Catalogue</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Technologies & Products</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Synthesizable IP cores, evaluation platforms, and production-ready modules with comprehensive datasheets, register maps, and functional safety documentation.
        </p>
      </div>

      {/* Filter and Category Ribbon */}
      <div className="space-y-4">
        {/* Category buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
              selectedCat === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                  selectedCat === c.id
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Phase Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, architecture (e.g. RISC-V, PAM4, TSN), or parameter..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Lifecycle:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Phases</option>
              <option value="Active">Active Production</option>
              <option value="Sampling">Sampling</option>
              <option value="Preview">Preview</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-teal-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-teal-400 font-bold">{product.sku}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {product.lifecyclePhase}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-2 group-hover:text-teal-300 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {product.tagline}
              </p>

              {/* Technical parameter list */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-slate-400">
                    <span className="text-slate-500 text-[11px]">{key}:</span>
                    <span className="font-mono text-slate-300 text-[11px] truncate max-w-[170px]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Document count */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>{product.documents.length} Technical Documents Available</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => onSelectProduct(product)}
                className="text-slate-300 hover:text-white font-medium cursor-pointer"
              >
                Inspect Specs & Docs
              </button>

              <button
                onClick={() => onNavigateRfqWithProduct(product)}
                className="px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
