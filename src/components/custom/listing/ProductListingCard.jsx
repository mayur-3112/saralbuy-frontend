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
      return navigate('/product-overview?productId=' + (product?._id || ''));
    }
  };

  // Helper to generate a consistent masked company name
  const buyerName = product?.userId?.companyName || product?.organization || (product?.userId?.firstName ? `${product?.userId?.firstName} ${product?.userId?.lastName || ''}` : 'Undisclosed Buyer');
  const rfqCode = product?.rfqId || `EP#${product?._id?.substring(product._id.length - 4) || '5057'}`;
  const country = product?.country || product?.userId?.country || 'India';
  const currency = product?.currency || 'INR';
  const address = product?.deliveryLocation || product?.location || product?.userId?.address || 'Location not specified';

  // Product categories/items
  const items = [];
  if (product?.isMergeQuote && product?.products?.length > 0) {
    items.push(...product.products.map(p => p.title || p.categoryName));
  } else if (product?.categoryId?.categoryName) {
    items.push(product.categoryId.categoryName);
  } else {
    items.push(product?.title || 'Fasteners');
  }

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <div className="w-full bg-white rounded-xl border-2 border-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between mb-4">
        
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          {/* Title Row */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              ********** {buyerName}
            </h2>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 border border-gray-200 rounded-full text-xs text-gray-500 bg-white">
              RFQ Code: {rfqCode}
            </span>
            <span className="px-3 py-0.5 border border-gray-200 rounded-full text-xs text-gray-500 bg-white">
              Country: {country}
            </span>
            <span className="px-3 py-0.5 border border-gray-200 rounded-full text-xs text-gray-500 bg-white">
              Quote in: {currency}
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
          <div className="pt-4">
            <p className="text-[11px] text-gray-500">
              Delivery Address: <span className="text-gray-500">{address.length > 40 ? address.substring(0, 40) + '...' : address}</span>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="mt-4 md:mt-0 flex flex-col justify-between items-end md:w-64 shrink-0">
          {/* Dates */}
          <div className="text-right space-y-1">
            <p className="text-[11px] text-gray-400">
              Posted <span className="font-bold text-gray-600 ml-1">
                {format(new Date(product?.createdAt || Date.now()), 'MMM d, yyyy')}
              </span>
            </p>
            <p className="text-[11px] text-gray-400">
              Last Submission <span className="font-bold text-gray-600 ml-1">
                {format(new Date(product?.timeline || Date.now() + 86400000 * 7), 'MMM d, yyyy')}
              </span>
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleAction}
            className="w-28 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg py-4 shadow-md mt-6"
          >
            {actionLabel}
          </Button>
        </div>

      </div>
    </>
  );
};

export default ProductListingCard;
