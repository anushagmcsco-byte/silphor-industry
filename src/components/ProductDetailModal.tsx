import React from 'react';
import { Product } from '../types';
import { X, FileText, Download, CheckCircle, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestRfq: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestRfq,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-teal-400 font-mono">
              <span>{product.sku}</span>
              <span>·</span>
              <span className="capitalize">{product.categoryName}</span>
              <span>·</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-sans">
                {product.lifecyclePhase}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 break-words">{product.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5 break-words">{product.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-xs sm:text-sm text-slate-300">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Architectural Overview
            </h3>
            <p className="leading-relaxed text-slate-300 bg-slate-950/40 p-4 rounded-lg border border-slate-800/80">
              {product.description}
            </p>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Key Technical Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="p-3 bg-slate-950/60 border border-slate-800/90 rounded-md flex flex-col"
                >
                  <span className="text-[11px] text-slate-500 font-medium">{key}</span>
                  <span className="text-xs font-semibold text-white font-mono mt-0.5">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents & Deliverables */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Datasheets & Qualification Documents
            </h3>
            {product.documents.length === 0 ? (
              <p className="text-xs text-slate-500">Documentation available upon NDA verification.</p>
            ) : (
              <div className="space-y-2">
                {product.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 text-teal-400 rounded-md">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{doc.title}</div>
                        <div className="text-[11px] text-slate-500">
                          Format: PDF · Size: {doc.fileSize} · Rev: {doc.version}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Simulated secure download for: ${doc.title}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Provider: <strong className="text-slate-300">{product.vendorName}</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onRequestRfq(product);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <span>Submit RFQ for this Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
