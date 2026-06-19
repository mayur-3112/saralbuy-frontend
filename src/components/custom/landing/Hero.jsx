import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

export default function Hero({ onOpenAuth }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save search as a pending RFQ product
      localStorage.setItem('pending_rfq_product', searchQuery);
      localStorage.setItem('pending_rfq_qty', 'Bulk');
      onOpenAuth('buyer');
    }
  };

  const handlePostRequirement = () => {
    onOpenAuth('buyer');
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-100/20 border-b border-orange-100/60 relative overflow-hidden">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-radial from-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-radial from-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Get Wholesale Price Quotes <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Directly From Builders & Suppliers</span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            SaralBuy is Karnataka's business directory for building materials, TMT steel, plumbing conduits, and electrical contract goods. Post what you need and local vetted suppliers will bid their lowest rates.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, e.g. TMT Steel, Cement, PVC Pipes..."
                className="flex-1 px-3 py-4 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-sm font-bold px-6 py-4 cursor-pointer transition-all duration-200 shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Popular:</span>
            {['OPC 53 Cement', 'Fe 550 Steel', 'PVC Conduits', 'Vitrified Tiles', 'Granite Slabs'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-orange-300 hover:text-orange-600 hover:-translate-y-0.5 hover:shadow-sm text-slate-600 text-xs font-semibold rounded-full cursor-pointer transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Post Requirement CTA */}
          <div className="pt-4">
            <button
              onClick={handlePostRequirement}
              className="group inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/15 active:scale-95 text-white font-bold text-sm px-7 py-4 rounded-xl cursor-pointer transition-all duration-200"
            >
              Post Your Requirement 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
