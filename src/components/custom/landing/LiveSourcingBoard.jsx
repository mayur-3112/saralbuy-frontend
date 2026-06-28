import React, { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';
import { MapPin, Gavel, Clock, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import ProductListingCard from '@/components/custom/listing/ProductListingCard';
import Authentication from '../auth/Authenticate';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';


const CITIES = ['All Locations', 'Bengaluru', 'Mangaluru', 'Hubballi', 'Mysuru', 'Belagavi', 'Tumakuru', 'Dharwad'];

export default function LiveSourcingBoard({ onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [open, setOpen] = useState(false);
  const { user } = useUserState();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const { fn: fetchProducts, data: searchRes, loading } = useFetch(productService.getProductByTitle);

  useEffect(() => {
    fetchProducts('', 1, 50);
  }, []);

  useEffect(() => {
    const productsData = searchRes?.data?.data?.products || searchRes?.data?.products;
    if (productsData) {
      setRequirements(productsData);
    }
  }, [searchRes]);

  const filteredRequirements = requirements.filter(req => {
    const title = (req.title || '').toLowerCase();
    const specs = (req.description || '').toLowerCase();
    const org = (req.userId?.companyName || req.userId?.firstName || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || 
                          specs.includes(searchTerm.toLowerCase()) ||
                          org.includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Projects' || req.categoryId?.categoryName === selectedCategory;
    const reqLocation = (req.userId?.address || '').toLowerCase();
    const matchesLocation = selectedLocation === 'All Locations' || reqLocation.includes(selectedLocation.toLowerCase());

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
              {['All Projects', ...Array.from(new Set(requirements.map(req => req.categoryId?.categoryName).filter(Boolean)))].map((cat) => (
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
            <>
              {filteredRequirements.slice(0, 6).map((req) => (
                <ProductListingCard 
                  key={req._id} 
                  product={req}
                  onActionClick={() => {
                    if (user) {
                      navigate('/product-overview?productId=' + req._id);
                    } else if (onOpenAuth) {
                      onOpenAuth('buyer');
                    } else {
                      setOpen(true);
                    }
                  }}
                  actionLabel={user ? "Quote Now" : "Sign in to Quote"}
                />
              ))}
              {filteredRequirements.length > 6 && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/product-listing')}
                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-orange-50 border border-orange-300 text-orange-700 font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                  >
                    View All {filteredRequirements.length} Requirements
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </>
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
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>Showing {Math.min(6, filteredRequirements.length)} of {filteredRequirements.length} active requirements</span>
          <span>Updated: Just now</span>
        </div>

        {/* Authentication Modal Fallback */}
        <Authentication setOpen={setOpen} open={open} />
      </div>
    </section>
  );
}

