import { Box, Home, Paperclip, Star, Package, ShieldCheck } from 'lucide-react';
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
import { resolveDocuments } from '@/utils/resolveDocuments';
import { extractQuantityAndUnit, resolveItemQuantity, dedupeSpecification } from '@/utils/parseMaterialText';
import { formatGstPrice } from '@/utils/gstPriceFormat';
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
  if (obj?.brand === 'others' && Object.prototype.hasOwnProperty.call(obj, 'brandName')) {
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
  const localMainProduct = bidOverviewRes ? bidOverviewRes?.product : productResponse?.mainProduct;
  const isMulti = localMainProduct?.isMultiple;
  const rawItems = localMainProduct?.items || [];
  // Document-upload RFQ: seller quotes a single total + file. Upload-mode RFQs
  // are flagged isUpload even though they carry a placeholder item.
  // A document existing (or isUpload being set) never suppresses a real
  // structured items list on its own — only genuinely having zero items
  // means there's nothing to quote per-line, so the seller quotes one
  // total instead. Previously `isUpload` alone forced this branch even
  // when items[] had real entries, hiding per-item pricing entirely for
  // every upload-mode RFQ regardless of its actual content.
  const isDocFlow = rawItems.length === 0 && !!localMainProduct?.document;

  let items = rawItems;
  if (!isDocFlow && rawItems.length === 0 && localMainProduct) {
    items = [{
      itemName: localMainProduct.title || localMainProduct.productName,
      itemDescription: localMainProduct.description,
      quantity: localMainProduct.quantity,
      quantityUnit: localMainProduct.quantityUnit,
      brand: localMainProduct.brand || 'Any',
      subCategoryId: localMainProduct.subCategoryId,
      subCategoryName: localMainProduct.subCategoryName,
      typeOfProduct: localMainProduct.typeOfProduct || localMainProduct.model,
    }];
  }
  const isSingle = !isMulti || items.length <= 1;

  const priceNameFor = idx => (isSingle ? 'unitPrice' : `items.${idx}.unitPrice`);

  // Grand total is PRODUCT-ONLY: sum of qty × unit price. Taxes, freight and
  // other terms are informational and never rolled into the quote value.
  let grandTotal = 0;
  if (isDocFlow) {
    grandTotal = parseFloat(watch('totalQuoteValue')) || 0;
  } else {
    items.forEach((item, idx) => {
      const uPrice = parseFloat(watch(priceNameFor(idx))) || 0;
      const qty = resolveItemQuantity(item);
      grandTotal += uPrice * qty;
    });
  }
  const fmt = n => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // GST treatment must always be explicit on a quoted price -- never a
  // raw number with no indication of whether GST is included or added.
  const gstDisplay = formatGstPrice(grandTotal, watch('taxes'), watch('gstInclusive'));

  const SellerTypeField = (
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
  );

  const PaymentTermsField = (
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
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );

  const TaxesField = (
    <div className="w-full space-y-2">
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
                <SelectItem value="0">No GST / Exempt</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {/* Whether the quoted price above already includes this GST rate,
          or GST is added on top of it -- the price display everywhere
          (comparison, bid history, etc.) depends on this being explicit,
          never assumed. */}
      <Controller
        name="gstInclusive"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={e => field.onChange(e.target.checked)}
              className="w-3.5 h-3.5 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"
            />
            My quoted price already includes GST
          </label>
        )}
      />
    </div>
  );

  const LocationField = (
    <div className="w-full">
      <Label htmlFor="location" className="mb-2 text-sm block">Supplier Location</Label>
      <Input
        type="text"
        placeholder="Supplier Location"
        className="bg-white w-full"
        {...register('location')}
      />
    </div>
  );

  const FreightTermsField = (
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
  );

  const DeliveryTimelineField = (
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
  );

  // Single supplier-wide note, replacing the removed per-item Remarks
  // column -- still the same `buyerNote` field/wire name (no backend
  // change), just re-labeled since it now covers the whole quote rather
  // than being buried per material row.
  const BuyerNoteField = (
    <div className="w-full">
      <Label htmlFor="buyerNote" className="mb-2 text-sm block">Supplier Note</Label>
      <Textarea
        {...register('buyerNote')}
        placeholder="Any notes for the buyer about this quote (hard limit: 300 characters)"
        className="bg-white w-full min-h-[100px] resize-none"
      />
    </div>
  );

  // Quotation-document dropzone — same upload field (registered via RHF as
  // `quoteDocument`, same accept/validation), just enhanced with drag & drop
  // on top of the existing click-to-browse input. Dropped files are pushed
  // into the same hidden input via a DataTransfer so RHF's own change
  // handler fires exactly as it would for a manual file selection.
  const quoteDocReg = register('quoteDocument');
  const quoteDocInputRef = useRef(null);
  const [isQuoteDocDragging, setIsQuoteDocDragging] = useState(false);
  const quoteDocFile = watch('quoteDocument');
  const quoteDocFileName =
    quoteDocFile && quoteDocFile.length ? quoteDocFile[0]?.name : null;

  const handleQuoteDocDragOver = e => {
    e.preventDefault();
    setIsQuoteDocDragging(true);
  };
  const handleQuoteDocDragLeave = e => {
    e.preventDefault();
    setIsQuoteDocDragging(false);
  };
  const handleQuoteDocDrop = e => {
    e.preventDefault();
    setIsQuoteDocDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !quoteDocInputRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    quoteDocInputRef.current.files = dt.files;
    quoteDocReg.onChange({ target: quoteDocInputRef.current });
  };

  return (
    <form
      className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="font-semibold text-orange-600 text-base sm:text-lg">
        Seller Quotation Details
      </h3>

      {/* Row 1: Seller Type | Payment Terms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SellerTypeField}
        {PaymentTermsField}
      </div>

      {isDocFlow ? (
        <>
          {/* Total Quote Value */}
          <div className="w-full">
            <Label className="mb-2 text-sm block">Total Quote Value (₹)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="bg-white w-full"
              {...register('totalQuoteValue', { required: true })}
            />
            {gstDisplay.hasGst && (
              <p className="text-xs text-slate-500 mt-1.5">
                {gstDisplay.primary}
                {gstDisplay.final && <> — Final Amount: <span className="font-bold text-slate-700">{gstDisplay.final}</span></>}
              </p>
            )}
          </div>

          {/* Seller quotation document (pdf / excel) */}
          <div className="w-full">
            <Label className="mb-2 text-sm block">Upload Quotation Document (PDF or Excel)</Label>
            <div
              onClick={() => quoteDocInputRef.current?.click()}
              onDragOver={handleQuoteDocDragOver}
              onDragLeave={handleQuoteDocDragLeave}
              onDrop={handleQuoteDocDrop}
              className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isQuoteDocDragging ? 'bg-orange-50 border-orange-400' : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-orange-300'}`}
            >
              <input
                type="file"
                accept=".pdf,.xls,.xlsx,.csv,.doc,.docx"
                className="hidden"
                name={quoteDocReg.name}
                onBlur={quoteDocReg.onBlur}
                onChange={quoteDocReg.onChange}
                ref={el => {
                  quoteDocReg.ref(el);
                  quoteDocInputRef.current = el;
                }}
              />
              <p className="text-sm font-medium text-slate-600">
                {quoteDocFileName || 'Drag & drop your quotation file, or click to browse'}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">Attach your priced quotation against the buyer's uploaded requirement.</p>
          </div>
        </>
      ) : (
        <>
          {/* SECTION 1 + 2 — a single table, one row per material, instead
              of a repeated quotation form per item. Scales to 100+ items:
              no per-item form chrome, just one row and one register() call
              per editable cell. Read-only columns (Item Name, Spec, Qty,
              Unit, Preferred Brand) come straight from the buyer's RFQ and
              are never editable here; Qty/Unit specifically are locked in
              per the buyer's requirement, not the seller's input. Each row
              is keyed by the item's real productItemId (item._id), never
              by array position — matching what's actually submitted (see
              handleCreteBid below, which keys quoteItems the same way). */}
          <div className="w-full">
            <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-orange-600" />
              List of Materials
              <span className="font-normal text-xs text-slate-500">— {items.length} item(s), enter a price per unit for each</span>
            </h4>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5">Item Name</th>
                      <th className="px-3 py-2.5">Specification</th>
                      <th className="px-3 py-2.5 text-right">Qty</th>
                      <th className="px-3 py-2.5">Unit</th>
                      <th className="px-3 py-2.5">Preferred Brand</th>
                      <th className="px-3 py-2.5 w-32">Price / Unit (₹)</th>
                      <th className="px-3 py-2.5 w-32">Offered Brand</th>
                      <th className="px-3 py-2.5 text-right w-28">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {items.map((item, idx) => {
                      const catObj = localMainProduct?.categoryId || localMainProduct?.category;
                      const resolvedItemName = item.itemName || item.subCategoryName || catObj?.subCategories?.find(s => s._id === item.subCategoryId || s._id === item.subCategoryId?.toString())?.name || 'Item ' + (idx + 1);
                      const rawDescription = item.itemDescription || item.description || item.typeOfProduct || item.model || '';
                      // Some items have their real quantity/unit typed into
                      // the description with Quantity left blank. Never
                      // trust a silently-defaulted qty of 1 for pricing
                      // when the real value is recoverable from the text.
                      const parsedFromDesc = !item.quantity ? extractQuantityAndUnit(rawDescription) : null;
                      const rawSpec = parsedFromDesc ? parsedFromDesc.cleanedText : rawDescription;
                      // Specification must hold technical spec only, never
                      // a restatement of the item name -- word-overlap
                      // check, not just an exact-string match, since
                      // typeOfProduct/model often near-duplicate the name
                      // (e.g. Name "TMT Bars" / Spec "TMT Reinforcement
                      // Bars" -- not identical strings, but 2 of 3 words
                      // are just the name repeated).
                      const specification = dedupeSpecification(resolvedItemName, rawSpec) || '—';
                      const qty = resolveItemQuantity(item);
                      // The buyer's RFQ unit is the source of truth
                      // throughout the quotation lifecycle. When Quantity
                      // was left blank and the real qty+unit were typed
                      // into the free-text field instead, quantityUnit is
                      // just a leftover placeholder/default (e.g. "pcs")
                      // -- the parsed unit from that same text must win,
                      // or a supplier is shown the wrong unit to price
                      // against (e.g. quoting per PCS when the buyer
                      // actually asked for MT).
                      const unit = parsedFromDesc ? parsedFromDesc.unit : (item.quantityUnit || '');
                      const uPrice = parseFloat(watch(priceNameFor(idx))) || 0;
                      const lineTotal = qty * uPrice;

                      return (
                        <tr key={item._id || idx} className="align-top hover:bg-slate-50/60 transition-colors">
                          <td className="px-3 py-2.5 text-sm font-bold text-slate-800 max-w-[160px] break-words">{resolvedItemName}</td>
                          <td className="px-3 py-2.5 text-sm text-slate-600 max-w-[200px] break-words">{specification}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-slate-700 text-right whitespace-nowrap">{qty}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-slate-700 uppercase whitespace-nowrap">{unit}</td>
                          <td className="px-3 py-2.5 text-sm text-slate-600 max-w-[140px] break-words">{item.brand || 'Any'}</td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="h-9 border-slate-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all font-medium bg-white text-right w-28"
                              {...register(priceNameFor(idx), { required: true })}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="text"
                              placeholder="e.g., UltraTech"
                              className="h-9 border-slate-200 bg-white w-32"
                              {...register(`items.${idx}.offeredBrand`)}
                            />
                          </td>
                          <td className="px-3 py-2.5 text-sm font-bold text-orange-600 text-right whitespace-nowrap">₹ {fmt(lineTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 3 — one summary block after the entire table (not
              per-item), with the Grand Total called out prominently. */}
          <div className="border border-orange-100 rounded-lg bg-orange-50/40 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="font-bold text-slate-800">Grand Total (product only)</span>
              <div className="text-right">
                <div className="font-extrabold text-xl text-orange-600">{gstDisplay.primary}</div>
                {gstDisplay.final && (
                  <div className="text-xs text-slate-500 mt-0.5">Final Amount: <span className="font-bold text-slate-700">{gstDisplay.final}</span></div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TaxesField}
              {LocationField}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FreightTermsField}
              {DeliveryTimelineField}
            </div>
            {BuyerNoteField}
          </div>
        </>
      )}

      {isDocFlow && (
        <>
          {/* Taxes | Supplier Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TaxesField}
            {LocationField}
          </div>

          {/* Document-upload flow keeps Delivery before Freight, matching
              the order the buyer's own document-upload form uses. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DeliveryTimelineField}
            {FreightTermsField}
          </div>

          {/* Buyer Note */}
          {BuyerNoteField}
        </>
      )}

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
    fn: createBidFn,
    data: createBidRes,
    loading: createBidLoading,
  } = useFetch(bidService.createBid);
  const {
    fn: getBidActivityFn,
    data: bidActivityRes,
  } = useFetch(bidService.getBidActivity);
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
      totalQuoteValue: '',
      quoteDocument: undefined,
      earliestDeliveryDate: undefined,
      sellerType: '',
      taxes: '',
      gstInclusive: false,
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
        getBidActivityFn(productId);
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
    const isGstRequired = !!mainProductData?.paymentAndDelivery?.gstNumber;
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/; // 22AAAAA0000A1Z5

    if (isGstRequired) {
      if (businessType !== 'business') {
        toast.error('This RFQ requires GST. You must quote as a Business.');
        return;
      }
      if (!businessDets.company_name?.trim()) {
        toast.error('Company Name is required');
        return;
      }
      if (!businessDets.gst_num?.trim()) {
        toast.error('GSTIN is required');
        return;
      }
      if (!gstRegex.test(businessDets.gst_num.trim())) {
        toast.error('Invalid GSTIN Number format');
        return;
      }
    } else if (businessType === 'business') {
      if (!businessDets.company_name?.trim()) {
        toast.error('Company Name is required');
        return;
      }
      if (businessDets.gst_num && !gstRegex.test(businessDets.gst_num.trim())) {
        toast.error('Invalid GSTIN Number format');
        return;
      }
    }

    if (!productResponse) return;
    if (productResponse?.mainProduct?.userId?._id === userProfile?.user?._id) return;
    const buyerId = productResponse?.mainProduct.userId?._id;
    const productId = productResponse?.mainProduct._id;

    if (productId?.startsWith('prod_mock_')) {
      toast.info('Submitting quotes is disabled for demo mock products. Please create a real product to test quoting.');
      return;
    }

    const mainP = productResponse?.mainProduct || bidOverviewRes?.product;
    const rawItems = mainP?.items || [];
    const isMulti = mainP?.isMultiple;
    // See the matching comment in SellerForm — a document (or isUpload)
    // alone must never suppress a real per-item breakdown.
    const isDocFlow = rawItems.length === 0 && !!mainP?.document;

    // Quote value is PRODUCT-ONLY: sum of qty × unit price (or the seller's
    // stated total for document-upload RFQs). Taxes/freight are never added.
    // This total is still computed here for the client-side sanity check
    // below ("did the seller enter a real number") — it is NOT trusted as
    // the source of truth once `items[]` is sent; the server recomputes it
    // from the per-item unit prices against the real Product.items[]
    // quantities, so a client-side bug or tampering here can't produce a
    // mismatched total server-side.
    let budgetQuation = 0;
    // Per-material quote lines — only meaningful for a real multi-item RFQ
    // (isMulti && more than one actual item). A single-item or
    // synthetic-single-item RFQ has no productItemId to attach a line to,
    // so it keeps using the plain lump-sum budgetQuation fallback.
    let quoteItems = null;
    if (isDocFlow) {
      budgetQuation = parseFloat(getValues('totalQuoteValue')) || 0;
    } else if (isMulti && rawItems.length > 1) {
      quoteItems = [];
      rawItems.forEach((item, idx) => {
        const itemValues = getValues().items?.[idx] || {};
        const uPrice = parseFloat(itemValues.unitPrice) || 0;
        const qty = resolveItemQuantity(item);
        budgetQuation += uPrice * qty;
        if (item._id) {
          quoteItems.push({
            productItemId: item._id,
            unitPrice: uPrice,
            offeredBrand: itemValues.offeredBrand || '',
          });
        }
      });
    } else {
      const uPrice = parseFloat(getValues('unitPrice')) || 0;
      const qty = Number(mainP?.quantity) || 1;
      budgetQuation = uPrice * qty;
    }

    if (!budgetQuation || budgetQuation <= 0) {
      toast.error('Please enter a valid quote amount');
      return;
    }

    const values = getValues();
    const fileList = values.quoteDocument;
    const file = fileList && fileList.length ? fileList[0] : null;

    const baseFields = {
      budgetQuation,
      status: 'active',
      sellerType: values.sellerType || '',
      taxes: values.taxes || '',
      gstInclusive: !!values.gstInclusive,
      location: values.location || '',
      freightTerms: values.freightTerms || '',
      paymentTerms: values.paymentTerms || '',
      buyerNote: values.buyerNote || '',
      businessType,
    };
    if (values.earliestDeliveryDate) {
      baseFields.earliestDeliveryDate =
        values.earliestDeliveryDate instanceof Date
          ? values.earliestDeliveryDate.toISOString()
          : values.earliestDeliveryDate;
    }

    let payload;
    if (file) {
      // Document-upload flow: multipart so the quotation file reaches the server.
      payload = new FormData();
      Object.entries(baseFields).forEach(([k, v]) => {
        if (v !== undefined && v !== null) payload.append(k, v);
      });
      if (businessType === 'business' && businessDets) {
        payload.append('businessDets', JSON.stringify(businessDets));
      }
      if (quoteItems && quoteItems.length > 0) {
        payload.append('items', JSON.stringify(quoteItems));
      }
      payload.append('quoteDocument', file);
    } else {
      payload = {
        ...baseFields,
        ...(businessType === 'business' && { businessDets }),
        ...(quoteItems && quoteItems.length > 0 && { items: quoteItems }),
      };
    }

    if (!businessType) {
      toast.error('business is required !');
      setSellerVerification(true);
    }
    try {
      await createBidFn(buyerId, productId, payload);
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
    const mainP = productResponse?.mainProduct || bidOverviewRes?.product;
    const rawItems = mainP?.items || [];
    const isMulti = mainP?.isMultiple;
    // See the matching comment in SellerForm — a document (or isUpload)
    // alone must never suppress a real per-item breakdown.
    const isDocFlow = rawItems.length === 0 && !!mainP?.document;

    if (isDocFlow) {
      // Document-upload RFQ: seller quotes a single total instead of unit prices.
      if (!getValues('totalQuoteValue') || Number(getValues('totalQuoteValue')) <= 0) {
        return toast.error('Total Quote Value is required and must be positive');
      }
    } else if (!isMulti && (!data.unitPrice || Number(data.unitPrice) <= 0)) {
      return toast.error('Unit Price is required and must be positive');
    } else if (isMulti && data.items) {
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
        getBidActivityFn(productId);
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

  // The RFQ detail view above (spec, delivery, masked buyer) is shown
  // identically to whoever opens this page — buyer or supplier. What differs
  // is what happens at the "quote" moment: a buyer viewing their OWN
  // requirement doesn't quote — they manage the quotes they've received, so
  // they get routed to the real action page (RequirementOverview) instead of
  // a form they can't submit. Resolves productId -> requirementId (same
  // lookup already used for Notification/CloseDeal navigation this session).
  const [resolvingRequirement, setResolvingRequirement] = useState(false);
  const handleGoToActionPage = async () => {
    const pid = bidOverviewRes ? bidOverviewRes?.product?._id : productResponse?.mainProduct?._id;
    if (!pid) return;
    setResolvingRequirement(true);
    try {
      const requirementId = await requirementService.getRequirementId(pid);
      if (!requirementId) throw new Error('not found');
      navigate('/account/requirements-overview/' + requirementId);
    } catch (err) {
      toast.error('Could not open your quotes for this requirement.');
    } finally {
      setResolvingRequirement(false);
    }
  };

  // "Total Quote : N" — the owner goes to their action page (same as the
  // sticky bar); anyone else goes to the dedicated Bid History page (eBay-style
  // bid-activity table — the reference the user asked to match), universal for
  // every viewing supplier rather than an in-page sheet.
  const [quoteSheetOpen, setQuoteSheetOpen] = useState(false);
  const handleBidView = () => {
    const pid = bidOverviewRes ? bidOverviewRes?.product?._id : productResponse?.mainProduct?._id;
    if (isMe) {
      handleGoToActionPage();
    } else if (pid) {
      navigate('/bid-history/' + pid);
    }
  };

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
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      let label;
      if (days >= 2) label = `${days} days`;
      else if (days === 1) label = `1 day ${hours}h`;
      else if (hours >= 1) label = `${hours}h ${String(minutes).padStart(2,'0')}m`;
      else label = `${minutes}m ${String(seconds).padStart(2,'0')}s`;
      setTimeLeft(label);
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
  const hasItems = (mainProductData?.items || []).length > 0;
  const isGstRequired = !!mainProductData?.paymentAndDelivery?.gstNumber;
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

  const subCatId = mainProductData?.subCategoryId || mainProductData?.subCategory || mainProductData?.items?.[0]?.subCategoryId;
  let subCategoryName = typeof subCatId === 'object' ? subCatId?.name : (mainProductData?.items?.[0]?.subCategoryName || undefined);
  if (!subCategoryName && subCatId) {
    const catObj = mainProductData?.categoryId || mainProductData?.category;
    if (catObj?.subCategories) {
      const matchedSub = catObj.subCategories.find(
        s => s._id === subCatId || s._id === subCatId.toString()
      );
      if (matchedSub) subCategoryName = matchedSub.name;
    }
  }

  return (
    <>
      {bidOverLoading || productViewLoading ? (
        <div className="max-w-[1600px] mx-auto p-4">
          <CategoryFormSkeleton />
        </div>
      ) : (
        <div className="w-full max-w-[1600px] mx-auto p-4 min-h-screen">
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
            isGstRequired={isGstRequired}
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
                      <Button
                        variant="ghost"
                        className="float-end border rounded-full hover:bg-orange-700 hover:text-white text-sm bg-orange-700 text-white pointer-events-none"
                      >
                        Valid for: {timeLeft}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="float-end border rounded-full hover:bg-orange-700 hover:text-white text-sm bg-orange-700 text-white pointer-events-none"
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
                    <span className="text-[13px] font-semibold text-slate-800 line-clamp-1 capitalize">
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
                        (bidOverviewRes
                          ? bidOverviewRes.product?.totalBidCount
                          : productResponse?.mainProduct?.totalBidCount) === 0
                      }
                      onClick={handleBidView}
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
                  
                  {/* Requested Items / List of Materials — the uploaded
                      reference document (rendered unconditionally in the
                      "Attached Reference Documents" section further below)
                      is supporting documentation only. It must never
                      replace this structured list; whenever real materials
                      exist, show them, regardless of how the RFQ was
                      created (typed in, or alongside an uploaded document). */}
                  {(() => {
                    const mp = bidOverviewRes?.product || productResponse?.mainProduct;
                    const rawItems = mp?.items || [];
                    if (rawItems.length === 0) {
                      // Genuinely nothing structured to show (e.g. a bare
                      // document-only submission with no items ever filled
                      // in) — the reference-document section below still
                      // covers the actual file.
                      return null;
                    }
                    return (
                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">List of Materials</h3>
                        <span className="text-sm font-medium text-gray-500">{rawItems.length} items</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                              <th className="px-5 py-3 font-semibold">Item Name</th>
                              <th className="px-5 py-3 font-semibold">Description / Specs</th>
                              <th className="px-5 py-3 font-semibold">Quantity</th>
                              <th className="px-5 py-3 font-semibold">Units</th>
                              <th className="px-5 py-3 font-semibold">Brand</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {rawItems.map((item, idx) => {
                              const catObj = mp?.categoryId || mp?.category;
                              const resolvedName = item.itemName || item.subCategoryName || catObj?.subCategories?.find(s => s._id === item.subCategoryId || s._id === item.subCategoryId?.toString())?.name || 'Item ' + (idx + 1);
                              const rawDescription = item.itemDescription || item.description || item.typeOfProduct || item.model || '';
                              // Some materials were entered with the real
                              // quantity/unit typed into the free-text
                              // description instead of the dedicated
                              // fields (e.g. "TMT Reinforcement Bars - 2
                              // MT" with Quantity left blank). This is a
                              // display-only fallback -- it never mutates
                              // the stored record, only fills in what's
                              // missing for this render.
                              const parsed = !item.quantity ? extractQuantityAndUnit(rawDescription) : null;
                              const cleanedDescription = parsed ? parsed.cleanedText : rawDescription;
                              // Specification must never restatement the
                              // Item Name -- word-overlap check, not an
                              // exact-string match (see dedupeSpecification).
                              const displayDescription = dedupeSpecification(resolvedName, cleanedDescription) || 'N/A';
                              const displayQuantity = item.quantity || parsed?.quantity || '';
                              // The buyer's RFQ unit is the source of
                              // truth -- when a qty+unit was recovered
                              // from free text (only happens when
                              // Quantity was left blank), that parsed
                              // unit wins over a stale quantityUnit
                              // placeholder (e.g. "pcs").
                              const displayUnit = parsed ? parsed.unit : (item.quantityUnit || '');
                              return (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4 text-sm font-bold text-gray-900">{resolvedName}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{displayDescription}</td>
                                <td className="px-5 py-4 text-sm font-black text-orange-600">{displayQuantity}</td>
                                <td className="px-5 py-4 text-sm font-bold text-gray-500 uppercase">{displayUnit}</td>
                                <td className="px-5 py-4 text-sm text-gray-600">{item.brand || "Any"}</td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    );
                  })()}

                  <div className="text-[15px] space-y-1 text-slate-600 font-medium">
                    {!hasItems && (
                      <>
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
                      </>
                    )}
                    {(bidOverviewRes?.product?.minimumBudget || productResponse?.mainProduct?.minimumBudget) && (
                      <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                        <span className="font-semibold">Budget:</span>
                        {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.minimumBudget : productResponse?.mainProduct?.minimumBudget)}
                      </p>
                    )}
                  </div>

                  {/* Additional Information block moved to the top */}

                  {/* Attachments Section */}
                  {(() => {
                    const mp = bidOverviewRes?.product || productResponse?.mainProduct;
                    const urls = resolveDocuments(mp?.document);
                    if (urls.length === 0) return null;
                    return (
                      <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                        <h4 className="font-semibold text-slate-800 mb-2">Attached Reference Documents ({urls.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {urls.map((url, idx) => {
                            const name = url.split('/').pop() || `Document ${idx + 1}`;
                            const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
                            return (
                              <div key={idx} className="border border-slate-200 bg-slate-50/50 rounded-lg p-4 flex items-center justify-between shadow-xs hover:border-orange-200 transition-colors">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <span className="text-2xl shrink-0">{isImg ? '🖼️' : '📄'}</span>
                                  <div className="overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">{name}</p>
                                    <p className="text-[10px] text-slate-400 capitalize">Reference File {idx + 1}</p>
                                  </div>
                                </div>
                                <a 
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm shrink-0"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  Download
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
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
                        (bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.organizationAddress : productResponse?.mainProduct?.paymentAndDelivery?.organizationAddress) ||
                        (bidOverviewRes ? bidOverviewRes?.buyer?.address : productResponse?.mainProduct?.userId?.address) ||
                        "N/A"
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
                    {(() => {
                      const pm = bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery : productResponse?.mainProduct?.paymentAndDelivery;
                      return (
                        <>
                          {pm?.organizationName && (
                            <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100">
                              <span className="font-semibold">Organization Name:</span>
                              <span className="font-medium text-slate-800">{maskName(pm.organizationName)}</span>
                            </p>
                          )}
                          {pm?.gstNumber && (
                            <p className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 border-b border-slate-100 uppercase">
                              <span className="font-semibold">GSTIN:</span>
                              <span className="font-mono text-[13px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">
                                {pm.gstNumber.trim().length > 5 
                                  ? pm.gstNumber.trim().slice(0, 2) + '*'.repeat(pm.gstNumber.trim().length - 5) + pm.gstNumber.trim().slice(-3) 
                                  : '*************'}
                              </span>
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>



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
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-sm">2</div>
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
              {/* Bottom Section: role-based action */}
              {/* Spacer so content clears the sticky bar AND the mobile bottom nav */}
              <div className="pb-40 sm:pb-24"></div>

              {isMe ? (
                /* Buyer viewing their OWN requirement — they don't quote here,
                   they manage the quotes they've received. Route them to the
                   real action page instead of a form they can't submit. */
                <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] flex justify-between items-center z-40 md:px-10 lg:px-20">
                  <div className="hidden sm:block">
                    <h3 className="font-bold text-slate-800 text-lg">This is your requirement</h3>
                    <p className="text-sm text-slate-500">Review, shortlist, and chat with the suppliers who've quoted.</p>
                  </div>
                  <Button
                    onClick={handleGoToActionPage}
                    disabled={resolvingRequirement}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                  >
                    {resolvingRequirement ? <Spinner className="w-5 h-5 animate-spin" /> : 'View & Manage Quotes'}
                  </Button>
                </div>
              ) : (
                <Sheet open={quoteSheetOpen} onOpenChange={setQuoteSheetOpen}>
                  {/* On mobile the CTA sits ABOVE the bottom nav (bottom-16); flush on desktop */}
                  <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] flex justify-between items-center z-40 md:px-10 lg:px-20">
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

                  <SheetContent side="right" className="w-full sm:!max-w-[70vw] sm:!w-[70vw] lg:!max-w-[50vw] lg:!w-[50vw] overflow-y-auto bg-slate-50 p-0 border-l-0 sm:border-l">
                    <SheetHeader className="p-8 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                      <SheetTitle className="text-3xl font-extrabold text-slate-800">Submit Quotation</SheetTitle>
                    </SheetHeader>
                    <div className="p-4 sm:p-8 lg:p-10 pb-24 space-y-6">
                      {bidActivityRes?.total > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const pid = bidOverviewRes ? bidOverviewRes?.product?._id : productResponse?.mainProduct?._id;
                            if (pid) navigate('/bid-history/' + pid);
                          }}
                          className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-left hover:border-orange-300 transition-colors"
                        >
                          <span className="text-sm font-semibold text-slate-700">
                            {bidActivityRes.total} quote{bidActivityRes.total > 1 ? 's' : ''} submitted so far
                          </span>
                          <span className="text-sm text-orange-600 font-bold underline">View bid history</span>
                        </button>
                      )}

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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductOverview;

