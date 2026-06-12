import React from 'react';
import { Shield, MapPin, Award } from 'lucide-react';

export default function TrustSection({ onOpenAuth }) {
  const verifiedSteps = [
    {
      icon: Shield,
      title: 'GST & PAN Vetted Businesses',
      desc: 'All buyers and suppliers must verify their GSTIN registration details before submitting or requesting quotes, ensuring genuine business dealings.',
    },
    {
      icon: Award,
      title: 'Identity Verification Checked',
      desc: 'Mandatory Aadhaar/PAN identity checks protect the platform from fraud, fake buyers, and non-responsive suppliers.',
    },
  ];

  const categories = [
    { name: 'Structural Steel & TMT Bars', count: '210+ Suppliers' },
    { name: 'Cement & Building Materials', count: '145+ Suppliers' },
    { name: 'Electricals, Cables & Lighting', count: '95+ Suppliers' },
    { name: 'Plumbing & Sanitaryware', count: '120+ Suppliers' },
    { name: 'Flooring, Tiles & Granite', count: '80+ Suppliers' },
    { name: 'Interior Finishing & Paints', count: '65+ Suppliers' },
  ];

  return (
    <section className="bg-white text-slate-900 py-20 border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Trust Vetting Description */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              100% Vetted Network
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight text-slate-900">
              A Sourcing Network Built on Strict Verification
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              B2B marketplaces only work when people are real. At SaralBuy, we vet every registered contractor and supplier so you can focus on trading without worrying about advance payment frauds or fake leads.
            </p>
            
            <div className="space-y-6 pt-4">
              {verifiedSteps.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 text-orange-600 shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories & Cities Reach */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 rounded-3xl p-8 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Project Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-center hover:border-orange-500/30 transition-all shadow-sm">
                    <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                    <span className="text-xs text-orange-600 font-extrabold bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" /> Sourcing Hubs in Karnataka
              </h3>
              <p className="text-slate-500 text-sm mt-1">Connecting project contractors and suppliers across key commercial zones:</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Udupi', 'Tumakuru', 'Shivamogga'].map((city, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-full shadow-sm">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
