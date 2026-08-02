import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/user.service';
import categoryService from '@/services/category.service';
import VerifiedBadge from '@/components/custom/VerifiedBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Building2,
  MapPin,
  Search,
  Store,
  ChevronRight,
  ShieldCheck,
  Award,
  Globe,
  Phone,
  Tag,
  Briefcase,
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

export default function SupplierDirectory() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(res => {
        const list = Array.isArray(res) ? res : res?.categories || [];
        setCategories(list);
      })
      .catch(err => console.error('Failed to load categories for supplier directory', err));
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
        console.error('Failed to load supplier directory', err);
        setSuppliers([]);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filteredSuppliers = suppliers.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = (s.businessName || s.organizationName || mergeName(s) || '').toLowerCase();
    const headline = (s.supplierHeadline || '').toLowerCase();
    const location = (s.currentLocation || s.address || '').toLowerCase();
    const brands = (Array.isArray(s.topBrands) ? s.topBrands.join(' ') : '').toLowerCase();
    return name.includes(q) || headline.includes(q) || location.includes(q) || brands.includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Store className="w-3.5 h-3.5" /> Supplier Directory
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Verified B2B Suppliers & Distributors
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
            Browse verified manufacturers, stockists, and wholesalers. View detailed credentials, brand authorizations, and request quotes directly.
          </p>

          {/* Search bar & Category filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search suppliers by name, brand, location, or headline..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-orange-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat._id
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Directory Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Showing <span className="text-slate-900">{filteredSuppliers.length}</span> verified supplier profiles
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <Card className="p-12 text-center bg-white border-slate-200 rounded-2xl">
            <Store className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No suppliers found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your category filter or search terms.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSuppliers.map(s => {
              const fullName = mergeName(s) || 'Verified Supplier';
              const companyName = s.businessName || s.organizationName;
              const location = s.currentLocation || s.storeAddress || s.address;
              const primaryCatName = s.primaryCategoryId?.categoryName || s.supplierCategories?.split(',')[0] || null;
              const secondaryCats = Array.isArray(s.secondaryCategoryIds)
                ? s.secondaryCategoryIds.map(c => c?.categoryName || c).filter(Boolean)
                : [];
              const brands = Array.isArray(s.topBrands) ? s.topBrands.filter(Boolean) : [];
              const currentYear = new Date().getFullYear();
              const yearsInBusiness = s.businessSince ? currentYear - Number(s.businessSince) : null;
              const isVerified = s.verificationStatus === 'verified';

              return (
                <Card
                  key={s._id}
                  className={`p-5 sm:p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                    isVerified ? 'border-emerald-500/40 hover:border-emerald-500' : 'border-slate-200 hover:border-orange-400'
                  }`}
                  onClick={() => navigate(`/user-profile/${s._id}`)}
                >
                  {/* Rectangular RFQ-like Card Layout */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Avatar className={`h-16 w-16 border-2 shrink-0 rounded-full overflow-hidden bg-slate-100 ${
                        isVerified ? 'border-emerald-500' : 'border-slate-300'
                      }`}>
                        <AvatarImage src={resolveImageUrl(s.profileImage)} alt={fullName} className="object-cover w-full h-full" />
                        <AvatarFallback className="bg-orange-600 text-white font-black text-base flex items-center justify-center w-full h-full">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                            {companyName || fullName}
                          </h2>
                          <VerifiedBadge status={s.verificationStatus} size="sm" />
                          {primaryCatName && (
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                              {primaryCatName}
                            </span>
                          )}
                        </div>

                        {s.supplierHeadline ? (
                          <p className="text-xs font-medium text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {s.supplierHeadline}
                          </p>
                        ) : s.businessDescription ? (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {s.businessDescription}
                          </p>
                        ) : null}

                        {/* Details Badges row */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
                          {location && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-orange-500" />
                              {location}
                            </span>
                          )}
                          {yearsInBusiness != null && yearsInBusiness >= 0 && (
                            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              Est. {s.businessSince} ({yearsInBusiness}+ Yrs Experience)
                            </span>
                          )}
                          {s.roleInCompany && (
                            <span className="flex items-center gap-1 text-slate-600">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              {s.roleInCompany} ({fullName})
                            </span>
                          )}
                        </div>

                        {/* Brands Tag Pills */}
                        {brands.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Brands:</span>
                            {brands.map((brand, bIdx) => (
                              <span
                                key={bIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                              >
                                {brand}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs h-10 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full lg:w-auto"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/user-profile/${s._id}`);
                        }}
                      >
                        View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
