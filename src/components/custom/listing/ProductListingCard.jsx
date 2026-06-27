import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Authentication from '../auth/Authenticate';

import { MoreVertical, Edit, Trash2 } from 'lucide-react';

const ProductListingCard = ({ product, onActionClick, actionLabel = 'View RFQ', showOwnerActions = false, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick(product);
    } else {
      const prod = product?.productId || product?.product || product;
      const navId = prod?._id || '';
      return navigate('/product-overview?productId=' + navId);
    }
  };

  // === DATA EXTRACTION ===
  const user = product?.buyerId || product?.userId || product?.buyer || {};
  const prod = product?.productId || product?.product || product;
  
  const orgName = prod?.paymentAndDelivery?.organizationName;
  const bizName = user?.businessName || user?.companyName || product?.organization;
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null;
  const rawBuyerName = orgName || bizName || fullName || null;
  
  const maskName = (name) => {
    if (!name) return 'Buyer Name Hidden';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      if (name.length <= 1) return name;
      return name[0] + '*'.repeat(name.length - 1);
    }
    const first = parts[0];
    const last = parts[parts.length - 1];
    return first[0] + '*'.repeat(first.length - 1) + ' ' + last[0] + '*'.repeat(last.length - 1);
  };
  const buyerName = maskName(rawBuyerName);

  const productId = prod?._id || product?._id;
  const rfqCode = product?.rfqId || (productId ? `RFQ-${productId.toString().slice(-6).toUpperCase()}` : null);
  
  const country = product?.country || user?.country || 'India';
  
  const rawAddress = prod?.paymentAndDelivery?.organizationAddress || user?.address || product?.location || null;
  const maskAddress = (addr) => {
    if (!addr) return null;
    const parts = addr.split(',');
    if (parts.length > 1) {
      return `******, ${parts[parts.length - 1].trim()}`;
    }
    const charsToMask = Math.min(8, Math.ceil(addr.length / 2));
    return '*'.repeat(charsToMask) + addr.slice(charsToMask);
  };
  const address = maskAddress(rawAddress);

  const productTitle = prod?.title || product?.title || 'Requirements';
  const categoryName = prod?.categoryId?.categoryName || product?.categoryId?.categoryName;
  const descriptionText = prod?.description || product?.description || productTitle;

  const items = [];
  if (prod?.items && prod.items.length > 0) {
    prod.items.forEach(item => {
      const name = item.typeOfProduct || item.subCategoryName || item.brand || item.productType;
      if (name && !items.includes(name)) items.push(name);
    });
  } else if (prod?.isMergeQuote && prod?.products?.length > 0) {
    items.push(...prod.products.map(p => p.title || p.categoryName));
  } else if (categoryName) {
    items.push(categoryName);
  }

  const createdAt = product?.createdAt || prod?.createdAt;
  const expiryDateStr = prod?.bidExpiryDate || product?.bidExpiryDate || prod?.timeline || product?.timeline;
  
  // Safe date parsing to avoid Jan 1 2001 for numbers like "1"
  let expiryDateObj = null;
  if (expiryDateStr && isNaN(Number(expiryDateStr))) {
    expiryDateObj = new Date(expiryDateStr);
  } else if (expiryDateStr && !isNaN(Number(expiryDateStr))) {
     // it's a duration in days like "1", "3", "7"
     const days = Number(expiryDateStr);
     expiryDateObj = new Date(new Date(createdAt || Date.now()).getTime() + days * 24 * 60 * 60 * 1000);
  }

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <div 
        className="group w-full rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 ease-out flex flex-col md:flex-row justify-between mb-5 relative overflow-hidden bg-white"
      >
        {/* Animated Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl pointer-events-none" />
        
        {/* Left accent bar that slides in on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-orange-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out origin-top rounded-l-2xl" />
        
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Title Row - Description Prominent */}
          <div className="flex items-center justify-between z-10 relative">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[22px] font-extrabold text-slate-800 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-500 line-clamp-2 leading-tight">
                {descriptionText}
              </h2>
              <h3 className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shadow-sm">{buyerName}</span> 
                {categoryName && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-[13px] font-bold text-orange-600 uppercase tracking-wider">{categoryName}</span>
                  </>
                )}
              </h3>
            </div>
            {showOwnerActions && (
              <div className="relative self-start">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <MoreVertical size={20} />
                </button>
                {showMenu && (
                  <div 
                    className="absolute right-0 top-8 w-36 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(product); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Edit size={16} /> Edit RFQ
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(productId); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-100"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-2.5 mt-2">
            {rfqCode && (
              <span className="px-3.5 py-1 border border-orange-200/60 rounded-full text-[11px] font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-all duration-300 shadow-sm cursor-default flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                {rfqCode}
              </span>
            )}
            {user?.state && (
              <span className="px-3 py-1 border border-slate-200/60 rounded-full text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all duration-300 shadow-sm cursor-default">
                📍 {user.state}
              </span>
            )}
          </div>

          {/* Items Row as Badges */}
          {items.length > 0 && (
             <div className="flex flex-wrap items-center gap-2 pt-2">
               {items.map((item, idx) => (
                 <span 
                   key={idx} 
                   className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-[12px] font-medium text-slate-600 shadow-sm hover:shadow hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 cursor-default"
                 >
                   {item}
                 </span>
               ))}
             </div>
          )}

          {/* Address */}
          {address && (
            <div className="pt-4">
              <p className="text-[11px] text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                Delivery Address: <span>{address}</span>
              </p>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="mt-5 md:mt-0 flex flex-col justify-between items-start md:items-end md:w-64 shrink-0 z-10 relative">
          {/* Dates */}
          <div className="text-left md:text-right space-y-1.5 bg-slate-50/80 p-3 rounded-lg border border-slate-100 w-full md:w-auto">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex justify-between md:justify-end gap-3">
              <span>Posted:</span> 
              <span className="font-bold text-slate-700">
                {createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : format(new Date(), 'MMM d, yyyy')}
              </span>
            </p>
            {expiryDateObj && !isNaN(expiryDateObj.getTime()) && (
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex justify-between md:justify-end gap-3">
                <span>Deadline:</span> 
                <span className="font-bold text-red-500">
                  {format(expiryDateObj, 'MMM d, yyyy')}
                </span>
              </p>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={(e) => { e.stopPropagation(); handleAction(); }}
            className="w-full md:w-auto px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl py-5 shadow-lg mt-4 md:mt-6 hover:shadow-orange-500/30 hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300"
          >
            {actionLabel}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>

      </div>
    </>
  );
};

export default ProductListingCard;
