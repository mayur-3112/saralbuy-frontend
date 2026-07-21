// Responsive-only improvements applied
// Functionality unchanged

import TableListing from '@/components/custom/TableListing';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { dateFormatter } from '@/utils/dateFormatter';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Banknote, CalendarDays, Eye, MoveLeft, Truck, CreditCard, MapPin, Percent, Store, FileText, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import requirementService from '@/services/requirement.service';
import { resolveDocuments } from '@/utils/resolveDocuments';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CategoryFormSkeleton } from '@/const/CustomSkeletons';
import { currencyConvertor } from '@/utils/currencyConvertor';
import bidService from '@/services/bid.service';
import TooltipComp from '@/lib/TooltipComp';
import { useFetch } from '@/hooks/useFetch';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Loader from '@/components/custom/Loader';

const separateName = name => {
  if (!name) return '';
  const parts = name.split('_');
  if (parts.length === 1) return name;
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  accepted: 'bg-green-100 text-green-700',
  shortlisted: 'bg-orange-100 text-orange-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-slate-100 text-slate-600',
};

const TermCard = ({ icon: Icon, label, value, mono, cap, accent = 'slate' }) => {
  const accents = {
    slate: 'bg-slate-100 text-slate-500',
    orange: 'bg-orange-100 text-orange-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    violet: 'bg-violet-100 text-violet-600',
  };
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${accents[accent]}`}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-sm font-semibold text-slate-800 break-words leading-tight mt-0.5 ${mono ? 'font-mono' : ''} ${cap ? 'capitalize' : ''}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
};

const QuoteDetailsDialog = ({ open, onOpenChange, quoteDetails }) => {
  const q = quoteDetails || {};
  const docs = resolveDocuments(q.quoteDocument);
  const statusKey = (q.status || q.quoteStatus || '').toLowerCase();
  const sellerName = q.sellerId
    ? `${q.sellerId.firstName || ''} ${q.sellerId.lastName || ''}`.trim()
    : q.businessDets?.company_name || '';
  const initials = (sellerName || 'S').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 border-none">
        {/* Header band with seller identity + amount */}
        <DialogHeader className="p-0 space-y-0 text-left">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-5 pb-6">
            <DialogTitle className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Seller Quotation</DialogTitle>
            <DialogDescription className="sr-only">A read-only summary of this seller's quotation.</DialogDescription>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-11 h-11 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-sm shrink-0">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-white font-bold text-lg leading-tight truncate">{sellerName || 'Seller'}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {q.businessType === 'business' && (
                    <span className="inline-flex items-center gap-1 text-emerald-300 text-xs font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" /> Business
                    </span>
                  )}
                  {q.createdAt && (
                    <span className="text-white/50 text-xs">Quoted {dateFormatter(q.createdAt)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Amount card overlapping the band */}
          <div className="px-5 -mt-4">
            <div className="rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quoted Price</p>
                <p className="text-2xl font-black text-orange-600 leading-tight">
                  {q.budgetQuation ? currencyConvertor(q.budgetQuation) : '—'}
                </p>
              </div>
              {statusKey && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[statusKey] || 'bg-slate-100 text-slate-600'}`}>
                  {q.status || q.quoteStatus}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[62vh] overflow-y-auto p-5 space-y-4">
          {/* Term cards */}
          <div className="grid grid-cols-2 gap-3">
            <TermCard icon={Store} label="Seller Type" value={separateName(q.sellerType)} cap accent="violet" />
            <TermCard icon={Percent} label="Taxes" value={q.taxes ? `${q.taxes}% GST` : null} accent="orange" />
            <TermCard icon={CreditCard} label="Payment" value={separateName(q.paymentTerms)} cap accent="emerald" />
            <TermCard icon={Truck} label="Freight" value={separateName(q.freightTerms)} cap accent="blue" />
            <TermCard icon={CalendarDays} label="Delivery" value={q.earliestDeliveryDate ? dateFormatter(q.earliestDeliveryDate) : null} accent="orange" />
            <TermCard icon={MapPin} label="Location" value={q.location} cap accent="slate" />
          </div>

          {/* Business */}
          {q.businessType === 'business' && (q.businessDets?.company_name || q.businessDets?.gst_num) && (
            <div className="grid grid-cols-2 gap-3">
              <TermCard icon={Store} label="Company" value={q.businessDets?.company_name} cap accent="slate" />
              <TermCard icon={BadgeCheck} label="GST Number" value={q.businessDets?.gst_num} mono accent="emerald" />
            </div>
          )}

          {/* Documents */}
          {docs.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Quotation Document</p>
              <div className="flex flex-wrap gap-2">
                {docs.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> Document {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {q.buyerNote && q.buyerNote.trim() && q.buyerNote.trim() !== '-' && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Seller's Note</p>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100 whitespace-pre-line">
                {q.buyerNote}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// SB-008: side-by-side comparison of all quotes on a requirement
const QuoteCompareDialog = ({ open, onOpenChange, productId }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setLoading(true);
    bidService
      .getBidsForCompare(productId)
      .then(data => setBids(Array.isArray(data) ? data : []))
      .catch(() => setBids([]))
      .finally(() => setLoading(false));
  }, [open, productId]);

  const lowest = bids.length ? Math.min(...bids.map(b => b.budgetQuation || Infinity)) : null;

  const rows = [
    { label: 'Quoted Price', render: b => (
      <span className={b.budgetQuation === lowest ? 'font-extrabold text-green-600' : 'font-semibold text-slate-800'}>
        {currencyConvertor(b.budgetQuation)}{b.budgetQuation === lowest ? ' ▼' : ''}
      </span>
    ) },
    { label: 'Seller Type', render: b => separateName(b.sellerType) || '-' },
    { label: 'Delivery', render: b => (b.earliestDeliveryDate ? dateFormatter(b.earliestDeliveryDate) : '-') },
    { label: 'Payment Terms', render: b => separateName(b.paymentTerms) || '-' },
    { label: 'Freight Terms', render: b => separateName(b.freightTerms) || '-' },
    { label: 'Taxes', render: b => (b.taxes ? `${b.taxes}` : '-') },
    { label: 'Location', render: b => b.location || b.sellerId?.currentLocation || b.sellerId?.address || '-' },
    { label: 'Status', render: b => <span className="capitalize">{b.quoteStatus || 'pending'}</span> },
    { label: 'Quote Doc', render: b => {
      const docs = resolveDocuments(b.quoteDocument);
      return docs.length ? (
        <a href={docs[0]} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">View</a>
      ) : '-';
    } },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[92vw] lg:max-w-[80vw] max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold">Compare Quotes</DialogTitle>
          <DialogDescription>Side-by-side comparison of all quotes received. Lowest price is highlighted.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">Loading quotes…</div>
        ) : bids.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No quotes to compare yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 sticky left-0 bg-white z-10 text-xs font-bold uppercase text-slate-400">Attribute</th>
                  {bids.map((b, i) => (
                    <th key={i} className="px-3 py-2 min-w-[150px] font-bold text-slate-700">
                      {`${b.sellerId?.firstName || 'Seller'} ${b.sellerId?.lastName || ''}`.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r, ri) => (
                  <tr key={ri} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 sticky left-0 bg-white z-10 text-xs font-semibold text-slate-500 uppercase tracking-wide">{r.label}</td>
                    {bids.map((b, i) => (
                      <td key={i} className="px-3 py-2.5 text-slate-700">{r.render(b)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// SB-013: activity timeline for the requirement
const TIMELINE_ICONS = {
  requirement_posted: '📝',
  quote_placed: '💬',
  shortlisted: '⭐',
  accepted: '✅',
  deal_proposed: '🤝',
  deal_completed: '🎉',
  deal_rejected: '❌',
};

const DealTimelineDialog = ({ open, onOpenChange, productId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setLoading(true);
    bidService
      .getRequirementTimeline(productId)
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [open, productId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold">Deal Activity Timeline</DialogTitle>
          <DialogDescription>Every step from posting to closure, logged in order.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">Loading timeline…</div>
        ) : events.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No activity yet.</div>
        ) : (
          <ol className="relative border-l border-slate-200 ml-3 mt-2 space-y-5">
            {events.map((e, i) => (
              <li key={i} className="ml-5">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-orange-50 rounded-full ring-4 ring-white text-sm">
                  {TIMELINE_ICONS[e.type] || '•'}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{e.label}</span>
                  <span className="text-xs text-slate-400">{e.at ? new Date(e.at).toLocaleString('en-IN') : ''}</span>
                  {e.amount ? <span className="text-xs text-orange-600 font-semibold">{currencyConvertor(e.amount)}</span> : null}
                  {e.commissionAmount ? <span className="text-[11px] text-slate-500">Platform commission: {currencyConvertor(e.commissionAmount)}</span> : null}
                  {e.agreedTerms && (e.agreedTerms.deliveryDate || e.agreedTerms.paymentTerms) ? (
                    <span className="text-[11px] text-slate-500">
                      {e.agreedTerms.deliveryDate ? `Delivery ${dateFormatter(e.agreedTerms.deliveryDate)}` : ''}
                      {e.agreedTerms.paymentTerms ? ` · ${separateName(e.agreedTerms.paymentTerms)}` : ''}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
};

const RequirementOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requirementId } = useParams();
  const productData = location.state?.products;
  const {
    fn: getBidByProductIdAndSellerIdFn,
    data: getBidByProductIdAndSellerIdData,
    setData: setGetBidByProductIdAndSellerIdData,
    loading: getBidByProductIdAndSellerIdLoading,
  } = useFetch(bidService.getBidByProductIdAndSellerId);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [bidData, setBidData] = useState([]);
  const [iterateData, setIterateData] = useState([]);
  const [requirementData, setRequirementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isSoldProduct, setIsSoldProduct] = useState(false);
  const [openQuoteDetails, setOpenQuoteDetails] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  let intervalRef = useRef(null);

  useEffect(() => {
    const fetchRequirementData = async () => {
      if (requirementId) {
        try {
          const data = await requirementService.getRequirementById(requirementId);
          setRequirementData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching requirement data:', error);
          setLoading(false);
        }
      }
    };

    fetchRequirementData();
  }, [requirementId]);

  useEffect(() => {
    if (requirementData) {
      const dataToUse =
        requirementData || (productData && productData.length > 0 ? productData[0] : null) || null;

      const isSoldProduct = requirementData?.product?.isSoldProduct;
      setIsSoldProduct(isSoldProduct);

      if (dataToUse) {
        setCurrentProduct(dataToUse);

        if (dataToUse.product) {
          const allProducts = [dataToUse.product, ...(dataToUse.product.subProducts || [])];
          setIterateData(allProducts);
        }

        if (dataToUse.sellers && dataToUse.sellers.length > 0) {
          const transformedBids = dataToUse.sellers.map(seller => ({
            avtar: seller.seller?.profileImage,
            date: seller.date
              ? dateFormatter(seller.date)
              : seller.createdAt
                ? dateFormatter(seller.createdAt)
                : dataToUse.createdAt
                  ? dateFormatter(dataToUse.createdAt)
                  : 'N/A',
            bid_buy:
              `${seller.seller?.firstName || ''} ${seller.seller?.lastName || ''}`.trim() ||
              'Anonymous Seller',
            bid_amount: seller.budgetAmount
              ? currencyConvertor(seller.budgetAmount)
              : 'N/A',
            chat_message: seller.message || 'Interested in your requirement',
            action: 'chat',
            productId: dataToUse.product?._id,
            sellerId: seller.seller?._id || seller._id || seller.userId,
            location: seller.seller?.currentLocation || seller.seller?.address,
            status: seller.seller?.status,
            verified: seller.seller?.verificationStatus === 'verified',
            company: seller.seller?.businessName || seller.seller?.organizationName || '',
            quoteStatus: seller.quoteStatus || 'pending',
            // Real bid id lives on `bidId`; `_id` is the sellers[] subdocument id.
            // Using the subdoc id made shortlist/accept 404 silently (static buttons).
            bidId: seller.bidId || seller._id,
          }));

          setBidData(transformedBids);
        }
      }
    }
  }, [requirementData]);

  const handleChatNavigate = (sellerId, sellerName, sellerAvatar) => {
    if (currentProduct) {
      navigate('/chat?productId=' + currentProduct.product?._id, {
        state: {
          productId: currentProduct.product?._id,
          buyerId: currentProduct.buyer?._id,
          sellerId: sellerId,
          partnerName: sellerName,
          partnerAvatar: sellerAvatar,
          isBuyer: true,
          productName: currentProduct.product?.title,
        },
      });
    }
  };

  const handleUpdateQuoteStatus = async (bidId, status) => {
    if (!bidId) {
      toast.error('Missing quote reference — please refresh and try again.');
      return;
    }
    try {
      await bidService.updateQuoteStatus(bidId, { quoteStatus: status });
      setBidData(prev => prev.map(bid => {
        if (bid.bidId === bidId) {
          return { ...bid, quoteStatus: status };
        }
        return bid;
      }));
      toast.success(`Quote ${status}`);
    } catch (error) {
      console.error('Error updating quote status', error);
      toast.error(error?.response?.data?.message || 'Failed to update quote status');
    }
  };

  const counts = {
    pending: bidData.filter(b => b.quoteStatus === 'pending').length,
    shortlisted: bidData.filter(b => b.quoteStatus === 'shortlisted').length,
    accepted: bidData.filter(b => b.quoteStatus === 'accepted').length,
  };

  const columns = [
    {
      accessorKey: 'avtar',
      header: '',
      size: 60,
      cell: ({ row }) => {
        const image = row.original.avtar;
        const name = row.original.bid_buy || 'NA';

        const initials = name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();

        return (
          <div className="flex -space-x-2">
            <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
              <AvatarImage
                src={image}
                alt={name}
                className="rounded-full w-full h-full object-cover"
              />
              <AvatarFallback className="bg-gray-200 rounded-full flex w-full h-full items-center justify-center text-xs sm:text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'bid_buy',
      header: 'Seller',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800">{row.original.bid_buy}</span>
            {row.original.verified && (
              <span title="Verified supplier" className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          {row.original.company && (
            <span className="text-xs text-slate-400 truncate max-w-[160px]">{row.original.company}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'bid_amount',
      header: 'Quoted Price',
      cell: ({ row }) => (
        <span className="font-bold text-slate-800">{row.original.bid_amount}</span>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'action',
      header: 'Action/View',
      cell: ({ row }) => {
        // All action buttons share one size/shape so the row reads as a clean set
        // of equal-weight actions — View always comes first, Chat right after it.
        const actionBtnClass = 'text-xs sm:text-sm px-3 h-8 cursor-pointer';
        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className={`${actionBtnClass} text-orange-600 border-orange-600 hover:bg-orange-50`}
              onClick={async () => {
                if (getBidByProductIdAndSellerIdLoading) return;
                const { productId, sellerId } = row.original;
                setOpenQuoteDetails(true);
                setGetBidByProductIdAndSellerIdData(null);
                await getBidByProductIdAndSellerIdFn(productId, sellerId);
              }}
            >
              <Eye className="w-4 h-4 mr-1.5" /> View
            </Button>

            {/* SB-009: once shortlisted/accepted, chat becomes the finalisation channel */}
            {row.original.quoteStatus === 'shortlisted' || row.original.quoteStatus === 'accepted' ? (
              <Button
                size="sm"
                className={`${actionBtnClass} bg-orange-600 hover:bg-orange-700 text-white`}
                onClick={() =>
                  handleChatNavigate(row.original.sellerId, row.original.bid_buy, row.original.avtar)
                }
              >
                Finalize in Chat
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className={`${actionBtnClass} text-orange-600 border-orange-600 hover:bg-orange-50`}
                onClick={() =>
                  handleChatNavigate(row.original.sellerId, row.original.bid_buy, row.original.avtar)
                }
              >
                Chat
              </Button>
            )}

            {row.original.quoteStatus === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className={`${actionBtnClass} text-orange-600 border-orange-600 hover:bg-orange-50`}
                onClick={() => handleUpdateQuoteStatus(row.original.bidId, 'shortlisted')}
              >
                Shortlist
              </Button>
            )}
            {row.original.quoteStatus === 'rejected' && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-full px-3">Rejected</Badge>
            )}
            {row.original.quoteStatus === 'accepted' && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-full px-3">Accepted</Badge>
            )}
            {row.original.quoteStatus === 'shortlisted' && (
               <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 rounded-full px-3">Shortlisted</Badge>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const product = requirementData?.product;
    if (!requirementData?.createdAt || !product) return;

    // Prefer the explicit "Bid Valid Until" date the buyer set; only fall back
    // to createdAt + bidActiveDuration (days) when no real date exists. Using
    // the day-count alone wrongly expired RFQs that had a later validity date.
    let expiryTime;
    const expiryDateStr = product.bidExpiryDate;
    if (expiryDateStr && isNaN(Number(expiryDateStr))) {
      expiryTime = new Date(expiryDateStr).getTime();
    } else {
      const durationDays = Number(product.bidActiveDuration) || 1;
      expiryTime = new Date(requirementData.createdAt).getTime() + durationDays * 24 * 60 * 60 * 1000;
    }
    if (!expiryTime || isNaN(expiryTime)) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft('Expired');

        if (intervalRef.current) clearInterval(intervalRef.current);

        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(days > 0 ? `${days}d ${hours}h left` : `${hours}h ${minutes}m left`);
    };

    if (!isSoldProduct) {
      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [requirementData]);

  if (loading) {
    return <CategoryFormSkeleton />;
  }

  if (!currentProduct || !currentProduct.product) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-red-700">Requirement Product Data Unavailable</h2>
          <p className="text-sm text-slate-600">
            This requirement's underlying product details could not be found. The item might have been deleted, or there was a data synchronization error during creation.
          </p>
          <Button onClick={() => navigate('/account/requirements')} className="bg-orange-600 hover:bg-orange-700 text-white mt-2">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  if (getBidByProductIdAndSellerIdLoading) {
    return <Loader />;
  }

  return (
    <>
      <QuoteDetailsDialog
        open={openQuoteDetails}
        onOpenChange={setOpenQuoteDetails}
        quoteDetails={getBidByProductIdAndSellerIdData}
      />
      <QuoteCompareDialog
        open={showCompare}
        onOpenChange={setShowCompare}
        productId={currentProduct?.product?._id}
      />
      <DealTimelineDialog
        open={showTimeline}
        onOpenChange={setShowTimeline}
        productId={currentProduct?.product?._id}
      />

      <div className="w-full max-w-[1600px] mx-auto space-y-4 px-3 sm:px-4 lg:px-6 py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/account/requirements')}
            >
              <MoveLeft className="h-4 w-4" />

              <BreadcrumbPage className="capitalize font-semibold text-gray-500 text-sm sm:text-[15px]">
                Requirement Detail's
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile Back Button */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            className="p-0 h-auto flex items-center gap-2"
            onClick={() => navigate('/account/requirements')}
          >
            <MoveLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Requirement Detail's</span>
          </Button>
        </div>

        {/* Product Cards */}
        {iterateData.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5"
          >
            {/* Image / RFQ panel */}
            <div className="lg:col-span-3">
              <div className="relative flex flex-col justify-center items-center rounded-xl h-44 lg:h-full min-h-[160px] overflow-hidden border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100/40">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || 'Product'}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                    className="object-contain h-full w-full rounded-lg mix-blend-darken"
                  />
                ) : (
                  <>
                    <FileText className="w-10 h-10 text-orange-400" />
                    <span className="text-[11px] font-bold text-orange-500 mt-2 uppercase tracking-widest">
                      {item.document ? 'Document RFQ' : 'RFQ'}
                    </span>
                  </>
                )}
                {isSoldProduct && (
                  <img
                    src="/sold.png"
                    alt="Sold"
                    className="absolute top-0 right-0 w-20 sm:w-24"
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-9 space-y-3">
              {/* Top section */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xs sm:text-sm font-medium text-slate-400">
                  Posted {dateFormatter(item.createdAt) || 'N/A'}
                </h2>

                <div className="self-start shrink-0">
                  {loading || !timeLeft ? (
                    <Skeleton className="h-7 w-24 rounded-full" />
                  ) : isSoldProduct ? null : (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                        timeLeft === 'Expired' ? 'bg-slate-200 text-slate-500' : 'bg-orange-600 text-white'
                      }`}
                    >
                      {timeLeft !== 'Expired' && <CalendarDays className="w-3.5 h-3.5" />}
                      {timeLeft}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize break-words tracking-tight">
                {item.title || item.itemName || item.subCategoryName || `Item ${idx + 1}`}
              </h2>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 text-sm text-gray-600">
                {item.quantity && (
                  <div className="flex items-center gap-2 sm:pr-4 sm:border-r-2 py-1">
                    <div className="flex gap-1 items-center">
                      <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="capitalize">Quantity:</span>
                    </div>
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 sm:pr-4 sm:border-r-2 py-1">
                  <div className="flex gap-1 items-center">
                    <CalendarDays className="w-4 h-4" />
                    <span className="capitalize">Delivery By:</span>
                  </div>

                  <span className="font-semibold">
                    {item.paymentAndDelivery?.ex_deliveryDate
                      ? dateFormatter(item.paymentAndDelivery.ex_deliveryDate)
                      : 'N/A'}
                  </span>
                </div>

                {item.paymentAndDelivery?.paymentMode && (
                  <div className="flex items-center gap-2 sm:pr-4 sm:border-r-2 py-1">
                    <div className="flex gap-1 items-center">
                      <CreditCard className="w-4 h-4" />
                      <span>Payment:</span>
                    </div>
                    <span className="font-semibold capitalize">{separateName(item.paymentAndDelivery.paymentMode)}</span>
                  </div>
                )}

                {(item.categoryId?.categoryName || item.category?.categoryName) && (
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex gap-1 items-center">
                      <Store className="w-4 h-4" />
                      <span>Category:</span>
                    </div>
                    <span className="font-semibold capitalize">{item.categoryId?.categoryName || item.category?.categoryName}</span>
                  </div>
                )}
              </div>

              {item.brand && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">Brand:</span>

                  <span className="text-gray-600 capitalize break-words">{item.brand}</span>
                </div>
              )}

              {item.conditionOfProduct && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">Condition:</span>

                  <span className="text-gray-600 capitalize">
                    {item.conditionOfProduct.replace('_', ' ')}
                  </span>
                </div>
              )}

              {/* Documents uploaded with the requirement */}
              {resolveDocuments(item.document).length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-700 mb-1.5">Uploaded Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {resolveDocuments(item.document).map((doc, dIdx) => (
                      <a
                        key={dIdx}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                        Document {dIdx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info — shown after documents */}
              {item.description && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Additional Info</p>
                  <p className="text-sm text-gray-600 leading-relaxed break-words">{item.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Quotes section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-4">
          {/* Header: title + summary + tools */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Quotes Received</h3>
              <div className="flex items-center gap-4 mt-1.5 text-xs">
                <span className="text-slate-500"><b className="text-slate-800">{bidData.length}</b> total</span>
                <span className="text-slate-500"><b className="text-orange-600">{counts.pending}</b> new</span>
                <span className="text-slate-500"><b className="text-amber-600">{counts.shortlisted}</b> shortlisted</span>
                <span className="text-slate-500"><b className="text-green-600">{counts.accepted}</b> accepted</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTimeline(true)}
                className="border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                🕑 Timeline
              </Button>
              {bidData.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompare(true)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  ⚖ Compare Quotes
                </Button>
              )}
            </div>
          </div>

          {/* One list, every quote visible — shortlisting just marks a row in
              place (badge below) instead of moving it to a separate tab. */}
          <div className="p-2 sm:p-4 overflow-x-auto">
            <TableListing
              data={bidData}
              columns={columns}
              filters={false}
              title={``}
              target="requirementOverview"
              colorPalette="blue"
              itemStateMessage="No quotes yet"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RequirementOverview;
