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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
      className="w-full bg-gray-200/80 rounded-lg p-6 space-y-4 my-auto h-fit"
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
      className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-6"
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
                {/* Header Row for Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-slate-50 text-xs font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <div className="col-span-3">Item Name</div>
                  <div className="col-span-3">Description / Specs</div>
                  <div className="col-span-2">Qty & Units</div>
                  <div className="col-span-2">Brand</div>
                  <div className="col-span-2">Unit Price (₹)</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((item, idx) => {
                    const resolvedItemName = item.itemName || item.subCategoryName || mainProductData?.categoryId?.subCategories?.find(s => s._id === item.subCategoryId || s._id === item.subCategoryId?.toString())?.name || 'Item ' + (idx + 1);
                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center bg-white p-4 hover:bg-orange-50/20 transition-colors">
                        <div className="md:col-span-3">
                          <label className="block md:hidden text-xs font-extrabold text-slate-500 mb-1">Item Name</label>
                          <div className="text-sm font-bold text-slate-800 bg-slate-50/80 md:bg-transparent border border-slate-100 md:border-transparent rounded-md px-3 py-2 md:p-0 min-h-[36px] flex items-center">{resolvedItemName}</div>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block md:hidden text-xs font-extrabold text-slate-500 mb-1">Description / Specs</label>
                          <div className="text-sm text-slate-600 bg-slate-50/80 md:bg-transparent border border-slate-100 md:border-transparent rounded-md px-3 py-2 md:p-0 min-h-[36px] flex items-center">{item.itemDescription || item.typeOfProduct || item.model || 'N/A'}</div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block md:hidden text-xs font-extrabold text-slate-500 mb-1">Qty & Units</label>
                          <div className="text-sm font-semibold text-slate-700 bg-slate-50/80 md:bg-transparent border border-slate-100 md:border-transparent rounded-md px-3 py-2 md:p-0 min-h-[36px] flex items-center">{item.quantity || 1} <span className="uppercase text-slate-500 text-xs ml-1">{item.quantityUnit || 'pcs'}</span></div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block md:hidden text-xs font-extrabold text-slate-500 mb-1">Brand</label>
                          <div className="text-sm text-slate-600 bg-slate-50/80 md:bg-transparent border border-slate-100 md:border-transparent rounded-md px-3 py-2 md:p-0 min-h-[36px] flex items-center">{item.brand || 'Any'}</div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block md:hidden text-xs font-extrabold text-slate-500 mb-1">Unit Price (₹)</label>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9 border-slate-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all font-medium bg-white" {...register(`items.${idx}.unitPrice`, { required: true })} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-100 bg-slate-50">
                  <div>
                    <Label className="mb-1.5 text-xs text-slate-500">Global Discount (%)</Label>
                    <Input type="number" step="0.1" min="0" max="100" placeholder="0%" className="h-9 bg-white" {...register('discount')} />
                  </div>
                  <div>
                    <Label className="mb-1.5 text-xs text-slate-500">Total Freight Cost (₹)</Label>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-9 bg-white" {...register('freightCost')} />
                  </div>
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
          const globalDisc = parseFloat(watch('discount')) || 0;
          totalFreight = parseFloat(watch('freightCost')) || 0;
          items.forEach((item, idx) => {
            const uPrice = parseFloat(watch(`items.${idx}.unitPrice`)) || 0;
            const qty = item.quantity || 1;
            subtotal += (uPrice * (1 - globalDisc/100)) * qty;
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

    const isMulti = productResponse?.mainProduct?.isMultiple || bidOverviewRes?.product?.isMultiple;
    const items = productResponse?.mainProduct?.items || [];
    const tRate = parseFloat(getValues('taxes')) || 0;
    
    let subtotal = 0;
    let totalFreight = 0;
    
    if (isMulti && items.length > 1) {
      const globalDisc = parseFloat(getValues('discount')) || 0;
      totalFreight = parseFloat(getValues('freightCost')) || 0;
      items.forEach((item, idx) => {
        const formValues = getValues();
        const uPrice = parseFloat(formValues.items?.[idx]?.unitPrice) || 0;
        const qty = item.quantity || 1;
        subtotal += (uPrice * (1 - globalDisc/100)) * qty;
      });
    } else {
      const uPrice = parseFloat(getValues('unitPrice')) || 0;
      const disc = parseFloat(getValues('discount')) || 0;
      totalFreight = parseFloat(getValues('freightCost')) || 0;
      const qty = productResponse?.mainProduct?.quantity || 1;
      subtotal = (uPrice * (1 - disc/100)) * qty;
    }
    
    const taxAmount = (subtotal + totalFreight) * (tRate/100);
    const budgetQuation = subtotal + totalFreight + taxAmount;

    let obj = {
      ...getValues(),
      budgetQuation,
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
    const isMulti = productResponse?.mainProduct?.isMultiple || bidOverviewRes?.product?.isMultiple;
    if (!isMulti && (!data.unitPrice || Number(data.unitPrice) <= 0)) {
      return toast.error('Unit Price is required and must be positive');
    }
    if (isMulti && data.items) {
      for (let i = 0; i < data.items.length; i++) {
        if (!data.items[i].unitPrice || Number(data.items[i].unitPrice) <= 0) {
          return toast.error(`Unit Price is required for Item ${i + 1}`);
        }
      }
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
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    if (!soldProduct) {
      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [productResponse, bidOverviewRes]);

  const mainProductData = bidOverviewRes ? bidOverviewRes?.product : productResponse?.mainProduct;
  const buyerUser = mainProductData?.userId || mainProductData?.buyerId || mainProductData?.buyer || {};
  const orgName = mainProductData?.paymentAndDelivery?.organizationName;
  const bizName = buyerUser?.businessName || buyerUser?.companyName;
  const fullName = buyerUser?.firstName ? `${buyerUser.firstName} ${buyerUser.lastName || ''}`.trim() : null;
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
  
  const pId = mainProductData?._id;
  const rfqCode = mainProductData?.rfqId || (pId ? `RFQ-${pId.toString().slice(-6).toUpperCase()}` : null);

  const subCatId = mainProductData?.subCategoryId;
  let subCategoryName = subCatId?.name;
  if (!subCategoryName && mainProductData?.categoryId?.subCategories && subCatId) {
    const matchedSub = mainProductData.categoryId.subCategories.find(
      s => s._id === subCatId || s._id === subCatId.toString()
    );
    if (matchedSub) subCategoryName = matchedSub.name;
  }

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
                    Posted Date :{' '}
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
                      <div className="float-end flex items-center gap-2">
                        <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Valid upto</span>
                        <Button
                          variant="ghost"
                          className="border rounded-full hover:bg-orange-700 hover:text-white text-sm bg-orange-700 text-white"
                        >
                          {timeLeft}
                        </Button>
                      </div>
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
                  {mainProductData?.title}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4 mt-4 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Buyer</span>
                    <span className="text-[13px] font-semibold text-slate-700 line-clamp-1">{buyerName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Category</span>
                    <span className="text-[13px] font-semibold text-orange-600 line-clamp-1 capitalize">
                      {mainProductData?.categoryId?.categoryName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Sub Category</span>
                    <span className="text-[13px] font-semibold text-slate-700 line-clamp-1 capitalize">
                      {subCategoryName || "N/A"}
                    </span>
                  </div>
                  {rfqCode && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">RFQ ID</span>
                      <span className="text-[13px] font-semibold text-slate-700 line-clamp-1">{rfqCode}</span>
                    </div>
                  )}
                </div>

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
            <div className="w-full flex flex-col gap-10 mt-8">
              {/* Top Section: Requirement Specifications */}
              <div className="w-full space-y-6">
                
                {/* 1. Requirement Specifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight border-b border-slate-100 pb-4">
                    Requirement Specifications
                  </h3>
                  
                  {/* General Specifications Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                    {/* Dynamic Fields */}
                    {(() => {
                      const prod = bidOverviewRes ? bidOverviewRes?.product : productResponse?.mainProduct;
                      if (!prod) return null;
                      return (
                        <>
                          {prod.brand && (
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">Brand</p>
                              <p className="text-[15px] font-bold text-slate-800">{prod.brand === 'others' ? prod.brandName : prod.brand}</p>
                            </div>
                          )}
                          {!prod.isMultiple && prod.quantity && (
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">Quantity</p>
                              <p className="text-[15px] font-bold text-slate-800">{prod.quantity} {prod.quantityUnit}</p>
                            </div>
                          )}
                          {prod.fuelType && (
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">Fuel Type</p>
                              <p className="text-[15px] font-bold text-slate-800 capitalize">{prod.fuelType}</p>
                            </div>
                          )}
                          {prod.transmission && (
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">Transmission</p>
                              <p className="text-[15px] font-bold text-slate-800 capitalize">{prod.transmission}</p>
                            </div>
                          )}
                          {prod.conditionOfProduct && (
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">Condition</p>
                              <p className="text-[15px] font-bold text-slate-800 capitalize">{prod.conditionOfProduct.replace('_', ' ')}</p>
                            </div>
                          )}
                          {prod.typeOfProduct && !prod.isMultiple && (
                            <div>
                              <p className="text-sm font-semibold text-slate-500 mb-1">Model / Type</p>
                              <p className="text-[15px] font-bold text-slate-800">{prod.typeOfProduct || prod.model}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Requested Items (Moved Here) */}
                  {(bidOverviewRes?.product?.isMultiple || productResponse?.mainProduct?.isMultiple) && (
                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">Requested Items</h3>
                        <span className="text-sm font-medium text-gray-500">{(bidOverviewRes?.product?.items || productResponse?.mainProduct?.items || []).length} items</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                              <th className="px-5 py-3 font-semibold">Item Name</th>
                              <th className="px-5 py-3 font-semibold">Brand</th>
                              <th className="px-5 py-3 font-semibold">Model/Type</th>
                              <th className="px-5 py-3 font-semibold text-right">Required Qty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {(bidOverviewRes?.product?.items || productResponse?.mainProduct?.items || []).map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4 text-sm font-bold text-gray-900">{item.itemName || item.subCategoryName || "Item " + (idx + 1)}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{item.brand || "N/A"}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{item.typeOfProduct || item.model || "N/A"}</td>
                                <td className="px-5 py-4 text-right">
                                  <span className="font-black text-orange-600 text-base">{item.quantity}</span>
                                  <span className="text-xs font-bold text-gray-500 ml-1">{item.quantityUnit}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="text-[15px] space-y-1 text-slate-600 font-medium">
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Category:</span>
                      {mainProductData?.categoryId?.categoryName || "N/A"}
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 capitalize">
                      <span className="font-semibold">Sub Category:</span>
                      {subCategoryName || "N/A"}
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
                  
                  {/* Other Terms */}
                  {(bidOverviewRes?.product?.otherTerms || productResponse?.mainProduct?.otherTerms) && (
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <h4 className="font-semibold text-slate-800 mb-2">Other Terms & Conditions</h4>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {bidOverviewRes ? bidOverviewRes?.product?.otherTerms : productResponse?.mainProduct?.otherTerms}
                      </div>
                    </div>
                  )}
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
              {/* Bottom Section: Quotation Form */}
              {/* Bottom Sticky Action Bar + Drawer for Quotation Form */}
              <div className="pb-24"></div> {/* padding to ensure content isn't hidden by sticky bar */}
              <Sheet>
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] flex justify-between items-center z-50 md:px-10 lg:px-20">
                  <div className="hidden sm:block">
                    <h3 className="font-bold text-slate-800 text-lg">Ready to place a quote?</h3>
                    <p className="text-sm text-slate-500">Provide your best price and win this requirement.</p>
                  </div>
                  <SheetTrigger asChild>
                    <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                      Place Quote Now
                    </Button>
                  </SheetTrigger>
                </div>
                
                <SheetContent side="right" className="w-full sm:!max-w-[600px] lg:!max-w-[45vw] lg:!w-[45vw] xl:!max-w-[40vw] xl:!w-[40vw] overflow-y-auto bg-slate-50 p-0 border-l-0 sm:border-l">
                  <SheetHeader className="p-8 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                    <SheetTitle className="text-3xl font-extrabold text-slate-800">Submit Quotation</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 sm:p-8 lg:p-10 pb-24">
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
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductOverview;

