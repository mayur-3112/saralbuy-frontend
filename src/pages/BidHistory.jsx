import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Gavel, Package, Lock } from 'lucide-react';
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

      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
          <Gavel className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bid History</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> {product?.title || 'Requirement'}
          </p>
        </div>
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
        <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Supplier</th>
                <th className="px-5 py-3 font-semibold">Bid Date &amp; Time</th>
                <th className="px-5 py-3 font-semibold">Deadline</th>
                <th className="px-5 py-3 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {bidActivityRes.activity.map((a, idx) => (
                <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {(a.label || '?')[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{a.label}</p>
                        {a.availableBrand && (
                          <p className="text-xs text-slate-500">{a.availableBrand} offered</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{dateFormatter(a.createdAt, 'dd MMM, hh:mm a')}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {a.earliestDeliveryDate ? dateFormatter(a.earliestDeliveryDate) : '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Hidden
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
