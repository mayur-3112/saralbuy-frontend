import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MoveLeft, CloudUpload, X, XIcon, File, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/lib/DatePicker';
import { Range } from 'react-range';
import { CategoryFormSchema } from '@/validations/Schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useFetch } from '@/hooks/useFetch';
import categoryService from '@/services/category.service';
import productService from '@/services/product.service';
import { useUserState } from '@/redux/hooks/useUser';
import { SearchableDropdown } from '@/lib/SearchableDropdown';
import {
  electronicCategories,
  constructionIndustrialCategories,
  fashionCategories,
  furnitureCategories,
  homeAppliancesCategories,
  beautyCategories,
  sportCategories,
  vehicleCategories,
  serviceCategories,
  otherCategories,
} from '@/const/categoriesData';
import { getCategorySpecificFields } from '@/const/categoriesFormdataFields';
import Authentication from '@/components/custom/auth/Authenticate';
import TooltipComp from '@/lib/TooltipComp';
import { Spinner } from '@/components/ui/spinner';
import { CategoryFormSkeleton } from '@/const/CustomSkeletons';
import PlaceRequirementPopup from '@/components/custom/popups/PlaceRequirementPopup';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import { innerFormImages } from './CreateProductForm';
// const innerFormImages = {
//   automobile: 'automobileFormImage.png',
//   fashion: 'fashionFormImage.png',
//   electronics: 'electronicsFormImage.png',
//   home: 'homeapplianceFormImage.png',
//   sports: 'sportsFormImage.png',
//   furniture: 'furnitureFormImage.png',
//   health: 'healthFormImage.png',
//   beauty: 'beautyFormImage.png',
//   service: 'servicesFormImage.png',
//   industrial: 'constructionFormImage.png',
//   others: 'otherImage.webp',
// };

function getSubCategories(categoryName) {
  switch (categoryName) {
    case 'automobile':
      return vehicleCategories;
    case 'fashion':
      return fashionCategories;
    case 'electronics':
      return electronicCategories;
    case 'home':
      return homeAppliancesCategories;
    case 'sports':
      return sportCategories;
    case 'furniture':
      return furnitureCategories;
    case 'beauty':
      return beautyCategories;
    case 'industrial':
      return constructionIndustrialCategories;
    case 'service':
      return serviceCategories;
    case 'others':
      return otherCategories;
    default:
      return [];
  }
}

// ─── CategoryForm (same pattern as CreateProductForm) ────────────────────────
const CategoryForm = ({
  currentCategoryName,
  catByIdData,
  subCategroies,
  subCategoriesData,
  subCategoryId,
  register,
  watch,
  setValue,
  image,
  setImage,
  fileDoc,
  setFileDoc,
  initialData,
  quantityUnit,
  setQuantityUnit,
  quantityValue,
  setQuantityValue,
  categoryId
}) => {
  console.log('INITIAL STATE OF UPDATE PRODUCT FORM------->', initialData);
  const [values, setValues] = useState([
    parseFloat(initialData?.oldProductValue?.min || '0'),
    parseFloat(initialData?.oldProductValue?.max || '2'),
  ]);
  const [date, setDate] = useState(
    initialData?.paymentAndDelivery?.ex_deliveryDate
      ? new Date(initialData.paymentAndDelivery.ex_deliveryDate)
      : undefined
  );
  const [brand, setbrand] = useState(initialData?.brand || '');
  const [brandRenderItems, setBrandRenderItems] = useState([]);
  const [subCatgoryName, setSubcategoryName] = useState('');
  const imageRef = useRef(null);
  const fileDocRef = useRef(null);
  const navigate = useNavigate();
  const gstField = watch('gst_requirement');
  const productField = watch('productType');
  const selectedSubCategoryId = watch('subCategoryId');
  const paymentMode = watch('paymentAndDelivery.paymentMode');
  const genderValue = watch('gender');
  const fuelTypeValue = watch('fuelType');
  const colorValue = watch('color');
  const transmissionValue = watch('transmission');
  const conditionOfProductValue = watch('conditionOfProduct');
  const toolTypeValue = watch('toolType');
  const rateAServiceValue = watch('rateAService');

  useEffect(() => {
    setValue('oldProductValue.min', values[0].toString());
    setValue('oldProductValue.max', values[1].toString());
  }, [values, setValue]);

  useEffect(() => {
    setValue('brand', brand);
  }, [brand, setValue]);

  useEffect(() => {
    if (brand !== 'others') setValue('brandName', '');
    else if (initialData?.brandName) setValue('brandName', initialData.brandName);
  }, [brand]);

  useEffect(() => {
    if (initialData?.brand) {
      setbrand(initialData?.brand);
    }
  }, [initialData]);

  // Populate brands when subCategory changes
  // useEffect(() => {
  //   if (selectedSubCategoryId && catByIdData) {
  //     const selectProductName =
  //       catByIdData?.subCategories.find(item => item._id === selectedSubCategoryId)?.name || 'N/A';
  //     const brandsArray = subCategoriesData.find(
  //       item =>
  //         item.category.replace(/\s+/g, '').toLowerCase() ===
  //         selectProductName.replace(/\s+/g, '').toLowerCase()
  //     )?.brands;
  //     setSubcategoryName(selectProductName);
  //     if (brandsArray?.length > 0) setBrandRenderItems(brandsArray);
  //   }
  // }, [selectedSubCategoryId, catByIdData, subCategoriesData]);
  useEffect(() => {
    if (selectedSubCategoryId && subCategoriesData && subCategoriesData.length > 0) {
      const matchedSub = subCategoriesData?.find(item => item.value === selectedSubCategoryId);
      const selectProductName = matchedSub?.name || 'N/A';
      const brandsArray = matchedSub?.brands ?? [];

      setSubcategoryName(selectProductName.toLowerCase());
      if (brandsArray?.length > 0) {
        setBrandRenderItems(brandsArray);
      } else {
        setBrandRenderItems([]);
      }
    } else {
      setBrandRenderItems([]);
    }
  }, [selectedSubCategoryId, subCategoriesData]);

  // On mount: set initial subCategoryId
  useEffect(() => {
    if (subCategoryId) setValue('subCategoryId', subCategoryId);
  }, [subCategoryId]);

  const previewDoc = url => {
    if (url) window.open(url, '_blank');
  };

  console.log(currentCategoryName !== 'others', brand?.toLowerCase() === 'others');

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-1 lg:col-span-1 bg-transparent border-0 p-6 xs:grid xs:grid-cols-2 gap-6 space-y-4">
          <div className="col-span-1 align-center sm:block flex flex-col justify-center">
            <div className="flex gap-2 items-center mb-2">
              <MoveLeft
                className="w-6 cursor-pointer"
                onClick={() => {
                  navigate(-1);
                }}
              />
              <h2 className="text-[15px] font-semibold  text-center">Tell us about your need</h2>
            </div>
            <p className="text-[13px] text-muted-foreground text-center">
              Update your product details below. Make sure all required fields are filled correctly.
            </p>
          </div>
          <div className="col-span-1 w-full">
            <img
              src={`/image/FormImages/${innerFormImages[categoryId]}`}
              alt="Category illustration"
              loading="lazy"
              className="m-auto w-full"
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-2 flex flex-col gap-3">
          {/* ── Product Details ── */}
          <div className="rounded-[5px] p-6 bg-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Input
                type="text"
                placeholder="Title* (Give a short title for your post)"
                className="bg-white col-span-1 md:col-span-3"
                {...register('title')}
              />

              {/* SubCategory — editable (unlike CreateProductForm where it's disabled) */}
              <Select
                value={selectedSubCategoryId}
                onValueChange={value => setValue('subCategoryId', value)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Category*" />
                </SelectTrigger>
                <SelectContent>
                  {subCategroies.map(c => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentCategoryName !== 'service' && currentCategoryName !== 'others' && (
                <SearchableDropdown
                  setValue={setbrand}
                  value={brand}
                  className="w-full"
                  dropdownTitle="Brands*"
                  renderItems={brandRenderItems}
                />
              )}

              {currentCategoryName === 'others' && (
                <Input
                  type="text"
                  placeholder="Brand Name..."
                  value={brand}
                  onChange={e => setbrand(e.target.value)}
                  className="bg-white"
                />
              )}

              {currentCategoryName !== 'others' && brand?.toLowerCase() === 'others' && (
                <Input
                  type="text"
                  placeholder="Specific Brand Name..."
                  {...register('brandName')}
                  className="bg-white"
                />
              )}

              <div className="relative">
                <p className="absolute top-1/2 left-2 text-sm text-orange-600 font-semibold -translate-y-1/2">
                  ₹
                </p>
                <Input
                  type="text"
                  placeholder="Enter a Budget range"
                  {...register('minimumBudget')}
                  className="bg-white pl-5"
                />
              </div>

              {currentCategoryName !== 'service' && (
                <div className="flex items-center gap-2">
                  <Select value={quantityUnit} onValueChange={setQuantityUnit} defaultValue="pcs">
                    <SelectTrigger className="w-[70px] bg-white">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ltr">Ltr</SelectItem>
                      <SelectItem value="kg">KG</SelectItem>
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="ft">Ft</SelectItem>
                      <SelectItem value="mtr">Mtr</SelectItem>
                      <SelectItem value="gms">Gms</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={quantityValue}
                    onChange={e => setQuantityValue(e.target.value)}
                    className="flex-1 bg-white"
                    min="0"
                  />
                </div>
              )}

              {currentCategoryName === 'service' && (
                <Select value={rateAServiceValue} onValueChange={v => setValue('rateAService', v)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Rate a Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="bad">Bad</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {currentCategoryName === 'fashion' && (
                <Select value={genderValue} onValueChange={v => setValue('gender', v)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {currentCategoryName === 'automobile' &&
                !['accessories', 'bicycles'].includes(subCatgoryName.toLowerCase()) && (
                  <>
                    <Select value={fuelTypeValue} onValueChange={v => setValue('fuelType', v)}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Fuel Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="lpg">LPG</SelectItem>
                      </SelectContent>
                    </Select>

                    {!subCatgoryName.toLowerCase().includes('accessories') && (
                      <Input
                        type="text"
                        placeholder="Model"
                        {...register('model')}
                        className="bg-white col-span-1"
                      />
                    )}

                    {!subCatgoryName.toLowerCase().includes('accessories') && (
                      <Input
                        type="text"
                        placeholder="Color"
                        value={colorValue}
                        onChange={e => setValue('color', e.target.value)}
                      />
                    )}

                    {!['scooters', 'accessories', 'bicycles'].includes(
                      subCatgoryName.toLowerCase()
                    ) && (
                      <Select
                        value={transmissionValue}
                        onValueChange={v => setValue('transmission', v)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}

              {subCatgoryName.toLowerCase() === 'mobile' && (
                <Input
                  type="text"
                  placeholder="Model"
                  {...register('model')}
                  className="bg-white col-span-1"
                />
              )}

              {(currentCategoryName === 'furniture' ||
                currentCategoryName === 'sports' ||
                currentCategoryName === 'automobile' ||
                currentCategoryName === 'home' ||
                currentCategoryName === 'electronics') &&
                currentCategoryName !== 'service' &&
                currentCategoryName !== 'others' && (
                  <>
                    {(productField === 'new_product' || productField === '') && (
                      <Select value={productField} onValueChange={v => setValue('productType', v)}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Product Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new_product">New Product</SelectItem>
                          <SelectItem value="old_product">Old Product</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {productField === 'old_product' && (
                      <div className="w-full max-w-md border-[1.5px] border-gray-200 rounded-lg bg-white p-3">
                        <div className="flex justify-between items-center mb-3">
                          <Label className="font-medium text-gray-500">
                            Old Product <sup className="hidden sm:block">(in Years)</sup>
                          </Label>
                          <XIcon
                            className="w-4 h-4 text-gray-400 cursor-pointer"
                            onClick={() => setValue('productType', 'new_product')}
                          />
                        </div>
                        <Range
                          values={values}
                          step={0.1}
                          min={0}
                          max={20}
                          onChange={vals => setValues(vals)}
                          renderTrack={({ props, children }) => (
                            <div {...props} className="h-1 w-full bg-gray-300 rounded relative">
                              <div
                                className="absolute h-1 bg-orange-600 rounded"
                                style={{
                                  left: `${(values[0] / 20) * 100}%`,
                                  width: `${((values[1] - values[0]) / 20) * 100}%`,
                                }}
                              />
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center shadow"
                            />
                          )}
                        />
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Label className="text-gray-600 text-sm hidden sm:block">Min.</Label>
                            <div className="flex items-center gap-1 border rounded px-2 py-1">
                              {values[0].toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 border rounded px-2 py-1">
                              {values[1]}
                            </div>
                            <Label className="text-gray-600 text-sm hidden sm:block">Max.</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

              {currentCategoryName === 'others' && (
                <Input
                  type="text"
                  placeholder="Product Condition"
                  {...register('productCondition')}
                  className="bg-white"
                />
              )}

              {productField === 'new_product' && currentCategoryName === 'furniture' && (
                <Select
                  value={conditionOfProductValue}
                  onValueChange={v => setValue('conditionOfProduct', v)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Product Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="for_parts_or_repair">For Parts Or Repair</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                    <SelectItem value="vintage">Vintage (Used)</SelectItem>
                    <SelectItem value="antique">Antique</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {subCatgoryName === 'Commercial and other Vehicle' &&
                currentCategoryName === 'automobile' && (
                  <Input
                    type="text"
                    placeholder="Type of Vehicle"
                    {...register('typeOfVehicle')}
                    className="bg-white"
                  />
                )}

              <Input
                type="text"
                placeholder={currentCategoryName === 'service' ? 'Service Type' : 'Product Type'}
                {...register('typeOfProduct')}
                className="bg-white"
              />

              {currentCategoryName === 'industrial' && (
                <Select value={toolTypeValue} onValueChange={v => setValue('toolType', v)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Tool Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industrial_tool">Industrial Tool</SelectItem>
                    <SelectItem value="machinery_tool">Machinery Type</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* ── Other Details ── */}
          <div className="rounded-[5px] p-6 bg-gray-200/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Other Details</h3>
              <sup className="italic text-gray-500">
                Product Image and document are not mandatory.
              </sup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Image upload */}
              <div
                onClick={() => imageRef?.current?.click()}
                className="border-2 border-dashed relative border-gray-300 rounded-lg flex bg-transparent flex-col items-center justify-center p-6 cursor-pointer h-32"
              >
                <CloudUpload className="h-6 w-6 mb-2 text-gray-500" />
                <span className="text-sm text-muted-foreground font-semibold">Upload Image</span>
                <p className="text-xs text-gray-500">to upload your image (max 2 MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={imageRef}
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      const newImage = e.target.files[0];
                      if (newImage.size > 2 * 1024 * 1024) {
                        toast.info('Image size should not exceed 2MB');
                        return;
                      }
                      setImage(newImage);
                    }
                  }}
                />
                {image && <p className="text-xs mt-2 text-green-600">{image?.name}</p>}

                {/* Preview new image */}
                {image && (
                  <div className="absolute h-16 w-16 right-2 top-2 rounded-lg shadow select-none z-10 group">
                    <img
                      src={URL.createObjectURL(image)}
                      className="h-full w-full bg-white object-contain rounded-sm"
                      alt=""
                    />
                    <div
                      className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer rounded-lg"
                      onClick={e => {
                        e.stopPropagation();
                        setImage(null);
                        if (imageRef.current) imageRef.current.value = '';
                      }}
                    >
                      <X className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Show existing image from server if no new one selected */}
                {!image && initialData?.image && (
                  <div className="absolute h-16 w-16 right-2 top-2 rounded-lg shadow select-none z-10 group">
                    <img
                      src={initialData.image}
                      className="h-full w-full bg-white object-contain rounded-sm"
                      alt="existing"
                    />
                  </div>
                )}
              </div>

              {/* Document upload */}
              <div
                onClick={() => fileDocRef.current?.click()}
                className="border-2 border-dashed relative border-gray-300 rounded-lg flex bg-transparent flex-col items-center justify-center p-6 cursor-pointer"
              >
                <CloudUpload className="h-6 w-6 mb-2 text-gray-500" />
                <span className="text-sm text-muted-foreground text-center">
                  <span className="font-semibold">Browse From Device</span>
                  <br />
                  <span className="text-xs">to upload your doc/pdf (max 5 MB)</span>
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  ref={fileDocRef}
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      const newDocument = e.target.files[0];
                      if (newDocument.size === 0) {
                        toast.error('Invalid Doc');
                        return;
                      }
                      if (newDocument.size > 5 * 1024 * 1024) {
                        toast.info('Document size should not exceed 5MB');
                        return;
                      }
                      setFileDoc(newDocument);
                    }
                  }}
                />
                {fileDoc && <p className="text-xs mt-2 text-green-600">{fileDoc.name}</p>}

                {/* Show existing doc from server */}
                {!fileDoc && initialData?.document && (
                  <>
                    <div
                      className="absolute top-2 right-2 z-10 bg-orange-100 text-orange-500 rounded-sm p-1 cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        previewDoc(initialData.document);
                      }}
                    >
                      <TooltipComp
                        hoverChildren={<File className="h-4 w-4" />}
                        contentChildren={<p>View Document</p>}
                      />
                    </div>
                    <p className="text-xs mt-2 text-blue-600">Current document uploaded</p>
                  </>
                )}

                {fileDoc && (
                  <div
                    className="absolute top-2 right-2 z-10 bg-orange-100 text-orange-500 rounded-sm p-1 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setFileDoc(null);
                      if (fileDocRef.current) fileDocRef.current.value = '';
                    }}
                  >
                    <TooltipComp
                      hoverChildren={<X className="h-4 w-4" />}
                      contentChildren={<p>Remove Doc</p>}
                    />
                  </div>
                )}
              </div>
            </div>

            <Textarea
              placeholder="Description*"
              {...register('description')}
              className="bg-white min-h-24"
            />
          </div>

          {/* ── Payment & Delivery ── */}
          <div className="rounded-[5px] p-6 bg-gray-200/50">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment & Delivery Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <DatePicker
                date={date}
                title="Delivery Date"
                disabledBeforeDate={new Date()}
                setDate={val => {
                  if (val) {
                    setDate(val);
                    setValue('paymentAndDelivery.ex_deliveryDate', val);
                  }
                }}
              />

              <Select
                value={paymentMode}
                onValueChange={v => setValue('paymentAndDelivery.paymentMode', v)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank or online">Banking or Online mode</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gstField} onValueChange={v => setValue('gst_requirement', v)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="GST Input Required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>

              {gstField === 'yes' && (
                <>
                  <Input
                    type="text"
                    placeholder="GST Number (15 characters - Format: 22AAAAA0000A1Z5)"
                    {...register('paymentAndDelivery.gstNumber')}
                    className="bg-white"
                    maxLength={15}
                    onChange={e => {
                      setValue('paymentAndDelivery.gstNumber', e.target.value.toUpperCase(), {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <Input
                    type="text"
                    placeholder="Entity Name"
                    {...register('paymentAndDelivery.organizationName')}
                    className="bg-white"
                  />
                  <Input
                    type="text"
                    placeholder="Entity Address"
                    {...register('paymentAndDelivery.organizationAddress')}
                    className="bg-white"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── UpdateCreateProductForm ──────────────────────────────────────────────────
const UpdateCreateProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserState();
  const [open, setOpen] = useState(false);
  const [bidPopUpOpen, setBidPopUpOpen] = useState(false);
  const [bidDuration, setBidDuration] = useState('');
  const [buttonType, setButtonType] = useState(false);
  const { categories } = useCategoryState();
  const dispatachCategory = useCategory();
  useEffect(() => {
    dispatachCategory();
  }, []);

  const {
    fn: getDraft,
    data: getDraftRes,
    loading: getDraftLoading,
  } = useFetch(productService.getDraftById);
  const {
    fn: updateDraft,
    data: updateDraftRes,
    loading: updateLoading,
  } = useFetch(productService.updateDrafts);
  const {
    fn: saveAsDraftFn,
    data: saveAsDraftRes,
    loading: saveAsDraftLoading,
  } = useFetch(productService.saveAsDraft);
  const { fn: getCatByIdFn, data: catByIdData } = useFetch(categoryService.getCategoriesById);

  const [draftState, setDraftState] = useState(null);
  const [subCategroies, setSubCategoies] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] = useState(null);
  const [subCategoriesData, setSubCategoriesData] = useState([]);
  const [image, setImage] = useState(null);
  const [fileDoc, setFileDoc] = useState(null);
  const [quantityUnit, setQuantityUnit] = useState('pcs');
  const [quantityValue, setQuantityValue] = useState('');

  // ── useForm — same pattern as CreateProductForm ───────────────────────────
  const { watch, setValue, register, getValues } = useForm({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      title: '',
      // quantity: '',
      subCategoryId: '',
      minimumBudget: '',
      productType: '',
      oldProductValue: { min: '', max: '' },
      productCondition: '',
      image: '',
      document: '',
      description: '',
      paymentAndDelivery: {
        ex_deliveryDate: undefined,
        paymentMode: '',
        gstNumber: '',
        organizationName: '',
        organizationAddress: '',
      },
      draft: false,
      gst_requirement: '',
      brand: '',
      additionalDeliveryAndPackage: '',
      gender: '',
      typeOfAccessories: '',
      fuelType: '',
      model: '',
      color: '',
      transmission: '',
      conditionOfProduct: '',
      toolType: '',
      rateAService: '',
      brandName: '',
      typeOfVehicle: '',
      typeOfProduct: '',
    },
  });

  // ── Load draft ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (productId) getDraft(productId);
  }, [productId]);

  useEffect(() => {
    if (!getDraftRes) return;
    setDraftState(getDraftRes);
    setCurrentCategoryName(getDraftRes?.categoryId?.categoryName?.toLowerCase() || null);
    if (getDraftRes?.categoryId?._id) getCatByIdFn(getDraftRes.categoryId._id);

    // Pre-fill form with existing draft data
    const d = getDraftRes;
    if (d.quantity) setQuantityValue(String(d.quantity));
    if (d.quantityUnit) setQuantityUnit(d.quantityUnit);
    const fields = {
      title: d.title || '',
      // quantity: '',
      subCategoryId: d.subCategoryId || '',
      minimumBudget: d.minimumBudget || '',
      productType: d.productType || '',
      oldProductValue: d.oldProductValue || { min: '', max: '' },
      productCondition: d.productCondition || '',
      description: d.description || '',
      brand: d.brand || '',
      brandName: d.brandName || '',
      gender: d.gender || '',
      fuelType: d.fuelType || '',
      model: d.model || '',
      color: d.color || '',
      transmission: d.transmission || '',
      conditionOfProduct: d.conditionOfProduct || '',
      toolType: d.toolType || '',
      rateAService: d.rateAService || '',
      typeOfVehicle: d.typeOfVehicle || '',
      typeOfProduct: d.typeOfProduct || '',
      gst_requirement: d.paymentAndDelivery?.gstNumber ? 'yes' : '',
      paymentAndDelivery: {
        ex_deliveryDate: d.paymentAndDelivery?.ex_deliveryDate || undefined,
        paymentMode: d.paymentAndDelivery?.paymentMode || '',
        gstNumber: d.paymentAndDelivery?.gstNumber || '',
        organizationName: d.paymentAndDelivery?.organizationName || '',
        organizationAddress: d.paymentAndDelivery?.organizationAddress || '',
      },
    };
    Object.entries(fields).forEach(([key, val]) => setValue(key, val));
  }, [getDraftRes]);

  // useEffect(() => {
  //   if (!catByIdData) return;
  //   const name = currentCategoryName || '';
  //   setSubCategoriesData(getSubCategories(name));
  //   setSubCategoies(catByIdData?.subCategories || []);
  // }, [catByIdData]);

  useEffect(() => {
    if (catByIdData) {
      try {
        if (!categories || categories.length === 0) {
          console.log('Categories not available yet');
          return;
        }

        const findCategory = categories.find(category => category._id === catByIdData?._id);

        if (!findCategory) {
          console.log('Category not found in categories array');
          return;
        }

        console.log(findCategory);
        const decodedCategoryName = findCategory?.categoryName.toLowerCase();

        // Fix: Map subCategories with correct structure that CategoryForm expects
        const mappedSubCategories =
          findCategory?.subCategories?.map(val => ({
            category: val.name, // Add category field
            label: val.name,
            name: val.name,
            value: val._id,
            brands: val.brands ?? [],
          })) || [];
        setSubCategoriesData(mappedSubCategories);
        setCurrentCategoryName(decodedCategoryName || null);
        console.log('Sub Categories Data:', mappedSubCategories);
      } catch (e) {
        console.error('Error processing category data:', e);
        setCurrentCategoryName(null);
        setSubCategoriesData([]);
      }

      setSubCategoies(catByIdData?.subCategories || []);
    }
  }, [catByIdData, categories]);

  // ── Validation — same as CreateProductForm ───────────────────────────────
  const validateForm = (formData, isDraft) => {
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    if (!formData.title) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.subCategoryId && !isDraft) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.brand && currentCategoryName !== 'service' && !isDraft) {
      toast.error('Brand is required');
      return false;
    }
    if (!quantityValue && currentCategoryName !== 'service' && !isDraft) {
      toast.error('Unit is required');
      return false;
    }
    if (!formData.description && !isDraft) {
      toast.error('Description is required');
      return false;
    }
    if (formData.gst_requirement === 'yes' && formData.paymentAndDelivery?.gstNumber && !isDraft) {
      if (!gstRegex.test(formData.paymentAndDelivery.gstNumber.trim())) {
        toast.error('Invalid GST Number format');
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (!user) return;
    if (
      !user?.firstName?.trim() ||
      !user?.lastName?.trim() ||
      !user?.email?.trim() ||
      !user?.phone?.trim()
    ) {
      toast.info('Please update your profile first before adding quotes', {
        duration: 2000,
        onDismiss: () => {
          navigate('/account');
        },
        onAutoClose: () => {
          navigate('/account');
        },
      });

      return;
    }
  }, [user]);

  // ── Submit — same pattern as CreateProductForm ────────────────────────────
  const handleSubmit = async (isDraft, resolvedBidDuration) => {
    if (!user) {
      setOpen(true);
      return;
    }

    const formData = getValues();
    if (!formData.title) {
      toast.error('Please fill the form first');
      return;
    }

    const isValid = validateForm(formData, isDraft);
    if (!isValid) return;

    if (quantityValue && currentCategoryName?.toLowerCase() !== 'service') {
      const qty = quantityValue.toString().trim();
      if (!/^\d+(\.\d+)?$/.test(qty) || parseFloat(qty) < 0) {
        toast.error('Invalid Quantity');
        return;
      }
    }
    if (formData.minimumBudget) {
      const mb = formData.minimumBudget.toString().trim();

      if (!/^\d+$/.test(mb) || parseInt(mb) < 1) {
        toast.error('Invalid Budget range');
        return;
      }
    }

    const allowedFields = getCategorySpecificFields(currentCategoryName);
    const multipartData = new FormData();

    allowedFields.forEach(field => {
      if (field === 'image') {
        if (image) multipartData.append('image', image);
        return;
      }
      if (field === 'document') {
        if (fileDoc) multipartData.append('document', fileDoc);
        return;
      }
      if (field === 'subCategoryId' || field === 'categoryId') return;
      if (
        (field === 'oldProductValue' || field === 'productCondition') &&
        formData.productType !== 'old_product'
      )
        return;

      const value = formData[field];
      if (value !== undefined && value !== null && value !== '') {
        multipartData.append(field, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });
    if (currentCategoryName?.toLowerCase() !== 'service') {
      if (quantityValue) multipartData.append('quantity', quantityValue);
      multipartData.append('quantityUnit', quantityUnit);
    }

    multipartData.append('draft', isDraft);
    multipartData.append('categoryId', draftState?.categoryId?._id || '');
    multipartData.append('subCategoryId', formData.subCategoryId);
    multipartData.append('products', JSON.stringify([{ _id: draftState?._id }]));
    multipartData.append('productId', draftState?._id || '');

    if (isDraft) {
      multipartData.append('createRequirement', 'false');
      await saveAsDraftFn(multipartData, false);
    } else {
      if (resolvedBidDuration) multipartData.append('bidActiveDuration', resolvedBidDuration);
      multipartData.append('createRequirement', 'true');
      await updateDraft(multipartData, false);
    }
  };

  useEffect(() => {
    if (saveAsDraftRes) {
      toast.success('Draft saved successfully');
      getDraft(productId);
    }
  }, [saveAsDraftRes]);
  useEffect(() => {
    if (updateDraftRes) {
      toast.success('Submitted successfully');
      navigate(-1);
    }
  }, [updateDraftRes]);

  const categoryLabel = () => {
    const map = {
      beauty: 'Personal Care',
      electronics: 'Mobile, Tablet and Wearables',
      sports: 'Sports & Stationery',
      home: 'Home Appliances',
      industrial: 'Industrial & Construction Material',
      furniture: 'Furniture and Decor',
    };
    return map[currentCategoryName] || currentCategoryName;
  };

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <PlaceRequirementPopup
        buttonType={buttonType}
        loading={updateLoading}
        open={bidPopUpOpen}
        setOpen={setBidPopUpOpen}
        setBidDuration={setBidDuration}
        bidDuration={bidDuration}
        createProductFn={handleSubmit}
      />

      <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
        {getDraftLoading ? (
          <CategoryFormSkeleton />
        ) : (
          <>
            <div className="flex flex-row sm:justify-between justify-end items-center gap-3 mb-6">
              <Breadcrumb className="sm:block hidden">
                <BreadcrumbList>
                  <BreadcrumbItem className="flex items-center gap-2 cursor-pointer">
                    {/* <MoveLeft className="h-4 w-4" /> */}
                    <BreadcrumbPage className="capitalize font-semibold text-gray-500">
                      Category
                    </BreadcrumbPage>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage className="capitalize font-semibold text-orange-600">
                      {categoryLabel()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <CategoryForm
              currentCategoryName={currentCategoryName}
              catByIdData={catByIdData}
              subCategroies={subCategroies}
              subCategoriesData={subCategoriesData}
              subCategoryId={draftState?.subCategoryId}
              register={register}
              watch={watch}
              setValue={setValue}
              image={image}
              setImage={setImage}
              fileDoc={fileDoc}
              setFileDoc={setFileDoc}
              initialData={draftState}
              quantityUnit={quantityUnit}
              setQuantityUnit={setQuantityUnit}
              quantityValue={quantityValue}
              setQuantityValue={setQuantityValue}
              categoryId={draftState?.categoryId?._id}
            />

            <div className="flex justify-end gap-3 my-5">
              <Button
                type="button"
                variant="outline"
                className="w-32 cursor-pointer border-[#2C3E50]"
                onClick={() => handleSubmit(true)}
                disabled={saveAsDraftLoading}
              >
                {/* {saveAsDraftLoading ? (
                  <Spinner className="w-5 h-5 animate-spin" />
                ) : (
                  'Save as Draft'
                )} */}
                Save as Draft
              </Button>
              <Button
                type="button"
                className="text-white w-32 cursor-pointer bg-orange-600 border-primary-btn border-2"
                onClick={() => setBidPopUpOpen(true)}
                disabled={updateLoading}
              >
                {/* {updateLoading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Submit'}
                 */}
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UpdateCreateProductForm;
