import React, { useState } from 'react';
import { MapPin, Gavel, Clock, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import ProductListingCard from '@/components/custom/listing/ProductListingCard';
import Authentication from '../auth/Authenticate';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';

const MOCK_REQUIREMENTS = [
  {
    id: 1,
    title: 'UltraTech OPC 53 Grade Cement',
    category: 'Building & Structural',
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
    category: 'Building & Structural',
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
    category: 'Plumbing & Sanitaryware',
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
    category: 'Flooring, Tiles & Granite',
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
    category: 'Flooring, Tiles & Granite',
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
  {
    id: 7,
    title: 'Waterproof Commercial Plywood (18mm)',
    category: 'Plywood & Hardware',
    organization: 'SQUARE YARDS CONTRACTING',
    quantity: '150 Sheets',
    location: 'HSR Layout Residential Site, Bengaluru',
    postedTime: '4 days ago',
    bidsCount: 7,
    specs: 'BWP grade marine plywood, ISI marked, dimension stable, high boiling water resistance.',
    status: 'Active',
  },
  {
    id: 8,
    title: 'Premium Exterior Emulsion Weatherproof Paint',
    category: 'Interior & Paints',
    organization: 'TATA HOUSING PROJECTS',
    quantity: '400 Litres',
    location: 'Golf Course Extension, Mysuru',
    postedTime: '5 days ago',
    bidsCount: 9,
    specs: 'High durability, anti-algal, dirt pick-up resistance, light cream/grey shades.',
    status: 'Active',
  },
  {
    id: 9,
    title: 'Industrial Safety Shoes & Helmets Combo',
    category: 'Safety Gear & Uniforms',
    organization: 'SHAPOORJI PALLONJI',
    quantity: '250 Sets',
    location: 'Industrial Area Phase 2, Dharwad',
    postedTime: '6 days ago',
    bidsCount: 11,
    specs: 'Steel toe cap shoes (S3 rating), high-density polyethylene shells helmets with chin straps.',
    status: 'Active',
  },
  {
    id: 10,
    title: 'Submersible Water Pumps (5 HP, 3 Phase)',
    category: 'Industrial Tools & Pumps',
    organization: 'KIRLOSKAR CONSTRUCTIONS',
    quantity: '15 Units',
    location: 'Water Treatment Plant, Belagavi',
    postedTime: '1 week ago',
    bidsCount: 5,
    specs: 'Cast iron body, copper winding, high discharge capacity, 1 year warranty.',
    status: 'Active',
  }
];

const CATEGORIES = [
  'All Projects',
  'Building & Structural',
  'Electrical & Lighting',
  'Plumbing & Sanitaryware',
  'Flooring, Tiles & Granite',
  'Interior & Paints',
  'Plywood & Hardware',
  'Safety Gear & Uniforms',
  'Industrial Tools & Pumps'
];

const CITIES = ['All Locations', 'Bengaluru', 'Mangaluru', 'Hubballi', 'Mysuru', 'Belagavi', 'Tumakuru', 'Dharwad'];

export default function LiveSourcingBoard({ onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [open, setOpen] = useState(false);
  const { user } = useUserState();
  const navigate = useNavigate();

  const filteredRequirements = MOCK_REQUIREMENTS.filter(req => {
    const title = req.title.toLowerCase();
    const specs = req.specs.toLowerCase();
    const org = req.organization.toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || 
                          specs.includes(searchTerm.toLowerCase()) ||
                          org.includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Projects' || req.category === selectedCategory;

    const matchesLocation = selectedLocation === 'All Locations' || req.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

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

        {/* B2B Filter Terminal */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 md:p-6 mb-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Keyword Search */}
            <div className="relative flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300 overflow-hidden">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keywords (e.g. cement, steel, pipes)..."
                className="pl-10 w-full p-3 text-sm focus:outline-none text-slate-800 placeholder-slate-400 bg-white"
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300 overflow-hidden">
              <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 w-full p-3 text-sm focus:outline-none appearance-none bg-white text-slate-800 cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filter by Category:</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold border rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sourcing Board Exchange Cards */}
        <div className="flex flex-col gap-4 mt-6">
          {filteredRequirements.length > 0 ? (
            filteredRequirements.map((req) => (
              <ProductListingCard 
                key={req.id} 
                product={{
                  _id: req.id.toString(),
                  rfqId: `EP#${5050 + req.id}`,
                  title: req.title,
                  createdAt: new Date(Date.now() - req.id * 86400000).toISOString(),
                  timeline: new Date(Date.now() + 86400000 * 7).toISOString(),
                  userId: {
                    companyName: req.organization,
                    address: req.location,
                    country: 'India'
                  },
                  categoryId: { categoryName: req.category },
                  country: 'India'
                }}
                onActionClick={() => {
                  if (user) {
                    navigate('/product-overview?productId=' + req.id);
                  } else if (onOpenAuth) {
                    onOpenAuth('buyer');
                  } else {
                    setOpen(true);
                  }
                }}
                actionLabel={user ? "Quote Now" : "Sign in to Quote"}
              />
            ))
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-4">
              <p className="text-4xl">🔍</p>
              <h3 className="font-extrabold text-slate-800 text-lg">No requirements match your filters</h3>
              <p className="text-xs text-slate-500">Try adjusting your search query, location filter, or category selection.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('All Locations');
                  setSelectedCategory('All Projects');
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Counter Widget at bottom of board */}
        <div className="mt-4 text-right text-xs text-slate-500 font-bold">
          Sourcing directory updated: Just now
        </div>

        {/* Authentication Modal Fallback */}
        <Authentication setOpen={setOpen} open={open} />
      </div>
    </section>
  );
}
