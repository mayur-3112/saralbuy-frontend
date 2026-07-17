import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';
import bidService from '@/services/bid.service';
import { dateFormatter } from '@/utils/dateFormatter';
import { CategoryFormSkeleton } from '@/const/CustomSkeletons';

// Bid history — the anonymized, table-style view every viewing supplier sees
// for a requirement ("universal for supplier" per the eBay Bid History
// reference the user pointed to). Never shows price or real supplier
// identity — only a stable per-supplier label, bid time, city, delivery
// date and brand offered — those stay confidential per the platform rule.
const BidHistory = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    fn: getProductById,
    data: productResponse,
    loading: productLoading,
  } = useFetch(productService.getProductById);
  const {
    fn: getBidActivityFn,
    data: bidActivityRes,
    loading: activityLoading,
  } = useFetch(bidService.getBidActivity);

  useEffect(() => {
    if (productId) {
      getProductById(productId);
      getBidActivityFn(productId);
    }
  }, [productId]);

  // getProductById returns [{ mainProduct }] (array), same as ProductOverview.
  const product = Array.isArray(productResponse) ? productResponse[0]?.mainProduct : productResponse?.mainProduct;
  const loading = productLoading || activityLoading;

  if (loading && !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CategoryFormSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/product-overview?productId=' + productId)}
        className="flex items-center gap-1 text-sm text-slate-600 hover:text-orange-600 mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to RFQ
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Bid History</h1>
        <p className="text-sm text-slate-500">{product?.title || 'Requirement'}</p>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Quotes</p>
          <p className="text-base font-bold text-slate-800">{bidActivityRes?.total ?? 0}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Suppliers</p>
          <p className="text-base font-bold text-slate-800">{bidActivityRes?.bidders ?? 0}</p>
        </div>
        {product?.bidExpiryDate && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Valid Until</p>
            <p className="text-base font-bold text-slate-800">{dateFormatter(product.bidExpiryDate)}</p>
          </div>
        )}
      </div>

      {bidActivityRes?.activity?.length > 0 ? (
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
          {bidActivityRes.activity.map((a, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 px-5 py-4">
              <span className="font-semibold text-slate-800">{a.label}</span>
              <span className="text-sm text-slate-500">{dateFormatter(a.createdAt, 'dd MMM, hh:mm a')}</span>
              <span className="text-sm text-slate-500">
                {a.earliestDeliveryDate
                  ? 'Delivery by ' + dateFormatter(a.earliestDeliveryDate)
                  : a.location || '—'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-orange-700">No quotes have been submitted yet.</p>
        </div>
      )}
    </div>
  );
};

export default BidHistory;
