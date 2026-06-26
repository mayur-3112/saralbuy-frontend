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
    const charsToMask = Math.min(5, Math.ceil(name.length / 2));
    return '*'.repeat(charsToMask) + name.slice(charsToMask);
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

  const productTitle = prod?.title || product?.title;
  const categoryName = prod?.categoryId?.categoryName || product?.categoryId?.categoryName;

  const items = [];
  if (prod?.isMergeQuote && prod?.products?.length > 0) {
    items.push(...prod.products.map(p => p.title || p.categoryName));
  } else if (categoryName) {
    items.push(categoryName);
  }
  if (productTitle && !items.includes(productTitle)) {
    items.unshift(productTitle);
  }

  const createdAt = product?.createdAt || prod?.createdAt;
  const timeline = prod?.bidActiveDuration || prod?.timeline || product?.timeline;

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <div 
        className="group w-full rounded-xl border border-orange-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col md:flex-row justify-between mb-4 relative overflow-hidden cursor-pointer"
        style={{background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #ffedd5 100%)'}}
        onClick={handleAction}
      >
        {/* Left accent bar that slides in on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-xl" />
        
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-wide group-hover:text-orange-800 transition-colors duration-300">
                {buyerName}
              </h2>
            </div>
            {showOwnerActions && (
              <div className="relative">
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
          <div className="flex flex-wrap items-center gap-2">
            {rfqCode && (
              <span className="px-3 py-0.5 border border-orange-200 rounded-full text-xs text-orange-700 bg-white/70 hover:bg-orange-100 hover:border-orange-300 hover:scale-105 transition-all duration-200 cursor-default">
                RFQ Code: {rfqCode}
              </span>
            )}
            <span className="px-3 py-0.5 border border-orange-200 rounded-full text-xs text-orange-700 bg-white/70 hover:bg-orange-100 hover:border-orange-300 hover:scale-105 transition-all duration-200 cursor-default">
              Country: {country}
            </span>
          </div>

          {/* Items Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {items.slice(0, 4).map((item, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 border border-orange-200 rounded-full text-xs text-slate-600 bg-white/70 shadow-sm hover:bg-white hover:shadow-md hover:scale-105 hover:border-orange-300 transition-all duration-200 cursor-default"
              >
                {item}
              </span>
            ))}
          </div>

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
        <div className="mt-4 md:mt-0 flex flex-col justify-between items-start md:items-end md:w-64 shrink-0">
          {/* Dates */}
          <div className="text-left md:text-right space-y-1">
            <p className="text-[11px] text-gray-400">
              Posted <span className="font-medium text-gray-600 ml-1">
                {format(new Date(createdAt || Date.now()), 'MMM d, yyyy')}
              </span>
            </p>
            {timeline && (
              <p className="text-[11px] text-gray-400">
                Last Submission <span className="font-medium text-gray-600 ml-1">
                  {format(new Date(timeline), 'MMM d, yyyy')}
                </span>
              </p>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={(e) => { e.stopPropagation(); handleAction(); }}
            className="w-full md:w-28 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg py-4 shadow-md mt-4 md:mt-6 hover:shadow-orange-300 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            {actionLabel}
          </Button>
        </div>

      </div>
    </>
  );
};

export default ProductListingCard;
