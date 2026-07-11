import { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';
import { MapPin, ArrowRight, Search, PackageOpen } from 'lucide-react';
import ProductListingCard from '@/components/custom/listing/ProductListingCard';
import Authentication from '../auth/Authenticate';
import { useUserState } from '../../../redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';

/**
 * LiveSourcingBoard — real RFQs, real time.
 *
 * The old version claimed "verified contractors and builders in Karnataka"
 * (we don't verify buyers) and displayed a hardcoded "Updated: Just now"
 * (nothing was streaming). Both fixed. Also compacted the filter panel
 * from a two-row block to a single inline strip so the actual RFQs get
 * the real estate they deserve.
 */

const CITIES = ['All locations', 'Bengaluru', 'Mangaluru', 'Hubballi', 'Mysuru', 'Belagavi', 'Tumakuru', 'Dharwad'];

export default function LiveSourcingBoard({ onOpenAuth }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All locations');
  const [statusFilter, setStatusFilter] = useState('active'); // active, expired, all
  const [open, setOpen] = useState(false);
  const { user } = useUserState();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const { fn: fetchProducts, data: searchRes } = useFetch(productService.getProductByTitle);

  useEffect(() => {
    fetchProducts('', 1, 50);
  }, []);

  useEffect(() => {
    const productsData = searchRes?.data?.data?.products || searchRes?.data?.products;
    if (productsData) setRequirements(productsData);
  }, [searchRes]);

  const filtered = requirements.filter(req => {
    const title = (req.title || '').toLowerCase();
    const specs = (req.description || '').toLowerCase();
    const matchesSearch = !searchTerm || title.includes(searchTerm.toLowerCase()) || specs.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || req.categoryId?.categoryName === selectedCategory;
    const reqLocation = (req.userId?.address || '').toLowerCase();
    const matchesLocation = selectedLocation === 'All locations' || reqLocation.includes(selectedLocation.toLowerCase());
    
    // Check expiry
    let isExpired = false;
    const expiryDateStr = req.bidExpiryDate || req.timeline || req.bidActiveDuration;
    if (expiryDateStr && isNaN(Number(expiryDateStr))) {
      isExpired = new Date(expiryDateStr).getTime() < Date.now();
    } else if (expiryDateStr && !isNaN(Number(expiryDateStr))) {
      const days = Number(expiryDateStr);
      isExpired = new Date(new Date(req.createdAt || Date.now()).getTime() + days * 24 * 60 * 60 * 1000).getTime() < Date.now();
    } else if (!expiryDateStr && req.createdAt) {
      const days = Number(req.bidActiveDuration || '1');
      isExpired = new Date(new Date(req.createdAt).getTime() + days * 24 * 60 * 60 * 1000).getTime() < Date.now();
    }
    let matchesExpiry = true;
    if (statusFilter === 'active') matchesExpiry = !isExpired;
    if (statusFilter === 'expired') matchesExpiry = isExpired;

    return matchesSearch && matchesCategory && matchesLocation && matchesExpiry;
  });

  // "Live now" must count only ACTIVE (non-expired) RFQs, not every row.
  const isReqExpired = req => {
    const s = req.bidExpiryDate || req.timeline || req.bidActiveDuration;
    if (s && isNaN(Number(s))) return new Date(s).getTime() < Date.now();
    if (s && !isNaN(Number(s))) {
      return new Date(new Date(req.createdAt || Date.now()).getTime() + Number(s) * 86400000).getTime() < Date.now();
    }
    if (req.createdAt) {
      const days = Number(req.bidActiveDuration || '1');
      return new Date(new Date(req.createdAt).getTime() + days * 86400000).getTime() < Date.now();
    }
    return false;
  };
  const liveCount = requirements.filter(r => !isReqExpired(r)).length;

  const categories = Array.from(new Set(requirements.map(r => r.categoryId?.categoryName).filter(Boolean)));

  return (
    <section className="py-4">
      {/* Section header — real count in the eyebrow, honest and specific */}
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <span className="text-sm font-black text-emerald-700">
              {liveCount > 0 ? `${liveCount} live now` : 'Live board'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Real requirements. Real quotes.
          </h2>
          <p className="text-base text-slate-600 mt-2 max-w-xl">
            These are actual RFQs posted on SaralBuy. Sign in to quote, or browse them here.
          </p>
        </div>
        {requirements.length > 6 && (
          <button
            type="button"
            onClick={() => navigate('/product-listing')}
            className="group inline-flex items-center gap-1.5 text-base font-bold text-orange-700 hover:text-orange-800"
          >
            View all {liveCount}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Compact inline filter row with Show Expired Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 mb-4 items-center">
        <div className="relative flex items-center bg-white border border-slate-200 rounded-lg focus-within:border-slate-400 transition-colors">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search RFQs (cement, steel, tiles…)"
            className="pl-9 w-full py-2.5 text-sm focus:outline-none text-slate-800 placeholder-slate-400 bg-transparent"
          />
        </div>
        <div className="relative flex items-center bg-white border border-slate-200 rounded-lg focus-within:border-slate-400 transition-colors">
          <MapPin className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm focus:outline-none appearance-none bg-transparent text-slate-800 cursor-pointer"
          >
            {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
          className={`px-4 py-2 text-sm font-bold border rounded-lg transition-colors whitespace-nowrap h-[42px] flex items-center justify-center gap-2 ${
            statusFilter === 'all'
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <span>{statusFilter === 'all' ? 'Hide Expired' : 'Show All (Active + Expired)'}</span>
        </button>
      </div>

      {/* Category chip strip — horizontal scroll on mobile, flex-wrap on desktop */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto sm:overflow-x-visible sm:flex-wrap no-scrollbar pb-1 -mx-1 px-1">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 py-2 text-sm font-bold border rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.slice(0, 6).map((req) => (
            <ProductListingCard
              key={req._id}
              product={req}
              onActionClick={() => {
                if (user) navigate('/product-overview?productId=' + req._id);
                else if (onOpenAuth) onOpenAuth('buyer');
                else setOpen(true);
              }}
              actionLabel={user ? 'Quote Now' : 'Sign in to Quote'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {requirements.length === 0 ? 'No live RFQs yet' : 'Nothing matches those filters'}
          </h3>
          <p className="text-sm text-slate-500 mt-1.5">
            {requirements.length === 0
              ? 'Be the first — post a requirement and suppliers will start quoting.'
              : 'Try widening your search or resetting the filters.'}
          </p>
          {requirements.length > 0 && (searchTerm || selectedLocation !== 'All locations' || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedLocation('All locations'); setSelectedCategory('All'); }}
              className="mt-4 text-sm font-bold text-slate-800 underline underline-offset-4 hover:no-underline"
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      <Authentication setOpen={setOpen} open={open} />
    </section>
  );
}
