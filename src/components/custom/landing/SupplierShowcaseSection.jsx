import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/user.service';
import categoryService from '@/services/category.service';
import VerifiedBadge from '@/components/custom/VerifiedBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, ArrowRight, ShieldCheck, Store, ChevronRight } from 'lucide-react';
import { mergeName } from '@/utils/mergerName';

const resolveImageUrl = (img) => {
  if (!img || typeof img !== 'string') return undefined;
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
    return img;
  }
  return undefined;
};

const SupplierShowcaseSection = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(res => {
        const list = Array.isArray(res) ? res : res?.categories || [];
        setCategories(list);
      })
      .catch(err => console.error('Failed to load categories for showcase', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    userService
      .getShowcaseSuppliers(activeCategory)
      .then(res => {
        const list = Array.isArray(res) ? res : [];
        setSuppliers(list);
      })
      .catch(err => {
        console.error('Failed to load showcase suppliers', err);
        setSuppliers([]);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="w-full bg-slate-900 py-12 sm:py-16 text-white my-8 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Store className="w-3.5 h-3.5" /> Verified Supplier Directory
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Onboarded Supplier Showcase
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
              Discover verified B2B suppliers, manufacturers, and authorized distributors with pan-India supply capability.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full shrink-0 self-start md:self-auto">
            Fair &amp; Unbiased Exposure
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
            }`}
          >
            All Suppliers
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat._id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Supplier Directory Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-700 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-6 bg-slate-700 rounded-full w-2/3" />
                <div className="h-10 bg-slate-700 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            <Store className="w-10 h-10 mx-auto mb-3 text-slate-500" />
            <p className="text-sm font-semibold">No suppliers currently listed in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {suppliers.map(s => {
              const fullName = mergeName(s) || 'Verified Supplier';
              const companyName = s.businessName || s.organizationName;
              const location = (s.currentLocation || s.address || '').split(',')[0].trim();
              const primaryCatName = s.primaryCategoryId?.categoryName || s.supplierCategories?.split(',')[0] || null;
              const secondaryCats = Array.isArray(s.secondaryCategoryIds)
                ? s.secondaryCategoryIds.map(c => typeof c === 'object' ? c.categoryName : c)
                : (s.supplierCategories ? s.supplierCategories.split(',').slice(1, 3) : []);

              return (
                <div
                  key={s._id}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-orange-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-lg hover:shadow-orange-500/10"
                >
                  <div>
                    {/* Header: Avatar, Name & Verification */}
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <Avatar className="h-14 w-14 border-2 border-slate-700 group-hover:border-orange-500 shrink-0 rounded-full overflow-hidden bg-slate-700">
                        <AvatarImage src={resolveImageUrl(s.profileImage)} alt={fullName} className="object-cover w-full h-full rounded-full" />
                        <AvatarFallback className="bg-orange-600 text-white font-black text-sm flex items-center justify-center w-full h-full">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-white text-base truncate group-hover:text-orange-400 transition-colors">
                            {fullName}
                          </h3>
                          <VerifiedBadge status={s.verificationStatus} size="sm" />
                        </div>
                        {companyName && (
                          <p className="text-xs text-slate-400 font-medium truncate mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            {companyName}
                          </p>
                        )}
                        {location && (
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                            {location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Headline / Tagline */}
                    {s.supplierHeadline ? (
                      <p className="text-xs text-slate-300 mb-3 line-clamp-2 italic font-sans">
                        "{s.supplierHeadline}"
                      </p>
                    ) : s.businessDescription ? (
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                        {s.businessDescription}
                      </p>
                    ) : null}

                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {primaryCatName && (
                        <span className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[11px] font-bold">
                          Primary: {primaryCatName}
                        </span>
                      )}
                      {secondaryCats.map((catName, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 rounded-full bg-slate-700/80 border border-slate-600/50 text-slate-300 text-[10px] font-medium">
                          {catName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Profile Action Button */}
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md group-hover:shadow-orange-500/25"
                    onClick={() => navigate(`/user-profile/${s._id}`)}
                  >
                    View Supplier Profile <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SupplierShowcaseSection;
