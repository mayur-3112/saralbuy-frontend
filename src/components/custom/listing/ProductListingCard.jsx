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
  // The card receives data in different shapes depending on the source:
  //   1. Requirement object (dashboard): { buyerId: {firstName, businessName, address}, productId: {title, paymentAndDelivery, categoryId} }
  //   2. Product object (profile/listings): { userId: {firstName, businessName, address}, paymentAndDelivery: {...}, title, categoryId }
  //   3. Mock/Landing page data: { organization, location, userId: {companyName, address} }
  
  const user = product?.buyerId || product?.userId || {};
  const prod = product?.productId || product;
  
  // Buyer name: try organizationName from product, then businessName from user, then firstName+lastName
  const orgName = prod?.paymentAndDelivery?.organizationName;
  const bizName = user?.businessName || user?.companyName || product?.organization;
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null;
  const rawBuyerName = orgName || bizName || fullName || null;
  
  // Masking: "silentmesh private limited" → "*****mesh private limited"
  const maskName = (name) => {
    if (!name) return 'Buyer Name Hidden';
    const charsToMask = Math.min(5, Math.ceil(name.length / 2));
    return '*'.repeat(charsToMask) + name.slice(charsToMask);
  };
  const buyerName = maskName(rawBuyerName);

  // RFQ Code from the actual DB _id
  const productId = prod?._id || product?._id;
  const rfqCode = product?.rfqId || (productId ? `RFQ-${productId.toString().slice(-6).toUpperCase()}` : null);
  
  const country = product?.country || user?.country || 'India';
  
  // Address: try organizationAddress, then user address, then location
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

  // Product title & category
  const productTitle = prod?.title || product?.title;
  const categoryName = prod?.categoryId?.categoryName || product?.categoryId?.categoryName;

  // Product categories/items
  const items = [];
  if (prod?.isMergeQuote && prod?.products?.length > 0) {
    items.push(...prod.products.map(p => p.title || p.categoryName));
  } else if (categoryName) {
    items.push(categoryName);
  }
  if (productTitle && !items.includes(productTitle)) {
    items.unshift(productTitle);
  }

  // Timeline
  const createdAt = product?.createdAt || prod?.createdAt;
  const timeline = prod?.bidActiveDuration || prod?.timeline || product?.timeline;

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <div className="w-full bg-white rounded-xl border-2 border-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between mb-4">
        
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Title Row */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-wide">
              {buyerName}
            </h2>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            {rfqCode && (
              <span className="px-3 py-0.5 border border-gray-200 rounded-full text-xs text-gray-500 bg-white">
                RFQ Code: {rfqCode}
              </span>
            )}
            <span className="px-3 py-0.5 border border-gray-200 rounded-full text-xs text-gray-500 bg-white">
              Country: {country}
            </span>
          </div>

          {/* Items Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {items.slice(0, 4).map((item, idx) => (
              <span key={idx} className="px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-500 bg-white shadow-sm">
                {item}
              </span>
            ))}
          </div>

          {/* Address */}
          {address && (
            <div className="pt-4">
              <p className="text-[11px] text-gray-500">
                Delivery Address: <span className="text-gray-500">{address}</span>
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
            onClick={handleAction}
            className="w-28 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg py-4 shadow-md mt-6"
          >
            {actionLabel}
          </Button>
        </div>

      </div>
    </>
  );
};

export default ProductListingCard;
