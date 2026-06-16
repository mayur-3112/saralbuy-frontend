import React from 'react';
import Hero from './Hero';
import B2BProductGrid from './B2BProductGrid';
import LiveSourcingBoard from './LiveSourcingBoard';
import HowItWorks from './HowItWorks';
import { Menu, ChevronRight } from 'lucide-react';

const SIDEBAR_CATEGORIES = [
  { name: 'Building & Structural Materials', sub: ['OPC 53 Cement', 'TMT Rebars', 'Bricks & AAC Blocks', 'Concrete'] },
  { name: 'Electrical & Lighting', sub: ['Cables & Wires', 'LED Panel Lights', 'Switches', 'Conduit Fittings'] },
  { name: 'Plumbing & Sanitaryware', sub: ['PVC Pipes', 'CPVC Fittings', 'Sanitary Taps', 'Valves'] },
  { name: 'Flooring, Tiles & Granite', sub: ['Vitrified Tiles', 'Sira Grey Granite', 'Marble Slabs', 'Adhesives'] },
  { name: 'Interior Finishing & Paints', sub: ['Exterior Emulsion', 'Wall Putty', 'Plywood', 'Hardware'] },
  { name: 'Safety Gear & Uniforms', sub: ['Safety Shoes', 'Boiler Suits', 'Safety Helmets', 'Gloves'] },
  { name: 'Industrial Tools & Pumps', sub: ['Impact Drills', 'Water Pumps', 'Generators', 'Hand Tools'] },
];

export default function LandingPage() {
  const triggerAuth = (roleType) => {
    localStorage.setItem('auth_default_role', roleType);
    window.dispatchEvent(new Event('session-expired'));
  };

  const handleCategoryClick = (catName) => {
    localStorage.setItem('pending_rfq_product', catName);
    localStorage.setItem('pending_rfq_qty', 'Bulk');
    triggerAuth('buyer');
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans">
      
      {/* 1. Hero Section */}
      <Hero onOpenAuth={triggerAuth} />

      {/* 2. Main Directory Contents Grid (Two-Column Layout) */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: B2B Category Directory Sidebar */}
        <aside className="lg:col-span-3 space-y-4 order-last lg:order-first mt-8 lg:mt-0">
          <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
            <div className="bg-slate-800 text-white p-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Menu className="w-4.5 h-4.5" /> Sourcing Categories
            </div>
            
            <div className="divide-y divide-slate-200">
              {SIDEBAR_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="p-3 hover:bg-slate-50 transition-colors group relative">
                  <div 
                    onClick={() => handleCategoryClick(cat.name)}
                    className="font-bold text-slate-900 text-xs flex justify-between items-center cursor-pointer group-hover:text-orange-600"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  
                  {/* Nested quick-links */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {cat.sub.slice(0, 2).map((s, subIdx) => (
                      <span
                        key={subIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(s);
                        }}
                        className="text-[10px] text-slate-500 hover:text-orange-600 cursor-pointer underline"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Desk Widget */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded shadow-xs text-center space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Need help sourcing?</h4>
            <p className="text-xs text-slate-600">Give us a call and we will register your requirement manually.</p>
            <div className="font-black text-orange-600 text-sm">📞 +91 98765 43210</div>
          </div>
        </aside>

        {/* Right Column: Main Content Area */}
        <main className="col-span-12 lg:col-span-9 space-y-8">
          
          {/* Popular wholesale products directory */}
          <B2BProductGrid onOpenAuth={triggerAuth} />
          
          {/* Active Requirements Exchange Board Table */}
          <LiveSourcingBoard onOpenAuth={triggerAuth} />

        </main>
      </div>

      {/* 3. How It Works */}
      <HowItWorks onOpenAuth={triggerAuth} />

    </div>
  );
}
