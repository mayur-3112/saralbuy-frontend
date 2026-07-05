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
  const address = rawAddress;

  const productTitle = prod?.title || product?.title || 'Requirements';
  const categoryName = prod?.categoryId?.categoryName || product?.categoryId?.categoryName;
  const descriptionText = prod?.description || product?.description || productTitle;

  const items = [];
  if (prod?.items && prod.items.length > 0) {
    prod.items.forEach(item => {
      const name = item.typeOfProduct || item.subCategoryName || item.brand || item.productType;
      if (name && !items.includes(name)) items.push(name);
    });
  } else if (prod?.isUpload || prod?.document) {
    items.push("Refer to Attached Document");
  } else if (prod?.isMergeQuote && prod?.products?.length > 0) {
    items.push(...prod.products.map(p => p.title || p.categoryName));
  } else if (categoryName) {
    items.push(categoryName);
  }

  const createdAt = product?.createdAt || prod?.createdAt;
  const expiryDateStr = prod?.bidExpiryDate || product?.bidExpiryDate || prod?.timeline || product?.timeline || prod?.bidActiveDuration || product?.bidActiveDuration;

  // Safe date parsing to avoid Jan 1 2001 for numbers like "1"
  let expiryDateObj = null;
  if (expiryDateStr && isNaN(Number(expiryDateStr))) {
    expiryDateObj = new Date(expiryDateStr);
  } else if (expiryDateStr && !isNaN(Number(expiryDateStr))) {
     // it's a duration in days like "1", "3", "7"
     const days = Number(expiryDateStr);
     expiryDateObj = new Date(new Date(createdAt || Date.now()).getTime() + days * 24 * 60 * 60 * 1000);
  } else if (!expiryDateStr && createdAt) {
     // Fallback for legacy DB entries with no expiry dates: mark as expired if older than 1 day
     const days = Number(prod?.bidActiveDuration || product?.bidActiveDuration || '1');
     expiryDateObj = new Date(new Date(createdAt).getTime() + days * 24 * 60 * 60 * 1000);
  }

  const deliveryDateStr = prod?.paymentAndDelivery?.ex_deliveryDate || product?.paymentAndDelivery?.ex_deliveryDate;
  let deliveryDateObj = null;
  if (deliveryDateStr && !isNaN(new Date(deliveryDateStr).getTime())) {
    deliveryDateObj = new Date(deliveryDateStr);
  }

  // Expiry safety-net: an RFQ past its validity can't be quoted on. We disable the
  // action ONLY when it's a quote action (a "Quote"/"Sign in to Quote" label) — the
  // owner's own "View RFQ" / "Edit Draft" must still work on an expired RFQ.
  const isExpired =
    expiryDateObj && !isNaN(expiryDateObj.getTime()) && expiryDateObj.getTime() < Date.now();
  const isQuoteAction = /quote/i.test(actionLabel);
  const disableAction = isExpired && isQuoteAction;

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <div
        className="group tap-card w-full rounded-xl border border-orange-100/60 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col md:flex-row justify-between mb-4 relative overflow-hidden bg-white"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff8f4 100%)' }}
      >
        {/* Left accent bar that slides in on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-xl" />
        
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Title Row */}
            <div className="flex items-start justify-between z-10 relative">
              <h2 className="text-xl font-bold text-slate-900 capitalize tracking-wide group-hover:text-orange-800 transition-colors duration-300 line-clamp-2 pr-4">
                {productTitle}
              </h2>
              {showOwnerActions && (
                <div className="relative self-start shrink-0">
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
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(productId); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Grid of Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Buyer</span>
                <span className="text-sm font-semibold text-slate-700 line-clamp-1">{buyerName}</span>
              </div>
              {categoryName && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Category</span>
                  <span className="text-sm font-semibold text-slate-800 line-clamp-1">{categoryName}</span>
                </div>
              )}
              {rfqCode && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">RFQ ID</span>
                  <span className="text-sm font-semibold text-slate-700 line-clamp-1">{rfqCode}</span>
                </div>
              )}
              {user?.state && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">State</span>
                  <span className="text-sm font-semibold text-slate-700 line-clamp-1">{user.state}</span>
                </div>
              )}
              
              {/* Dynamic Items (if few items, fit in grid, else span below) */}
              {items.length > 0 && items.length <= 1 && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Item</span>
                  <span className="text-sm font-semibold text-slate-700 line-clamp-1">{items[0]}</span>
                </div>
              )}
            </div>

            {/* Large Items Array */}
            {items.length > 1 && (
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block mb-1.5">Requested Items</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {items.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors duration-200 cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            {address && (
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block mb-1">Delivery Address</span>
                <p className="text-sm text-slate-600 font-medium max-w-lg">
                  {address}
                </p>
              </div>
            )}

            {/* Additional Info / Description / Other Terms */}

          </div>
        </div>

        {/* Right Side */}
        <div className="mt-4 md:mt-0 flex flex-col justify-between items-start md:items-end md:w-56 shrink-0 z-10 relative border-t md:border-t-0 md:border-l border-orange-200/50 pt-4 md:pt-0 md:pl-5">
          {/* Dates Box */}
          <div className="w-full space-y-2.5 bg-white/40 p-3 rounded-lg border border-orange-100/50">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Posted</span>
              <span className="text-xs font-bold text-slate-700">
                {createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : format(new Date(), 'MMM d, yyyy')}
              </span>
            </div>
            {expiryDateObj && !isNaN(expiryDateObj.getTime()) && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Validity</span>
                {isExpired ? (
                  <span className="text-xs font-black text-red-600 flex items-center gap-1">
                    Expired
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-700">
                    {format(expiryDateObj, 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            )}
            {deliveryDateObj && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery</span>
                <span className="text-xs font-bold text-slate-700">
                  {format(deliveryDateObj, 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>

          {/* Action Button — disabled + relabelled when an expired RFQ can't be quoted */}
          <Button
            disabled={disableAction}
            onClick={(e) => { e.stopPropagation(); if (!disableAction) handleAction(); }}
            className={`w-full font-semibold rounded-lg py-4 mt-4 md:mt-6 transition-all duration-200 ${
              disableAction
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md hover:shadow-orange-300 hover:shadow-lg active:scale-95'
            }`}
          >
            {disableAction ? 'Expired — quoting closed' : actionLabel}
          </Button>
        </div>

      </div>
    </>
  );
};

export default ProductListingCard;
