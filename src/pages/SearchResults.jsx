import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import userService from '@/services/user.service';
import VerifiedBadge from '@/components/custom/VerifiedBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import {
  Search,
  Building2,
  MapPin,
  Box,
  Tag,
  Layers,
  FileText,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { mergeName } from '@/utils/mergerName';

const resolveImageUrl = (img) => {
  if (!img || typeof img !== 'string') return undefined;
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
    return img;
  }
  return undefined;
};

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || searchParams.get('title') || '';
  const categoryParam = searchParams.get('category') || '';
  const locationParam = searchParams.get('location') || '';
  const activeTab = searchParams.get('tab') || 'all';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    categories: [],
    suppliers: [],
    products: [],
    rfqs: [],
    brands: [],
  });

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      setResults({ categories: [], suppliers: [], products: [], rfqs: [], brands: [] });
      return;
    }

    setLoading(true);
    userService
      .getUniversalSearch({
        q: query,
        category: categoryParam,
        location: locationParam,
        limit: 20,
      })
      .then(res => {
        if (res) {
          setResults({
            categories: Array.isArray(res.categories) ? res.categories : [],
            suppliers: Array.isArray(res.suppliers) ? res.suppliers : [],
            products: Array.isArray(res.products) ? res.products : [],
            rfqs: Array.isArray(res.rfqs) ? res.rfqs : [],
            brands: Array.isArray(res.brands) ? res.brands : [],
          });
        }
      })
      .catch(err => {
        console.error('Universal Search Error:', err);
      })
      .finally(() => setLoading(false));
  }, [query, categoryParam, locationParam]);

  const totalResultsCount =
    results.categories.length +
    results.suppliers.length +
    results.products.length +
    results.rfqs.length +
    results.brands.length;

  const handleTabChange = tabKey => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabKey);
    setSearchParams(newParams);
  };

  const tabs = [
    { key: 'all', label: 'All Results', count: totalResultsCount },
    { key: 'categories', label: 'Categories', count: results.categories.length },
    { key: 'suppliers', label: 'Suppliers', count: results.suppliers.length },
    { key: 'products', label: 'Products', count: results.products.length },
    { key: 'rfqs', label: 'RFQs', count: results.rfqs.length },
    { key: 'brands', label: 'Brands', count: results.brands.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Search className="w-3.5 h-3.5" /> Universal Search Results
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Search Results for &ldquo;<span className="text-orange-400">{query || 'All'}</span>&rdquo;
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Found {totalResultsCount} matching results across SaralBuy exchange
                {locationParam ? ` in ${locationParam}` : ''}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === tab.key ? 'bg-orange-700 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-20 text-center">
            <Loader className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Searching SaralBuy exchange...</p>
          </div>
        ) : totalResultsCount === 0 ? (
          <Card className="p-12 text-center bg-white border-slate-200 shadow-sm max-w-xl mx-auto rounded-2xl">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching results found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Try adjusting your query or location filter to find what you are looking for.
            </p>
            <Button
              onClick={() => navigate('/product-listing')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
            >
              Browse All Requirements
            </Button>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* 1. SUPPLIERS SECTION */}
            {(activeTab === 'all' || activeTab === 'suppliers') && results.suppliers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    Suppliers ({results.suppliers.length})
                  </h2>
                  {activeTab === 'all' && (
                    <button
                      onClick={() => handleTabChange('suppliers')}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      View all suppliers <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.suppliers.map(s => {
                    const fullName = mergeName(s) || 'Verified Supplier';
                    const companyName = s.businessName || s.organizationName;
                    const location = (s.currentLocation || s.address || '').split(',')[0].trim();
                    const primaryCatName = s.primaryCategoryId?.categoryName || s.supplierCategories?.split(',')[0] || null;
                    const brands = Array.isArray(s.topBrands) ? s.topBrands.filter(Boolean).slice(0, 3) : [];
                    const currentYear = new Date().getFullYear();
                    const yearsInBusiness = s.businessSince ? currentYear - Number(s.businessSince) : null;
                    const isVerified = s.verificationStatus === 'verified';

                    return (
                      <div
                        key={s._id}
                        className={`bg-white border rounded-2xl p-5 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all ${
                          isVerified ? 'border-emerald-200' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="h-12 w-12 border border-slate-200 shrink-0 rounded-full overflow-hidden bg-slate-100">
                              <AvatarImage src={resolveImageUrl(s.profileImage)} alt={fullName} className="object-cover w-full h-full" />
                              <AvatarFallback className="bg-orange-600 text-white font-black text-xs flex items-center justify-center w-full h-full">
                                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 flex-wrap">
                                <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-orange-600 transition-colors">
                                  {companyName || fullName}
                                </h3>
                                <VerifiedBadge status={s.verificationStatus} size="sm" />
                              </div>
                              {location && (
                                <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1 font-medium">
                                  <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                                  {location}
                                </p>
                              )}
                              {yearsInBusiness != null && yearsInBusiness >= 0 && (
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                  Est. {s.businessSince} &bull; {yearsInBusiness}+ Yrs
                                </p>
                              )}
                            </div>
                          </div>

                          {primaryCatName && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold mb-3">
                              {primaryCatName}
                            </span>
                          )}

                          {brands.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {brands.map((b, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs h-8 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          onClick={() => navigate(`/user-profile/${s._id}`)}
                        >
                          View Profile <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. RFQs SECTION */}
            {(activeTab === 'all' || activeTab === 'rfqs') && results.rfqs.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Buyer RFQs ({results.rfqs.length})
                  </h2>
                  {activeTab === 'all' && (
                    <button
                      onClick={() => handleTabChange('rfqs')}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      View all RFQs <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.rfqs.map(rfq => (
                    <Card
                      key={rfq._id}
                      className="p-5 bg-white border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {rfq.title}
                          </h3>
                          {rfq.categoryId?.categoryName && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {rfq.categoryId.categoryName}
                            </span>
                          )}
                        </div>
                        {rfq.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                            {rfq.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 flex-wrap">
                          {rfq.quantity && (
                            <span className="font-bold text-slate-800">
                              Qty: {rfq.quantity}
                            </span>
                          )}
                          {rfq.minimumBudget && (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              ₹{rfq.minimumBudget.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        onClick={() => navigate(`/product-listing?_id=${rfq._id}&title=${encodeURIComponent(rfq.title)}`)}
                      >
                        Submit Quote <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* 3. PRODUCTS SECTION */}
            {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-orange-600" />
                    Products ({results.products.length})
                  </h2>
                  {activeTab === 'all' && (
                    <button
                      onClick={() => handleTabChange('products')}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      View all products <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.products.map(p => (
                    <Card
                      key={p._id}
                      className="p-4 bg-white border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                      onClick={() => navigate(`/product-listing?_id=${p._id}&title=${encodeURIComponent(p.title)}`)}
                    >
                      <div>
                        <div className="aspect-video w-full bg-slate-50 rounded-xl overflow-hidden mb-3 border border-slate-100 flex items-center justify-center">
                          <img
                            src={p.image || '/no-image.webp'}
                            alt={p.title}
                            className="w-full h-full object-contain mix-blend-darken p-2"
                          />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {p.title}
                        </h3>
                        {p.brandName || p.brand ? (
                          <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                            Brand: {p.brandName || p.brand}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-orange-600">View Listing</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* 4. CATEGORIES SECTION */}
            {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-orange-600" />
                    Categories ({results.categories.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {results.categories.map(c => (
                    <button
                      key={c._id}
                      onClick={() => navigate(`/product-listing?category=${c._id}`)}
                      className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:shadow-sm text-left transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-bold">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                          {c.categoryName}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* 5. BRANDS SECTION */}
            {(activeTab === 'all' || activeTab === 'brands') && results.brands.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-orange-600" />
                    Brands ({results.brands.length})
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.brands.map((b, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTabChange('all')}
                      className="px-4 py-2 bg-white border border-slate-200 hover:border-orange-500 rounded-xl text-xs font-bold text-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      {b.name}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
