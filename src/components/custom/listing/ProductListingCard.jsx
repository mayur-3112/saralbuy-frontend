import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Authentication from '../auth/Authenticate';

const ProductListingCard = ({ product, onActionClick, actionLabel = 'View RFQ' }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick(product);
    } else {
      const navId = product?.productId?._id || product?._id || '';
      return navigate('/product-overview?productId=' + navId);
    }
  };

  // === DATA EXTRACTION ===
  const user = product?.buyerId || product?.userId || {};
  const prod = product?.productId || product;
  
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
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-wide group-hover:text-orange-800 transition-colors duration-300">
              {buyerName}
            </h2>
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
        <div className="mt-4 md:mt-0 flex flex-col justify-between items-end md:w-64 shrink-0">
          {/* Dates */}
          <div className="text-right space-y-1">
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
            className="w-28 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg py-4 shadow-md mt-6 hover:shadow-orange-300 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            {actionLabel}
          </Button>
        </div>

      </div>
    </>
  );
};

export default ProductListingCard;
