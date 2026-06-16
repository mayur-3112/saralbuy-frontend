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
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Get Wholesale bids Directly From Builders & Suppliers
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            SaralBuy is Karnataka's business directory for building materials, TMT steel, plumbing conduits, and electrical contract goods. Post what you need and local vetted suppliers will bid their lowest rates.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, e.g. TMT Steel, Cement, PVC Pipes..."
                className="flex-1 px-3 py-3 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-5 py-3 cursor-pointer transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Popular:</span>
            {['OPC 53 Cement', 'Fe 550 Steel', 'PVC Conduits', 'Vitrified Tiles', 'Granite Slabs'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium rounded cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Post Requirement CTA */}
          <div className="pt-2">
            <button
              onClick={handlePostRequirement}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm px-6 py-3 rounded cursor-pointer transition-colors"
            >
              Post Your Requirement <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
