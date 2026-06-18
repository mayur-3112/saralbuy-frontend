import React, { useState } from 'react';
import { MapPin, Gavel, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { maskOrganizationName } from '../../../utils/maskName';

const MOCK_REQUIREMENTS = [
  {
    id: 1,
    title: 'UltraTech OPC 53 Grade Cement',
    category: 'Building Materials',
    organization: 'LARSEN & TOUBRO LIMITED',
    quantity: '1,500 Bags',
    location: 'Peenya Project Site, Bengaluru',
    postedTime: '2 hours ago',
    bidsCount: 6,
    specs: 'Delivery required at site, unloading in scope of supplier. ISI marked fresh stock only.',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Fe 550 TMT Steel Reinforcement Bars',
    category: 'Building Materials',
    organization: 'PRESTIGE ESTATES PROJECTS',
    quantity: '12 Tons',
    location: 'Smart City Project, Mangaluru',
    postedTime: '5 hours ago',
    bidsCount: 8,
    specs: 'Standard 12m length, sizes: 8mm, 12mm, 16mm mixed ratio. Mill test certificate required.',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Heavy Duty PVC Conduit Pipes (20mm)',
    category: 'Plumbing & Fittings',
    organization: 'BRIGADE ENTERPRISES',
    quantity: '2,500 Meters',
    location: 'Commercial Complex, Hubballi',
    postedTime: '1 day ago',
    bidsCount: 4,
    specs: 'FRLS (Fire Retardant Low Smoke) grade, standard light grey color with couplers.',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Double Charge Vitrified Floor Tiles (600x600mm)',
    category: 'Finishing & Interior',
    organization: 'SOBHA DEVELOPERS',
    quantity: '1,200 Sq Ft',
    location: 'Residential Villa Project, Belagavi',
    postedTime: 'Yesterday',
    bidsCount: 5,
    specs: 'Glossy finish, ivory/white base color, premium quality brand (Kajaria/Somany equivalent).',
    status: 'Active',
  },
  {
    id: 5,
    title: 'Polished Granite Slabs (Sira Grey, 18mm)',
    category: 'Finishing & Interior',
    organization: 'PURAVANKARA LIMITED',
    quantity: '3,000 Sq Ft',
    location: 'IT Park Site, Mysuru',
    postedTime: '2 days ago',
    bidsCount: 12,
    specs: 'Uniform thickness, single-quarry lot, double-polished, pre-cut to standard counter size.',
    status: 'Deal Closed',
  },
  {
    id: 6,
    title: 'Recessed LED Panel Lights (15W, Warm White)',
    category: 'Electrical & Lighting',
    organization: 'MAHINDRA LIFESPACES',
    quantity: '500 Units',
    location: 'Apartment Project, Tumakuru',
    postedTime: '3 days ago',
    bidsCount: 3,
    specs: 'Round shape, aluminum body, driver included, minimum 2-year manufacturer warranty.',
    status: 'Active',
  },
];

const CATEGORIES = ['All Projects', 'Building Materials', 'Electrical & Lighting', 'Plumbing & Fittings', 'Finishing & Interior'];

export default function LiveSourcingBoard({ onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');

  const filteredRequirements = selectedCategory === 'All Projects'
    ? MOCK_REQUIREMENTS
    : MOCK_REQUIREMENTS.filter(req => req.category === selectedCategory);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="border-l-4 border-orange-600 pl-4 mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Live Sourcing & Material Requirements Exchange
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse real active bulk construction inquiries posted by verified contractors and builders in Karnataka.
          </p>
        </div>

        {/* Category Tabs Grid (IndiaMART style blocky list) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold border rounded transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sourcing Board Exchange Table */}
        <div className="overflow-hidden border border-slate-300 rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 text-xs uppercase font-extrabold">
                  <th className="p-4 w-[35%]">Requirement Description</th>
                  <th className="p-4 w-[12%]">Quantity</th>
                  <th className="p-4 w-[20%]">Buyer & Location</th>
                  <th className="p-4 w-[10%] text-center">Quotes Received</th>
                  <th className="p-4 w-[10%]">Status</th>
                  <th className="p-4 w-[13%] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {filteredRequirements.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Item title & Specs */}
                    <td className="p-4">
                      <div className="font-extrabold text-slate-950 text-[15px]">{req.title}</div>
                      <div className="text-xs text-slate-400 font-semibold mt-1">Category: {req.category}</div>
                      <div className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium bg-slate-50 border border-slate-100 rounded p-2">{req.specs}</div>
                    </td>
                    
                    {/* Quantity */}
                    <td className="p-4 font-black text-slate-900 text-[15px]">
                      {req.quantity}
                    </td>
                    
                    {/* Location & Organization */}
                    <td className="p-4">
                      <div className="font-extrabold text-slate-500 text-[11px] mb-1 tracking-widest bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                        {maskOrganizationName(req.organization)}
                      </div>
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="leading-snug">{req.location}</span>
                      </div>
                    </td>
                    
                    {/* Quotes Received */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold rounded">
                        <Gavel className="w-3.5 h-3.5" /> {req.bidsCount} Quotes
                      </span>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                        req.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {req.status}
                      </span>
                      <div className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {req.postedTime}
                      </div>
                    </td>
                    
                    {/* Action button */}
                    <td className="p-4 text-center">
                      {req.status === 'Active' ? (
                        <button
                          onClick={() => onOpenAuth('seller')}
                          className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded border border-orange-600 transition-colors cursor-pointer"
                        >
                          Place Quote
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenAuth('buyer')}
                          className="w-full py-2 bg-slate-100 text-slate-500 text-xs font-extrabold rounded border border-slate-200 cursor-pointer"
                        >
                          Post Similar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Counter Widget at bottom of board */}
        <div className="mt-4 text-right text-xs text-slate-500 font-bold">
          ⚡ Sourcing directory updated: Just now
        </div>

      </div>
    </section>
  );
}
