import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import requirementService from '@/services/requirement.service';
import { Search, MapPin, Grid, Briefcase, FileText, Gavel, MessageSquare, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductListingCard from '@/components/custom/listing/ProductListingCard';

const MOCK_DB_REQUIREMENTS = [
  {
    _id: 'req_mock_1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    currentLocation: 'Bengaluru, KA',
    quantity: 1500,
    title: 'UltraTech OPC 53 Grade Cement',
    image: '/image/Category/industrialImage.png',
    productId: {
      _id: 'prod_mock_1',
      title: 'UltraTech OPC 53 Grade Cement',
      image: '/image/Category/industrialImage.png',
      isMergeQuote: false,
      quantity: 1500,
      categoryId: { categoryName: 'industrial' },
    },
    buyerId: {
      firstName: 'Mayur',
      lastName: 'Agarwal',
      address: 'Peenya Project Site, Bengaluru',
    },
    specs: 'Delivery required at site, unloading in scope of supplier. ISI marked fresh stock only.',
  },
  {
    _id: 'req_mock_2',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    currentLocation: 'Mangaluru, KA',
    quantity: 12,
    title: 'Fe 550 TMT Steel Reinforcement Bars',
    image: '/image/Category/industrialImage.png',
    productId: {
      _id: 'prod_mock_2',
      title: 'Fe 550 TMT Steel Reinforcement Bars',
      image: '/image/Category/industrialImage.png',
      isMergeQuote: true,
      quantity: 12,
      categoryId: { categoryName: 'industrial' },
    },
    buyerId: {
      firstName: 'Ramesh',
      lastName: 'Kumar',
      address: 'Smart City Project, Mangaluru',
    },
    specs: 'Standard 12m length, sizes: 8mm, 12mm, 16mm mixed ratio. Mill test certificate required.',
  },
  {
    _id: 'req_mock_3',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: 'Hubballi, KA',
    quantity: 2500,
    title: 'Heavy Duty PVC Conduit Pipes (20mm)',
    image: '/image/Category/industrialImage.png',
    productId: {
      _id: 'prod_mock_3',
      title: 'Heavy Duty PVC Conduit Pipes (20mm)',
      image: '/image/Category/industrialImage.png',
      isMergeQuote: false,
      quantity: 2500,
      categoryId: { categoryName: 'industrial' },
    },
    buyerId: {
      firstName: 'Kiran',
      lastName: 'Patel',
      address: 'Commercial Complex, Hubballi',
    },
    specs: 'FRLS (Fire Retardant Low Smoke) grade, standard light grey color with couplers.',
  },
  {
    _id: 'req_mock_4',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    currentLocation: 'Belagavi, KA',
    quantity: 1200,
    title: 'Double Charge Vitrified Tiles (600x600)',
    image: '/image/Category/sportsImage.png',
    productId: {
      _id: 'prod_mock_4',
      title: 'Double Charge Vitrified Tiles (600x600)',
      image: '/image/Category/sportsImage.png',
      isMergeQuote: false,
      quantity: 1200,
      categoryId: { categoryName: 'sports' },
    },
    buyerId: {
      firstName: 'Sanjay',
      lastName: 'Shetty',
      address: 'Residential Villa Project, Belagavi',
    },
    specs: 'Glossy finish, ivory/white base color, premium quality brand (Kajaria/Somany equivalent).',
  },
  {
    _id: 'req_mock_5',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    currentLocation: 'Mysuru, KA',
    quantity: 3000,
    title: 'Polished Granite Slabs (Sira Grey, 18mm)',
    image: '/image/Category/furnitureImage.png',
    productId: {
      _id: 'prod_mock_5',
      title: 'Polished Granite Slabs (Sira Grey, 18mm)',
      image: '/image/Category/furnitureImage.png',
      isMergeQuote: true,
      quantity: 3000,
      categoryId: { categoryName: 'furniture' },
    },
    buyerId: {
      firstName: 'Anand',
      lastName: 'Gowda',
      address: 'IT Park Site, Mysuru',
    },
    specs: 'Uniform thickness, single-quarry lot, double-polished, pre-cut to standard counter size.',
  },
  {
    _id: 'req_mock_6',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    currentLocation: 'Tumakuru, KA',
    quantity: 500,
    title: 'Recessed LED Panel Lights (15W, Warm)',
    image: '/image/Category/homeAppliancesImage.png',
    productId: {
      _id: 'prod_mock_6',
      title: 'Recessed LED Panel Lights (15W, Warm)',
      image: '/image/Category/homeAppliancesImage.png',
      isMergeQuote: false,
      quantity: 500,
      categoryId: { categoryName: 'home' },
    },
    buyerId: {
      firstName: 'Vijay',
      lastName: 'Rao',
      address: 'Apartment Project, Tumakuru',
    },
    specs: 'Round shape, aluminum body, driver included, minimum 2-year manufacturer warranty.',
  },
];

const CATEGORIES = [
  { value: 'All', label: 'All Project Scopes' },
  { value: 'industrial', label: 'Building & Structural Materials' },
  { value: 'electronics', label: 'Electrical & Lighting' },
  { value: 'home', label: 'Plumbing & Hardware' },
  { value: 'furniture', label: 'Finishing, Tiles & Granite' },
];

const CITIES = ['All Locations', 'Bengaluru', 'Mangaluru', 'Hubballi', 'Mysuru', 'Belagavi', 'Tumakuru'];

export default function SourcingWorkspace({ user, userBidsCount, userDraftsCount }) {
  const navigate = useNavigate();
  const { fn: loadReqsFn, data: serverReqs } = useFetch(requirementService.getRecentRequiremnts);
  
  // State variables for filter inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  useEffect(() => {
    loadReqsFn();
  }, []);

  // Merge server data and mock data to guarantee the board is never empty
  const combinedRequirements = React.useMemo(() => {
    const serverList = serverReqs || [];
    // Ensure we do not duplicate elements
    const ids = new Set(serverList.map(r => r._id));
    const finalMock = MOCK_DB_REQUIREMENTS.filter(r => !ids.has(r._id));
    return [...serverList, ...finalMock];
  }, [serverReqs]);

  // Apply filters client-side for immediate responsive interaction
  const filteredRequirements = React.useMemo(() => {
    return combinedRequirements.filter(req => {
      const title = (req.productId?.title || req.title || '').toLowerCase();
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      
      const category = (req.productId?.categoryId?.categoryName || req.categoryId?.categoryName || '').toLowerCase();
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory.toLowerCase();

      const location = (req.currentLocation || req.buyerId?.address || '').toLowerCase();
      const matchesLocation = selectedLocation === 'All Locations' || location.includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [combinedRequirements, searchTerm, selectedCategory, selectedLocation]);

  return (
    <div className="space-y-8 py-6">
      
      {/* 1. Serious B2B Dashboard KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Sourcing Leads */}
        <div 
          className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ffffff 80%, #fff9f3 100%)' }}
        >
          <div className="w-12 h-12 rounded bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-110 group-hover:bg-orange-100 group-hover:text-orange-700 transition-all duration-300">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Sourcing Leads</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{combinedRequirements.length}</p>
          </div>
        </div>

        {/* KPI 2: My Submitted Quotes */}
        <div 
          className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ffffff 80%, #f0f7ff 100%)' }}
        >
          <div className="w-12 h-12 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">My Submitted Quotes</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{userBidsCount || 0}</p>
          </div>
        </div>

        {/* KPI 3: My Sourcing Drafts */}
        <div 
          className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ffffff 80%, #fffbeb 100%)' }}
        >
          <div className="w-12 h-12 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 group-hover:bg-amber-100 group-hover:text-amber-700 transition-all duration-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">My Sourcing Drafts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{userDraftsCount || 0}</p>
          </div>
        </div>

        {/* KPI 4: Negotiation Rooms */}
        <div 
          className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ffffff 80%, #f0fdf4 100%)' }}
        >
          <div className="w-12 h-12 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-all duration-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Negotiation Rooms</p>
            <p className="text-2xl font-black text-slate-900 mt-1">Active</p>
          </div>
        </div>

      </div>

      {/* 2. Interactive Sourcing Filter Terminal */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Sourcing & Quoting Terminal</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filter active requirements and submit direct quotes.</p>
          </div>
          
          <button
            onClick={() => navigate('/requirement')}
            className="group w-full lg:w-auto px-5 py-3 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-orange-600/15"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Post New Project Sourcing Need
          </button>
        </div>

        {/* Filter Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300 overflow-hidden">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords (e.g. cement, steel, pipes)..."
              className="pl-10 w-full p-3.5 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Industry Category Filter */}
          <div className="relative flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300 overflow-hidden">
            <Grid className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 w-full p-3.5 text-sm focus:outline-none appearance-none bg-white text-slate-800"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location City Filter */}
          <div className="relative flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all duration-300 overflow-hidden">
            <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 w-full p-3.5 text-sm focus:outline-none appearance-none bg-white text-slate-800"
            >
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Filtered Grid of Active Sourcing Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <p className="text-sm text-slate-500 font-semibold">
            Showing <span className="text-orange-600 font-extrabold">{filteredRequirements.length}</span> active listings
          </p>
        </div>

        {filteredRequirements.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredRequirements.map((req) => (
              <ProductListingCard 
                key={req._id}
                product={req}
                actionLabel="Quote Now"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded p-12 text-center max-w-md mx-auto space-y-3">
            <p className="text-4xl">🔍</p>
            <h3 className="font-extrabold text-slate-800 text-lg">No sourcing items match your filters</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords, location filters, or category selections.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLocation('All Locations');
              }}
              className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
