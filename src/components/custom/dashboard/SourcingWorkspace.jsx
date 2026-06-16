import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import requirementService from '@/services/requirement.service';
import { Search, MapPin, Grid, Briefcase, FileText, Gavel, MessageSquare, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <div className="bg-white border border-slate-350 rounded p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Sourcing Leads</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{combinedRequirements.length}</p>
          </div>
        </div>

        {/* KPI 2: My Submitted Bids */}
        <div className="bg-white border border-slate-350 rounded p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">My Submitted Bids</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{userBidsCount || 0}</p>
          </div>
        </div>

        {/* KPI 3: My Sourcing Drafts */}
        <div className="bg-white border border-slate-350 rounded p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">My Sourcing Drafts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{userDraftsCount || 0}</p>
          </div>
        </div>

        {/* KPI 4: Negotiation Rooms */}
        <div className="bg-white border border-slate-350 rounded p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Negotiation Rooms</p>
            <p className="text-2xl font-black text-slate-900 mt-1">Active</p>
          </div>
        </div>

      </div>

      {/* 2. Interactive Sourcing Filter Terminal */}
      <div className="bg-white border border-slate-300 rounded p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Sourcing & Bidding Terminal</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filter active requirements and submit direct reverse-bids.</p>
          </div>
          
          <button
            onClick={() => navigate('/requirement')}
            className="w-full lg:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
          >
            <Plus className="w-4 h-4" /> Post New Project Sourcing Need
          </button>
        </div>

        {/* Filter Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords (e.g. cement, steel, pipes)..."
              className="pl-10 w-full rounded border border-slate-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Industry Category Filter */}
          <div className="relative">
            <Grid className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 w-full rounded border border-slate-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-transparent to-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location City Filter */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 w-full rounded border border-slate-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
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
          <div className="overflow-hidden border border-slate-300 rounded bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 text-xs uppercase font-extrabold">
                    <th className="p-4 w-[35%]">Project Material Needs</th>
                    <th className="p-4 w-[12%]">Quantity</th>
                    <th className="p-4 w-[20%]">Buyer & Project Site</th>
                    <th className="p-4 w-[10%] text-center">Bids Received</th>
                    <th className="p-4 w-[10%]">Date Posted</th>
                    <th className="p-4 w-[13%] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {filteredRequirements.map((req) => {
                    const buyerName = req.buyerId ? `${req.buyerId.firstName} ${req.buyerId.lastName || ''}` : 'Buyer';
                    const buyerLocation = req.currentLocation || req.buyerId?.address || 'Karnataka';
                    const specs = req.productId?.description || req.specs || 'Project specifications provided.';
                    return (
                      <tr key={req._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-slate-950 text-[15px]">{req.productId?.title || req.title}</div>
                          <div className="text-xs text-slate-400 font-semibold mt-1">Category: {req.productId?.categoryId?.categoryName || 'General'}</div>
                          <div className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium bg-slate-50 border border-slate-100 rounded p-2">{specs}</div>
                        </td>
                          <td className="p-4">
                            {req.productId?.isUpload ? (
                              <div className="text-orange-600 text-[13px] font-bold bg-orange-50 px-2 py-1 rounded inline-block">Document Uploaded</div>
                            ) : req.productId?.isMultiple ? (
                              <div className="text-sm text-slate-700">
                                <ul className="list-disc pl-4 text-xs space-y-1 font-medium">
                                  {(req.productId?.items || req.items || []).slice(0, 3).map((subItem, idx) => (
                                    <li key={idx} className="truncate">
                                      {subItem.subCategoryName} <span className="text-slate-400">({subItem.quantity} {subItem.quantityUnit})</span>
                                    </li>
                                  ))}
                                </ul>
                                {(req.productId?.items || req.items || []).length > 3 && (
                                  <div className="text-xs text-blue-600 mt-1 italic pl-1 font-semibold">+ {(req.productId?.items || req.items || []).length - 3} more items</div>
                                )}
                              </div>
                            ) : (
                              <div className="font-black text-slate-900 text-[15px]">
                                {req.productId?.quantity || req.quantity} Units
                              </div>
                            )}
                          </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{buyerName}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{buyerLocation}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold rounded">
                            <Gavel className="w-3.5 h-3.5" /> {req.productId?.totalBidCount || req.bidsCount || 0} Bids
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 font-bold">
                          {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => navigate(`/product-overview?productId=${req.productId?._id || req._id}`)}
                            className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded border border-orange-600 transition-colors cursor-pointer"
                          >
                            Place Bid
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
