import { Box, Home, Paperclip, Star, Package, Calculator, ShieldCheck } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/lib/DatePicker';
import { useFetch } from '@/hooks/useFetch';
import productService from '@/services/product.service';
import { useEffect, useRef, useState } from 'react';
import { mergeName } from '@/utils/mergerName';
import { currencyConvertor } from '@/utils/currencyConvertor';
import { dateFormatter } from '@/utils/dateFormatter';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUserState } from '@/redux/hooks/useUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { productOverviewBidSchema } from '@/validations/Schema';
import bidService from '@/services/bid.service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SellerVerificationPopup from '@/components/custom/popups/SellerVerificationPopup';
import { Spinner } from '@/components/ui/spinner';
import Authentication from '@/components/custom/auth/Authenticate';
import { CategoryFormSkeleton } from '@/const/CustomSkeletons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import requirementService from '@/services/requirement.service';
import { Skeleton } from '@/components/ui/skeleton';

function otherBrandValue(obj) {
  if (obj?.brand === 'others' && obj.hasOwnProperty('brandName')) {
    return obj.brandName;
  }
  return obj?.brand;
}

const MOCK_PRODUCTS = {
  prod_mock_1: {
    mainProduct: {
      _id: 'prod_mock_1',
      title: 'UltraTech OPC 53 Grade Cement',
      description: 'Delivery required at site, unloading in scope of supplier. ISI marked fresh stock only.',
      quantity: 1500,
      quantityUnit: 'Bags',
      minimumBudget: 380,
      brand: 'UltraTech',
      categoryId: { categoryName: 'Building Materials' },
      subCategoryId: { name: 'OPC 53 Cement' },
      userId: { _id: 'buyer_mock_1', firstName: 'Mayur', lastName: 'Agarwal', address: 'Peenya Project Site, Bengaluru' },
      isSoldProduct: false,
      totalBidCount: 2,
      isMergeQuote: false,
      image: '/image/Category/industrialImage.png',
      createdAt: new Date().toISOString()
    }
  },
  prod_mock_2: {
    mainProduct: {
      _id: 'prod_mock_2',
      title: 'Fe 550 TMT Steel Reinforcement Bars',
      description: 'Standard 12m length, sizes: 8mm, 12mm, 16mm mixed ratio. Mill test certificate required.',
      quantity: 12,
      quantityUnit: 'Tons',
      minimumBudget: 62000,
      brand: 'Tata Tiscon',
      categoryId: { categoryName: 'Building Materials' },
      subCategoryId: { name: 'TMT Rebars' },
      userId: { _id: 'buyer_mock_2', firstName: 'Ramesh', lastName: 'Kumar', address: 'Smart City Project, Mangaluru' },
      isSoldProduct: false,
      totalBidCount: 3,
      isMergeQuote: true,
      image: '/image/Category/industrialImage.png',
      createdAt: new Date().toISOString()
    }
  },
  prod_mock_3: {
    mainProduct: {
      _id: 'prod_mock_3',
      title: 'Heavy Duty PVC Conduit Pipes (20mm)',
      description: 'FRLS (Fire Retardant Low Smoke) grade, standard light grey color with couplers.',
      quantity: 2500,
      quantityUnit: 'Meters',
      minimumBudget: 45,
      brand: 'Supreme',
      categoryId: { categoryName: 'Building Materials' },
      subCategoryId: { name: 'Conduit Fittings' },
      userId: { _id: 'buyer_mock_3', firstName: 'Kiran', lastName: 'Patel', address: 'Commercial Complex, Hubballi' },
      isSoldProduct: false,
      totalBidCount: 1,
      isMergeQuote: false,
      image: '/image/Category/industrialImage.png',
      createdAt: new Date().toISOString()
    }
  },
  prod_mock_4: {
    mainProduct: {
      _id: 'prod_mock_4',
      title: 'Double Charge Vitrified Tiles (600x600)',
      description: 'Glossy finish, ivory/white base color, premium quality brand (Kajaria/Somany equivalent).',
      quantity: 1200,
      quantityUnit: 'Sq Ft',
      minimumBudget: 42,
      brand: 'Kajaria',
      categoryId: { categoryName: 'Finishing, Tiles & Granite' },
      subCategoryId: { name: 'Double Charge Tiles' },
      userId: { _id: 'buyer_mock_4', firstName: 'Sanjay', lastName: 'Shetty', address: 'Residential Villa Project, Belagavi' },
      isSoldProduct: false,
      totalBidCount: 0,
      isMergeQuote: false,
      image: '/image/Category/sportsImage.png',
      createdAt: new Date().toISOString()
    }
  },
  prod_mock_5: {
    mainProduct: {
      _id: 'prod_mock_5',
      title: 'Polished Granite Slabs (Sira Grey, 18mm)',
      description: 'Uniform thickness, single-quarry lot, double-polished, pre-cut to standard counter size.',
      quantity: 3000,
      quantityUnit: 'Sq Ft',
      minimumBudget: 115,
      brand: 'General',
      categoryId: { categoryName: 'Finishing, Tiles & Granite' },
      subCategoryId: { name: 'Granite' },
      userId: { _id: 'buyer_mock_5', firstName: 'Anand', lastName: 'Gowda', address: 'IT Park Site, Mysuru' },
      isSoldProduct: false,
      totalBidCount: 4,
      isMergeQuote: true,
      image: '/image/Category/furnitureImage.png',
      createdAt: new Date().toISOString()
    }
  },
  prod_mock_6: {
    mainProduct: {
      _id: 'prod_mock_6',
      title: 'Recessed LED Panel Lights (15W, Warm)',
      description: 'Round shape, aluminum body, driver included, minimum 2-year manufacturer warranty.',
      quantity: 500,
      quantityUnit: 'Units',
      minimumBudget: 320,
      brand: 'Philips/Havells',
      categoryId: { categoryName: 'Electrical & Lighting' },
      subCategoryId: { name: 'LED Panel Lights' },
      userId: { _id: 'buyer_mock_6', firstName: 'Vijay', lastName: 'Rao', address: 'Apartment Project, Tumakuru' },
      isSoldProduct: false,
      totalBidCount: 0,
      isMergeQuote: false,
      image: '/image/Category/homeAppliancesImage.png',
      createdAt: new Date().toISOString()
    }
  }
};

const MergeBidForm = ({ productResponse, userProfile, navigate }) => {
  const { user } = useUserState();
  const [mergeFormState, setMergeFormState] = useState({ message: '' });

  function handleSendMessage(e) {
    e.preventDefault();
    const currentProduct = productResponse?.mainProduct;
    const sellerId = user._id;
    const buyerId = currentProduct?.userId?._id;

    if (currentProduct?.dealStatus === 'completed') {
      toast.error('This product has already been sold');
      return;
    }

    localStorage.setItem(
      'chatIds',
      JSON.stringify({
        productId: currentProduct._id,
        buyerId: buyerId,
        sellerId: sellerId,
      })
    );

    navigate('/chat', {
      state: {
        productId: currentProduct._id,
        buyerId: buyerId,
        sellerId: sellerId,
        partnerName: mergeName(user),
        partnerAvatar: user?.profileImage,
        message: mergeFormState.message,
      },
    });
  }

  return (
    <form
      className="lg:col-span-5 bg-gray-200/80 rounded-lg p-6 space-y-4 my-auto h-fit"
      onSubmit={handleSendMessage}
    >
      <h3 className="font-semibold text-orange-600">Merge Quote</h3>
      <div className="w-full col-span-2">
        <Label htmlFor="ab" className="mb-2 text-sm">
          Note for Buyer
        </Label>
        <Textarea
          value={mergeFormState.message}
          onInput={e => setMergeFormState({ message: e.currentTarget.value })}
          placeholder="Short message (hard limit: 300 characters)"
          className="bg-white w-full min-h-32"
        />
      </div>
      <Button
        type="submit"
        disabled={
          productResponse?.mainProduct?.userId?._id === userProfile?._id ||
          mergeFormState.message.trim().length < 2
        }
        variant={'ghost'}
        className="w-32 float-end border text-xs bg-orange-700 transition-all ease-in-out duration-300 hover:bg-orange-600 text-white hover:text-white cursor-pointer"
      >
        Chat Now
      </Button>
    </form>
  );
};

const SellerForm = ({
  handleSubmit,
  onSubmit,
  register,
  control,
  userProfile,
  bidOverviewRes,
  productResponse,
  createBidLoading,
  updateUserBidDetsLoading,
  soldProduct,
  watch,
}) => {
  return (
    <form
      className="w-full lg:col-span-5 bg-gray-200/80 rounded-lg p-3 sm:p-4 md:p-6 space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="font-semibold text-orange-600 text-base sm:text-lg">
        Seller Quotation Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {/* {userProfile?._id && (
          <>
            <div className="w-full">
              <Label htmlFor="firstName" className="mb-2 text-sm block">
                First Name
              </Label>
              <Input
                disabled
                type="text"
                placeholder="First Name"
                id="firstName"
                {...register('firstName')}
                className="bg-white select-none w-full"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="lastName" className="mb-2 text-sm block">
                Last Name
              </Label>
              <Input
                disabled
                type="text"
                placeholder="Last Name"
                id="lastName"
                {...register('lastName')}
                className="bg-white select-none w-full"
              />
            </div>
          </>
        )} */}

        {/* Seller Type */}
        <div className="w-full">
          <Label className="mb-2 text-sm block">Seller Type</Label>

          <Controller
            name="sellerType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Seller Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>

                    <SelectItem value="trader_wholesaler">Trader / Wholesaler</SelectItem>

                    <SelectItem value="distributor">Distributor</SelectItem>

                    <SelectItem value="service_provider">Service Provider</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Item-by-Item Pricing & Totaler */}
        {(() => {
          const isMulti = productResponse?.mainProduct?.isMultiple;
          const items = productResponse?.mainProduct?.items || [];
          
          if (isMulti && items.length > 1) {
            return (
              <div className="w-full sm:col-span-2 bg-white rounded-md border border-orange-100 overflow-hidden mb-2">
                <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                      <Package className="w-4 h-4 text-orange-600" />
                      Line Item Pricing
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{items.length} items — price each item separately</p>
                  </div>
                  <a 
                    href="/supplier-tools" 
                    target="_blank"
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Margin Calculator
                  </a>
                </div>
                <div className="divide-y divide-orange-50">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-slate-700">{item.subCategoryName || item.typeOfProduct || 'Item ' + (idx + 1)}</span>
                          <div className="text-xs text-slate-400 mt-0.5 flex gap-3">
                            {item.brand && <span>Brand: {item.brand}</span>}
                            {(item.typeOfProduct || item.model) && <span>Type: {item.typeOfProduct || item.model}</span>}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{item.quantity} {item.quantityUnit}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <Label className="mb-1.5 text-xs text-slate-500">Unit Price (₹)</Label>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9" {...register(`items.${idx}.unitPrice`)} />
                        </div>
                        <div>
                          <Label className="mb-1.5 text-xs text-slate-500">Discount (%)</Label>
                          <Input type="number" step="0.1" min="0" max="100" placeholder="0%" className="h-9" {...register(`items.${idx}.discount`)} />
                        </div>
                        <div>
                          <Label className="mb-1.5 text-xs text-slate-500">Qty ({item.quantityUnit})</Label>
                          <Input type="text" disabled value={item.quantity || 1} className="h-9 bg-slate-50" />
                        </div>
                        <div>
                          <Label className="mb-1.5 text-xs text-slate-500">Freight Cost (₹)</Label>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9" {...register(`items.${idx}.freightCost`)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          // Single item — original layout
          return (
            <div className="w-full sm:col-span-2 bg-white rounded-md border border-orange-100 overflow-hidden mb-2">
              <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    Line Item Pricing
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{productResponse?.mainProduct?.title}</p>
                </div>
                <a 
                  href="/supplier-tools" 
                  target="_blank"
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Margin Calculator
                </a>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label className="mb-1.5 text-xs text-slate-500">Unit Price (₹)</Label>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9" {...register('unitPrice')} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="mb-1.5 text-xs text-slate-500">Discount (%)</Label>
                  <Input type="number" step="0.1" min="0" max="100" placeholder="0%" className="h-9" {...register('discount')} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="mb-1.5 text-xs text-slate-500">Qty ({productResponse?.mainProduct?.quantityUnit})</Label>
                  <Input type="text" disabled value={productResponse?.mainProduct?.quantity || 1} className="h-9 bg-slate-50" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="mb-1.5 text-xs text-slate-500">Freight Cost (₹)</Label>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9" {...register('freightCost')} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Price Basis */}
        <div className="w-full">
          <Label className="mb-2 text-sm block">Price Basis</Label>

          <Controller
            name="priceBasis"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Price Basis" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="per_unit">Per Unit</SelectItem>
                    <SelectItem value="per_kg">Per Kg</SelectItem>
                    <SelectItem value="per_lot">Per Lot</SelectItem>
                    <SelectItem value="per_piece">Per Piece</SelectItem>
                    <SelectItem value="per_service">Per Service</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Taxes */}
        <div className="w-full">
          <Label className="mb-2 text-sm block">Taxes</Label>

          <Controller
            name="taxes"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Taxes" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="18">18% GST</SelectItem>
                    <SelectItem value="12">12% GST</SelectItem>
                    <SelectItem value="5">5% GST</SelectItem>
                    <SelectItem value="0">Inclusive/Exempt</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Location */}
        <div className="w-full">
          <Label htmlFor="location" className="mb-2 text-sm block">
            Location
          </Label>

          <Input
            type="text"
            placeholder="Location"
            className="bg-white w-full"
            {...register('location')}
          />
        </div>

        {/* Delivery Timeline */}
        <div className="w-full">
          <Label className="mb-2 text-sm block">Delivery Timeline</Label>

          <Controller
            control={control}
            name="earliestDeliveryDate"
            render={({ field }) => (
              <DatePicker
                disabledBeforeDate={new Date(new Date().getTime())}
                date={field.value}
                title="DD-MM-YYYY"
                className="w-full"
                setDate={val => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* Freight Terms */}
        <div className="w-full">
          <Label className="mb-2 text-sm block">Freight Terms</Label>

          <Controller
            name="freightTerms"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Freight Terms" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ex_works">Ex-Works</SelectItem>
                    <SelectItem value="fob">FOB</SelectItem>
                    <SelectItem value="delivered">Delivered (DAP / DDP)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Payment Terms */}
        <div className="w-full">
          <Label className="mb-2 text-sm block">Payment Terms</Label>

          <Controller
            name="paymentTerms"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Payment Terms" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="advance">Advance</SelectItem>

                    <SelectItem value="partial_advance">Partial Advance</SelectItem>

                    <SelectItem value="on_delivery">On Delivery</SelectItem>

                    <SelectItem value="credit">Credit (X days)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Buyer Note */}
        <div className="w-full col-span-1 sm:col-span-2">
          <Label htmlFor="buyerNote" className="mb-2 text-sm block">
            Buyer Note
          </Label>

          <Textarea
            {...register('buyerNote')}
            placeholder="Short message (hard limit: 300 characters)"
            className="bg-white w-full min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Live Totaler Panel */}
      {(() => {
        const isMulti = productResponse?.mainProduct?.isMultiple;
        const items = productResponse?.mainProduct?.items || [];
        const tRate = parseFloat(watch('taxes')) || 0;
        
        let subtotal = 0;
        let totalFreight = 0;
        
        if (isMulti && items.length > 1) {
          items.forEach((item, idx) => {
            const uPrice = parseFloat(watch(`items.${idx}.unitPrice`)) || 0;
            const disc = parseFloat(watch(`items.${idx}.discount`)) || 0;
            const fCost = parseFloat(watch(`items.${idx}.freightCost`)) || 0;
            const qty = item.quantity || 1;
            subtotal += (uPrice * (1 - disc/100)) * qty;
            totalFreight += fCost;
          });
        } else {
          const uPrice = parseFloat(watch('unitPrice')) || 0;
          const disc = parseFloat(watch('discount')) || 0;
          totalFreight = parseFloat(watch('freightCost')) || 0;
          const qty = productResponse?.mainProduct?.quantity || 1;
          subtotal = (uPrice * (1 - disc/100)) * qty;
        }
        
        const taxAmount = (subtotal + totalFreight) * (tRate/100);
        const grandTotal = subtotal + totalFreight + taxAmount;

        return (
          <div className="mt-6 border-t border-slate-200 pt-4 pb-2">
            <div className="flex flex-col gap-2 max-w-sm ml-auto text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (After Discount):</span>
                <span>₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Freight:</span>
                <span>₹ {totalFreight.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax ({tRate}%):</span>
                <span>₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-800 border-t pt-2 mt-1">
                <span>Grand Total:</span>
                <span className="text-orange-600">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Button */}
      <div className="flex justify-end pt-2">
        {!bidOverviewRes ? (
          <Button
            type="submit"
            disabled={
              productResponse?.mainProduct?.userId?._id === userProfile?._id ||
              createBidLoading ||
              soldProduct
            }
            variant={'ghost'}
            className="w-full sm:w-32 h-11 border text-xs sm:text-sm bg-orange-700 transition-all ease-in-out duration-300 hover:bg-orange-600 text-white hover:text-white cursor-pointer"
          >
            Place Quote
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={updateUserBidDetsLoading}
            variant={'ghost'}
            className="w-full sm:w-32 h-11 border shadow-orange-500 border-orange-500 bg-orange-600 transition-all ease-in-out duration-300 hover:bg-orange-500 text-white hover:text-white cursor-pointer"
          >
            {updateUserBidDetsLoading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Update Bid'}
          </Button>
        )}
      </div>
    </form>
  );
};

const ProductOverview = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const bidId = searchParams.get('bidId');
  const { user: userProfile } = useUserState();
  let intervalRef = useRef(null);

  const {
    fn: getProductById,
    data: productResponse,
    error,
    setData: setProductResponse,
    loading: productViewLoading,
  } = useFetch(productService.getProductById);
  const {
    fn: bidOverviewFn,
    data: bidOverviewRes,
    loading: bidOverLoading,
  } = useFetch(bidService.bidOverViewbyId);
  const {
    fn: updateUserBidDets,
    data: updateUserBidDetsRes,
    loading: updateUserBidDetsLoading,
  } = useFetch(bidService.updateUserBidDets);
  const {
    fn: getBidByProductIdFn,
    data: getBidByProductIdRes,
    loading: getBidByProductIdLoading,
  } = useFetch(bidService.getbidByProductId);
  const {
    fn: createBidFn,
    data: createBidRes,
    loading: createBidLoading,
  } = useFetch(bidService.createBid);
  const {
    fn: getBidStatsFn,
    data: bidStats,
  } = useFetch(bidService.getBidStats);
  const { fn: createRequirementFn } = useFetch(requirementService.createRequirement);

  const [open, setOpen] = useState(false);
  const [sellerVerification, setSellerVerification] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [dealSellerRating, setDealSellerRating] = useState(0);
  const [businessDets, setBusinessDets] = useState({
    company_name: userProfile?.businessName || '',
    company_reg_num: '', // not using
    gst_num: '',
  });

  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productOverviewBidSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      unitPrice: '',
      discount: '',
      freightCost: '',
      earliestDeliveryDate: undefined,
      sellerType: '',
      priceBasis: '',
      taxes: '',
      location: '',
      freightTerms: '',
      paymentTerms: '',
      buyerNote: '',
    },
  });

  useEffect(() => {
    if (productId) {
      if (productId.startsWith('prod_mock_')) {
        const mockData = MOCK_PRODUCTS[productId];
        if (mockData) {
          setProductResponse({ ...mockData });
          const rating = mockData.mainProduct?.sellerRating;
          if (rating) setDealSellerRating(rating);
        } else {
          toast.error('Mock product not found');
        }
      } else {
        getProductById(productId);
        getBidStatsFn(productId);
      }
    } else if (bidId) {
      bidOverviewFn(bidId);
    } else {
      toast.error('Invalid request');
    }
  }, [productId, bidId]);

  useEffect(() => {
    if (productResponse && Array.isArray(productResponse)) {
      const mainProduct = productResponse[0];
      setProductResponse({ ...mainProduct });
      const rating = mainProduct?.mainProduct?.sellerRating;
      if (rating) setDealSellerRating(rating);
    }
  }, [productResponse]);

  useEffect(() => {
    const rating = bidOverviewRes?.product?.sellerRating;
    if (rating) setDealSellerRating(rating);
  }, [bidOverviewRes]);

  async function handleCreteBid() {
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/; // 22AAAAA0000A1Z5
    if (
      businessType === 'business' &&
      businessDets.gst_num &&
      !gstRegex.test(businessDets.gst_num)
    ) {
      toast.error('Invalid GST Number format');
      return;
    }
    if (!productResponse) return;
    if (productResponse?.mainProduct?.userId?._id === userProfile?.user?._id) return;
    if (businessType === 'business' && !businessDets.company_name.trim()) {
      toast.error('company name is required');
      return;
    }
    const buyerId = productResponse?.mainProduct.userId?._id;
    const productId = productResponse?.mainProduct._id;

    if (productId?.startsWith('prod_mock_')) {
      toast.info('Submitting quotes is disabled for demo mock products. Please create a real product to test quoting.');
      return;
    }

    let obj = {
      ...getValues(),
      status: 'active',
      businessType,
      ...(businessType === 'business' && { businessDets }),
    };
    if (!businessType) {
      toast.error('business is required !');
      setSellerVerification(true);
    }
    try {
      await createBidFn(buyerId, productId, obj);
    } catch (err) {
      console.log(err);
      toast.error('Failed to place Quote');
    }
  }

  async function onSubmit(data) {
    if (soldProduct) return;
    if (timeLeft === 'Expired') {
      return toast.error('This product has expired');
    }
    const user = userProfile;
    if (!user?.firstName?.trim() || !user?.lastName?.trim() || !user?.address?.trim()) {
      navigate('/account');
      toast.info('Please complete your profile first');
      return;
    }
    const currentFormData = getValues();
    if (!user?._id) {
      localStorage.setItem('preLoginBidForm', JSON.stringify(currentFormData));
      return setOpen(true);
    }
    if (!productResponse && !bidOverviewRes)
      return console.log('product && Quote not found in frontend');

    if (productResponse) {
      setSellerVerification(true);
    } else {
      await updateUserBidDets(bidId, data);
    }
  }

  useEffect(() => {
    if (updateUserBidDetsRes) {
      toast.success('Quote updated successfully');
      setBusinessType('');
    }
  }, [updateUserBidDetsRes]);

  useEffect(() => {
    if (createBidRes) {
      if (productResponse?.mainProduct) {
        setProductResponse(prev => ({
          ...prev,
          mainProduct: {
            ...prev.mainProduct,
            totalBidCount: prev.mainProduct.totalBidCount + 1,
          },
        }));
      } else {
        console.log('main product is missing to update bid count');
      }

      const buyerId = productResponse?.mainProduct.userId?._id;
      const productId = productResponse?.mainProduct._id;
      const sellerId = userProfile?._id;
      const budgetAmount = Number(getValues().budgetQuation) || 0;
      createRequirementFn({ productId, sellerId, buyerId, budgetAmount });

      toast.success('Quote created successfully');
      if (productId && !productId.startsWith('prod_mock_')) {
        getBidStatsFn(productId);
      }
      setSellerVerification(false);
      setBusinessType('');
      reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        budgetQuation: '',
        earliestDeliveryDate: undefined,
        taxes: '',
        buyerNote: '',
        freightTerms: '',
        location: '',
        paymentTerms: '',
        priceBasis: '',
        sellerType: '',
      });
    }
  }, [createBidRes]);

  useEffect(() => {
    if (userProfile) {
      const savedData = localStorage.getItem('preLoginBidForm');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        reset({
          ...parsedData,
          firstName: bidOverviewRes ? bidOverviewRes?.seller?.firstName : userProfile.firstName,
          lastName: bidOverviewRes ? bidOverviewRes?.seller?.lastName : userProfile.lastName,
        });
        localStorage.removeItem('preLoginBidForm');
      } else {
        reset({
          firstName: bidOverviewRes ? bidOverviewRes?.seller?.firstName : userProfile.firstName,
          lastName: bidOverviewRes ? bidOverviewRes?.seller?.lastName : userProfile.lastName,
          budgetQuation: bidOverviewRes ? bidOverviewRes?.budgetQuation : '',
          earliestDeliveryDate: bidOverviewRes ? bidOverviewRes?.earliestDeliveryDate : undefined,
          sellerType: bidOverviewRes ? bidOverviewRes?.sellerType : 'trader_wholesaler',
          priceBasis: bidOverviewRes ? bidOverviewRes?.priceBasis : 'per_unit',
          taxes: bidOverviewRes ? bidOverviewRes?.taxes : 'inclusive_gst',
          location: bidOverviewRes ? bidOverviewRes?.location : userProfile.address || '',
          freightTerms: bidOverviewRes ? bidOverviewRes?.freightTerms : 'ex_works',
          paymentTerms: bidOverviewRes ? bidOverviewRes?.paymentTerms : 'on_delivery',
          buyerNote: bidOverviewRes ? bidOverviewRes?.buyerNote : '',
        });
      }
    }
  }, [userProfile, reset, bidOverviewRes]);

  useEffect(() => {
    if (error === 'invalid product ID') {
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < Object.entries(errors).length; i++) {
      toast.error(Object.entries(errors)[i][1]?.message);
      break;
    }
  }, [errors]);

  const handleDocumentDownload = url => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBidView = async productId => {
    if (productId?.startsWith('prod_mock_')) {
      toast.info('Quote viewing is disabled for demo mock products. Please create a real product to test quoting.');
      return;
    }
    await getBidByProductIdFn(productId);
  };

  useEffect(() => {
    if (getBidByProductIdRes) {
      const { _id } = getBidByProductIdRes;
      navigate('/bid-overview/' + _id);
    }
  }, [getBidByProductIdRes]);

  const isMergeQuote = productResponse?.mainProduct?.isMergeQuote;
  const soldProduct = bidOverviewRes
    ? bidOverviewRes?.product?.isSoldProduct
    : productResponse?.mainProduct?.isSoldProduct;
  const isMe = bidOverviewRes
    ? bidOverviewRes?.product?.userId?._id === userProfile?._id
    : productResponse?.mainProduct?.userId?._id === userProfile?._id;

  useEffect(() => {
    let product = bidOverviewRes ? bidOverviewRes?.product : productResponse?.mainProduct;
    if (!product) return;
    const createdAt = new Date(product.createdAt).getTime();
    const expiryDateStr = product?.bidExpiryDate || product?.timeline || product?.bidActiveDuration;
    let expiryTime = createdAt + 24 * 60 * 60 * 1000; // default 1 day
    if (expiryDateStr && isNaN(Number(expiryDateStr))) {
      expiryTime = new Date(expiryDateStr).getTime();
    } else if (expiryDateStr && !isNaN(Number(expiryDateStr))) {
      const durationDays = Number(expiryDateStr);
      expiryTime = createdAt + durationDays * 24 * 60 * 60 * 1000;
    }

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

    if (!soldProduct) {
      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [productResponse, bidOverviewRes]);

  return (
    <>
      {bidOverLoading || productViewLoading ? (
        <div className="max-w-7xl mx-auto p-4">
          <CategoryFormSkeleton />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
          {<Authentication setOpen={setOpen} open={open} />}
          <SellerVerificationPopup
            businessDets={businessDets}
            setBusinessDets={setBusinessDets}
            setOpen={setSellerVerification}
            open={sellerVerification}
            setValue={setBusinessType}
            value={businessType}
            handleCreteBid={handleCreteBid}
            createBidLoading={createBidLoading}
          />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <Home className="h-4 w-4" />
                <BreadcrumbSeparator />
                <BreadcrumbPage className="capitalize font-regular text-gray-500">
                  Product
                </BreadcrumbPage>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="capitalize font-regular text-gray-500">
                  {bidOverviewRes
                    ? bidOverviewRes?.product?.title
                    : productResponse?.mainProduct?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="">
            {/* Content */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product Info */}
              <div className="lg:col-span-12 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 opacity-80" />
                <div>
                  <h2 className="text-sm font-bold tracking-wide uppercase text-slate-400 mb-2 flex justify-between items-center">
                    Date :{' '}
                    {dateFormatter(
                      bidOverviewRes
                        ? bidOverviewRes?.product?.createdAt
                        : productResponse?.mainProduct?.createdAt
                    )}
                    {/* product Rating */}
                    {soldProduct ? (
                      ''
                    ) : (productViewLoading || bidOverLoading) && !timeLeft ? (
                      <Skeleton className="h-8 w-24 rounded-full float-end" />
                    ) : timeLeft !== 'Expired' ? (
                      <Button
                        variant="ghost"
                        className="float-end border rounded-full hover:bg-orange-700 hover:text-white text-sm bg-orange-700 text-white"
                      >
                        {timeLeft}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="float-end border rounded-full hover:bg-orange-700 hover:text-white text-sm bg-orange-700 text-white"
                      >
                        Expired
                      </Button>
                    )}
                  </h2>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold capitalize text-slate-800 tracking-tight leading-tight">
                  {bidOverviewRes
                    ? bidOverviewRes?.product?.title
                    : productResponse?.mainProduct?.title}
                </h2>
                <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
                  {productResponse?.mainProduct?.description || bidOverviewRes?.product?.description}
                </p>

                {bidStats && bidStats.totalBids > 0 && (
                  <div className="bg-orange-50/80 border border-orange-200 rounded-lg p-4 mt-4 grid grid-cols-3 gap-2 text-center max-w-lg">
                    <div>
                      <span className="block text-xs text-gray-500 uppercase font-semibold">Lowest Quote</span>
                      <span className="text-lg font-bold text-green-600">₹{bidStats.lowestQuote}</span>
                    </div>
                    <div className="border-x border-gray-200">
                      <span className="block text-xs text-gray-500 uppercase font-semibold">Average Quote</span>
                      <span className="text-lg font-bold text-orange-600">₹{bidStats.averageQuote}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 uppercase font-semibold">Highest Quote</span>
                      <span className="text-lg font-bold text-red-600">₹{bidStats.highestQuote}</span>
                    </div>
                    
                    {/* Buyer Trust Signal */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Phone Verified
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        GST Verified
                      </div>
                    </div>
                  </div>
                )}



                {soldProduct && dealSellerRating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= dealSellerRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    {/* <span className="text-xs text-gray-500 ml-1">{dealSellerRating}/5</span> */}
                  </div>
                )}

                {/* Buttons */}
                {!isMergeQuote && (
                  <div className="flex items-center gap-4 mt-5">
                    <Button
                      disabled={
                        getBidByProductIdLoading ||
                        (bidOverviewRes
                          ? bidOverviewRes.product?.totalBidCount
                          : productResponse?.mainProduct?.totalBidCount) === 0
                      }
                      onClick={() =>
                        handleBidView(
                          bidOverviewRes
                            ? bidOverviewRes?.product?._id
                            : productResponse?.mainProduct?._id
                        )
                      }
                      variant="outline"
                      className="min-w-32 text-sm border-gray-400 bg-transparent border-[2px] flex items-center gap-2 hover:bg-transparent cursor-pointer"
                    >
                      <img src="/Layer_1.png" className="w-4 h-4" />
                      Total Quote :
                      <span className="font-semibold">
                        {bidOverviewRes
                          ? bidOverviewRes.product?.totalBidCount
                          : productResponse?.mainProduct?.totalBidCount || 0}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Requirement + Form */}
            <div className="mt-5">
              {isMe && (
                <sup className="italic text-gray-500 text-sm">
                  Note: This product created by yourself you can't place the quote on this product.
                </sup>
              )}
            </div>
            <div className=" grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Left Column: Sections */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Requirement Specifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                    Requirement Specifications
                  </h3>


                  {/* General Specs */}
                  <div className="text-[15px] space-y-1 text-slate-600 font-medium">
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Category:</span>
                      {(bidOverviewRes ? bidOverviewRes?.product?.subCategory?.name : productResponse?.mainProduct?.categoryId?.categoryName) || "N/A"}
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Brand:</span>
                      {(bidOverviewRes ? otherBrandValue(bidOverviewRes?.product) : otherBrandValue(productResponse?.mainProduct)) || "N/A"}
                    </p>
                    {(bidOverviewRes?.product?.model || productResponse?.mainProduct?.model) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                        <span className="font-semibold">Model:</span>
                        {(bidOverviewRes ? bidOverviewRes?.product?.model : productResponse?.mainProduct?.model) || "N/A"}
                      </p>
                    )}
                    {(bidOverviewRes?.product?.productType || productResponse?.mainProduct?.productType) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                        <span className="font-semibold">Product Type:</span>
                        {(bidOverviewRes ? bidOverviewRes?.product?.productType : productResponse?.mainProduct?.productType)?.replace("_", " ") || "N/A"}
                      </p>
                    )}
                    {(bidOverviewRes?.product?.minimumBudget || productResponse?.mainProduct?.minimumBudget) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                        <span className="font-semibold">Budget:</span>
                        {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.minimumBudget : productResponse?.mainProduct?.minimumBudget)}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Delivery Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                    Delivery Information
                  </h3>
                  <div className="text-[15px] space-y-1 text-slate-600 font-medium">
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold">Delivery Location:</span>
                      <span className="capitalize">{
                        (bidOverviewRes ? bidOverviewRes?.buyer?.address : productResponse?.mainProduct?.userId?.address)?.split(",").slice(-2).join(",") || "N/A"
                      }</span>
                    </p>
                    {(() => {
                      const expiryDateStr = bidOverviewRes?.product?.bidExpiryDate || productResponse?.mainProduct?.bidExpiryDate || bidOverviewRes?.product?.timeline || productResponse?.mainProduct?.timeline || bidOverviewRes?.product?.bidActiveDuration || productResponse?.mainProduct?.bidActiveDuration;
                      const createdAt = bidOverviewRes?.product?.createdAt || productResponse?.mainProduct?.createdAt;
                      let expiryDateObj = null;
                      if (expiryDateStr && isNaN(Number(expiryDateStr))) {
                        expiryDateObj = new Date(expiryDateStr);
                      } else if (expiryDateStr && !isNaN(Number(expiryDateStr))) {
                         const days = Number(expiryDateStr);
                         expiryDateObj = new Date(new Date(createdAt || Date.now()).getTime() + days * 24 * 60 * 60 * 1000);
                      }
                      if (expiryDateObj && !isNaN(expiryDateObj.getTime())) {
                        return (
                          <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 text-red-600">
                            <span className="font-semibold">Bid Valid Until:</span>
                            {dateFormatter(expiryDateObj)}
                          </p>
                        );
                      }
                      return null;
                    })()}
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold">Required Delivery Date:</span>
                      {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.ex_deliveryDate : productResponse?.mainProduct?.paymentAndDelivery?.ex_deliveryDate) || "N/A"}
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Payment Mode:</span>
                      {(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.paymentMode : productResponse?.mainProduct?.paymentAndDelivery?.paymentMode) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* 3. Attachments */}
                {(bidOverviewRes?.product?.isUpload || productResponse?.mainProduct?.isUpload || productResponse?.mainProduct?.document || bidOverviewRes?.product?.document) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                      Attachments
                    </h3>
                    <div className="border-2 border-slate-100 bg-slate-50 rounded-lg p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">Requirements Document</h4>
                        <p className="text-sm text-gray-600 mt-1">Download to view full bill of materials and specs.</p>
                      </div>
                      <a 
                        href={bidOverviewRes?.product?.document || productResponse?.mainProduct?.document}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Attachment
                      </a>
                    </div>
                  </div>
                )}

                {/* 4. Contact Details (Secure) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight">
                      Buyer Contact
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-center text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-indigo-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">Contact details are protected</h4>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        Buyer's name, phone, email and address will be shared with you once the buyer reviews and accepts your quote.
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-slate-400 pt-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-sm">1</div>
                        <span>Place Quote</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm">2</div>
                        <span>Buyer Reviews</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold text-sm">3</div>
                        <span>Details Shared</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Form */}
              {isMergeQuote ? (
                <MergeBidForm
                  productResponse={productResponse}
                  userProfile={userProfile}
                  navigate={navigate}
                />
              ) : (
                <SellerForm
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  register={register}
                  control={control}
                  userProfile={userProfile}
                  bidOverviewRes={bidOverviewRes}
                  productResponse={productResponse}
                  createBidLoading={createBidLoading}
                  updateUserBidDetsLoading={updateUserBidDetsLoading}
                  soldProduct={soldProduct}
                  watch={watch}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductOverview;

