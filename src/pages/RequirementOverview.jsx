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
import { Banknote, CalendarDays, Eye, MoveLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import requirementService from '@/services/requirement.service';
import { Skeleton } from '@/components/ui/skeleton';
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

const QuoteDetailsDialog = ({ open, onOpenChange, quoteDetails }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className={'font-semibold'}>Seller Quote Details</DialogTitle>
            <DialogDescription>View the details of the seller's quote here.</DialogDescription>
          </DialogHeader>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2  gap-2">
            <Field>
              <Label>Budget</Label>
              <Input value={quoteDetails?.budgetQuation || '-'} readOnly />
            </Field>

            <Field>
              <Label>Seller Type</Label>
              <Input
                value={separateName(quoteDetails?.sellerType) || '-'}
                readOnly
                className="capitalize"
              />
            </Field>

            <Field>
              <Label>Price Basis</Label>
              <Input
                value={separateName(quoteDetails?.priceBasis) || '-'}
                readOnly
                className="capitalize"
              />
            </Field>

            <Field>
              <Label>Taxes</Label>
              <Input
                value={separateName(quoteDetails?.taxes) || '-'}
                readOnly
                className="capitalize"
              />
            </Field>

            <Field>
              <Label>Location</Label>
              <Input value={quoteDetails?.location || '-'} readOnly className="capitalize" />
            </Field>

            <Field>
              <Label>Status</Label>
              <Input value={quoteDetails?.status || '-'} className="capitalize" readOnly />
            </Field>

            <Field>
              <Label>Freight Terms</Label>
              <Input
                value={separateName(quoteDetails?.freightTerms) || '-'}
                readOnly
                className="capitalize"
              />
            </Field>

            <Field>
              <Label>Payment Terms</Label>
              <Input
                value={separateName(quoteDetails?.paymentTerms) || '-'}
                readOnly
                className="capitalize"
              />
            </Field>

            {/* Company Fields */}
            {quoteDetails?.businessType === 'business' && (
              <>
                <Field>
                  <Label>Company Name</Label>
                  <Input
                    value={quoteDetails?.businessDets?.company_name || '-'}
                    readOnly
                    className="capitalize"
                  />
                </Field>

                <Field>
                  <Label>GST Number</Label>
                  <Input
                    value={quoteDetails?.businessDets?.gst_num || '-'}
                    readOnly
                    className="capitalize"
                  />
                </Field>
              </>
            )}

            {/* Description Bottom Full Width */}
            <Field className="col-span-2">
              <Label>Description</Label>

              <textarea
                value={quoteDetails?.buyerNote || '-'}
                readOnly
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </Field>
          </FieldGroup>

          {/* <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter> */}
        </DialogContent>
      </form>
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
            bid_amount: currencyConvertor(seller.budgetAmount)
              ? currencyConvertor(seller.budgetAmount)
              : 'N/A',
            chat_message: seller.message || 'Interested in your requirement',
            action: 'chat',
            productId: dataToUse.product?._id,
            sellerId: seller.seller?._id || seller._id || seller.userId,
            location: seller.seller?.currentLocation || seller.seller?.address,
            status: seller.seller?.status,
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
    },
    {
      accessorKey: 'bid_amount',
      header: 'Quoted Price',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'action',
      header: 'Action/View',
      cell: ({ row }) => {
        return (
          <div className="flex  items-center gap-3">
            <Button
              className="text-xs sm:text-sm cursor-pointer text-orange-600  px-0"
              variant="link"
              onClick={() =>
                handleChatNavigate(row.original.sellerId, row.original.bid_buy, row.original.avtar)
              }
            >
              Chat Now
            </Button>

            <div
              onClick={async () => {
                if (getBidByProductIdAndSellerIdLoading) return;
                const { productId, sellerId } = row.original;
                setOpenQuoteDetails(true);
                setGetBidByProductIdAndSellerIdData(null);
                await getBidByProductIdAndSellerIdFn(productId, sellerId);
              }}
              className=" bg-orange-100 text-orange-500 rounded-sm  p-1 cursor-pointer"
            >
              <TooltipComp
                hoverChildren={<Eye className="w-5 h-5" />}
                contentChildren={<p>View Quote</p>}
              ></TooltipComp>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!requirementData?.createdAt || !requirementData?.product?.bidActiveDuration) return;

    const createdAt = new Date(requirementData.createdAt).getTime();
    const durationDays = Number(requirementData.product.bidActiveDuration);

    const expiryTime = createdAt + durationDays * 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft('Expired');

        if (intervalRef.current) clearInterval(intervalRef.current);

        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
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

  if (!currentProduct) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="text-center text-sm sm:text-base">No product data available</div>
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
      <div className="w-full max-w-7xl mx-auto space-y-4 px-3 sm:px-4 lg:px-6 py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(-1)}
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
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Requirement Detail's</span>
          </Button>
        </div>

        {/* Product Cards */}
        {iterateData.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 bg-white rounded-xl border p-3 sm:p-4"
          >
            {/* Image */}
            <div className="lg:col-span-4">
              <div className="relative bg-gray-100 flex justify-center items-center rounded-lg p-4 h-52 sm:h-64 lg:h-56 overflow-hidden">
                <img
                  src={item.image || '/no-image.webp'}
                  alt={item.title || 'Product'}
                  className="object-contain h-full w-full rounded-lg mix-blend-darken"
                />

                {isSoldProduct && (
                  <img
                    src="/sold.png"
                    alt="Sold"
                    className="absolute top-0 right-0 w-20 sm:w-24 lg:w-28"
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {/* Top section */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <h2 className="text-xs sm:text-sm font-medium text-gray-600">
                  Date: {dateFormatter(item.createdAt) || 'N/A'}
                </h2>

                <div className="self-start sm:self-auto">
                  {loading || !timeLeft ? (
                    <Skeleton className="h-8 w-24 rounded-full" />
                  ) : isSoldProduct ? (
                    ''
                  ) : (
                    <Button
                      variant="ghost"
                      className="border rounded-full hover:bg-orange-700 hover:text-white text-xs sm:text-sm bg-orange-700 text-white"
                    >
                      {timeLeft !== 'Expired' ? timeLeft : 'Expired'}
                    </Button>
                  )}
                </div>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold capitalize break-words">
                {item.title || 'N/A'}
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed break-words">
                {item.description || 'No description available'}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 text-sm text-gray-600">
                <div className="flex items-center gap-2 sm:pr-4 sm:border-r-2 py-1">
                  <div className="flex gap-1 items-center">
                    <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="capitalize">Quantity:</span>
                  </div>

                  <span className="font-semibold">{item.quantity || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 py-1">
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
            </div>
          </div>
        ))}

        {/* Table */}
        <div className="bg-orange-50 p-2 sm:p-4 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <TableListing
              data={bidData}
              columns={columns}
              filters={false}
              title={`Quote Recevied`}
              target="requirementOverview"
              colorPalette="orange"
              itemStateMessage="No quotes received yet"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RequirementOverview;
