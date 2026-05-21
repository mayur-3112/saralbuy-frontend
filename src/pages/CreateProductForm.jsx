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
import { MoveLeft, CloudUpload, X, XIcon, ArrowLeft } from 'lucide-react';
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
import productService from '@/services/product.service';
import PlaceRequirementPopup from '@/components/custom/popups/PlaceRequirementPopup';
const innerFormImages = {
  automobile: 'automobileFormImage.png',
  fashion: 'fashionFormImage.png',
  electronics: 'electronicsFormImage.png',
  home: 'homeapplianceFormImage.png',
  sports: 'sportsFormImage.png',
  furniture: 'furnitureFormImage.png',
  health: 'healthFormImage.png',
  beauty: 'beautyFormImage.png',
  service: 'servicesFormImage.png',
  industrial: 'constructionFormImage.png',
  others: 'otherImage.webp',
};
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
}) => {
  const [values, setValues] = useState([0, 2]);
  const [date, setDate] = useState(undefined);
  const [brand, setbrand] = useState('');
  const [brandRenderItems, setBrandRenderItems] = useState([]);
  const [subCatgoryName, setSubcategoryName] = useState('');
  const imageRef = useRef(null);
  const fileDocRef = useRef(null);
  const navigate = useNavigate();
  const gstField = watch('gst_requirement');
  const productField = watch('productType');
  const paymentMode = watch('paymentAndDelivery.paymentMode');
  const genderValue = watch('gender');
  const fuelTypeValue = watch('fuelType');
  const colorValue = watch('color');
  const transmissionValue = watch('transmission');
  const conditionOfProductValue = watch('conditionOfProduct');
  const toolTypeValue = watch('toolType');

  useEffect(() => {
    setValue('oldProductValue.min', values[0].toString());
    setValue('oldProductValue.max', values[1].toString());
  }, [values, setValue]);

  useEffect(() => {
    setValue('brand', brand);
  }, [brand, setValue]);

  useEffect(() => {
    if (brand !== 'other') setValue('brandName', '');
  }, [brand]);

  useEffect(() => {
    if (subCategoryId && catByIdData) {
      const selectProductName =
        catByIdData?.subCategories.find(item => item._id === subCategoryId)?.name || 'N/A';
      const brandsArray = subCategoriesData.find(
        item =>
          item.category.replace(/\s+/g, '').toLowerCase() ===
          selectProductName.replace(/\s+/g, '').toLowerCase()
      )?.brands;
      setSubcategoryName(selectProductName);
      if (brandsArray?.length > 0) setBrandRenderItems(brandsArray);
      setValue('subCategoryId', subCategoryId);
    }
  }, [subCategoryId, catByIdData, subCategoriesData]);
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
              Please help us tailor the experience by filling out the form below. If this isn't the
              category you meant to choose, you can go back and select another one.
            </p>
          </div>
          <div className="col-span-1 w-full">
            <img
              src={`/image/FormImages/${innerFormImages[currentCategoryName]}`}
              alt="Category illustration"
              loading="lazy"
              className="m-auto w-3/4 sm:w-full"
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-2 flex flex-col gap-3">
          <div className="rounded-[5px] p-6 bg-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Input
                type="text"
                placeholder="Title* (Give a short title for your post - specify your required product in 3–4 words)"
                className="bg-white col-span-1 md:col-span-3"
                {...register('title')}
              />

              <Select defaultValue={subCategoryId} disabled>
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
                  onChange={e => {
                    setbrand(e.target.value);
                  }}
                  className="bg-white"
                />
              )}

              {currentCategoryName !== 'others' && brand === 'others' && (
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
                <Input
                  type="string"
                  placeholder="Quantity*"
                  {...register('quantity')}
                  className="bg-white col-span-1"
                />
              )}

              {currentCategoryName === 'fashion' && (
                <Select value={genderValue} onValueChange={value => setValue('gender', value)}>
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
                    <Select
                      value={fuelTypeValue}
                      onValueChange={value => setValue('fuelType', value)}
                    >
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
                        className="bg-white col-span-1"
                        onChange={e => {
                          setValue('color', e.target.value);
                        }}
                      />
                    )}

                    {!['scooters', 'accessories', 'bicycles'].includes(
                      subCatgoryName.toLowerCase()
                    ) && (
                      <Select
                        value={transmissionValue}
                        onValueChange={value => setValue('transmission', value)}
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
                      <Select
                        value={productField}
                        onValueChange={value => setValue('productType', value)}
                      >
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
                      <>
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
                      </>
                    )}
                  </>
                )}

              {currentCategoryName === 'others' && (
                <>
                  <Input
                    type="text"
                    placeholder="Product Condition"
                    {...register('productCondition')}
                    className="bg-white"
                  />
                </>
              )}

              {productField === 'new_product' && currentCategoryName === 'furniture' && (
                <Select
                  value={conditionOfProductValue}
                  onValueChange={value => setValue('conditionOfProduct', value)}
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
                <Select value={toolTypeValue} onValueChange={value => setValue('toolType', value)}>
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

          <div className="rounded-[5px] p-6 bg-gray-200/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Other Details</h3>
              <sup className="italic text-gray-500">
                Product Image and document are not mandatory.
              </sup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              </div>

              <div
                onClick={() => fileDocRef.current?.click()}
                className="border-2 border-dashed relative border-gray-300 rounded-lg flex bg-transparent flex-col items-center justify-center p-6 cursor-pointer"
              >
                <CloudUpload className="h-6 w-6 mb-2 text-gray-500" />
                <span className="text-sm text-muted-foreground text-center">
                  <span className="font-semibold">Browse From Device</span> <br />
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

          <div className="rounded-[5px] p-6 bg-gray-200/50">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment & Delivery Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <DatePicker
                date={date}
                title="Delivery Date"
                disabledBeforeDate={new Date(new Date().getTime())}
                setDate={val => {
                  if (val) {
                    setDate(val);
                    setValue('paymentAndDelivery.ex_deliveryDate', val);
                  }
                }}
              />

              <Select
                value={paymentMode}
                onValueChange={value => setValue('paymentAndDelivery.paymentMode', value)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Banking or Online mode</SelectItem>
                  <SelectItem value="upi">Any</SelectItem>
                </SelectContent>
              </Select>

              <Select value={gstField} onValueChange={value => setValue('gst_requirement', value)}>
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
                      const value = e.target.value.toUpperCase();
                      setValue('paymentAndDelivery.gstNumber', value, {
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

const CreateProductForm = () => {
  const navigate = useNavigate();
  const { categoryId, subCategoryId } = useParams();
  const [subCategroies, setSubCategoies] = useState([]);
  const { fn: getCatByIdFn, data: catByIdData } = useFetch(categoryService.getCategoriesById);
  const {
    fn: createProduct,
    data: createProductRes,
    loading: addProductLoading,
  } = useFetch(productService.addProduct);
  const [currentCategoryName, setCurrentCategoryName] = useState(null);
  const { user } = useUserState();
  const [open, setOpen] = useState(false);
  const [subCategoriesData, setSubCategoriesData] = useState([]);
  const [image, setImage] = useState(null);
  const [fileDoc, setFileDoc] = useState(null);
  const [bidPopUpOpen, setBidPopUpOpen] = useState(false);
  const [bidDuration, setBidDuration] = useState('');
  const [buttonType, setButtonType] = useState(false);

  const { watch, setValue, register, getValues } = useForm({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      title: '',
      quantity: '',
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

  useEffect(() => {
    (async () => await getCatByIdFn(categoryId))();
  }, [categoryId]);

  useEffect(() => {
    if (catByIdData) {
      try {
        const decodedCategoryName = decodeURIComponent(catByIdData?.categoryName).toLowerCase();
        setSubCategoriesData(getSubCategories(decodedCategoryName));
        setCurrentCategoryName(decodedCategoryName || null);
      } catch (e) {
        console.error('Error decoding category name:', e);
        setCurrentCategoryName(null);
      }
      setSubCategoies(catByIdData?.subCategories || []);
    }
  }, [catByIdData]);

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
    if (!formData.brand && currentCategoryName?.toLowerCase() !== 'service' && !isDraft) {
      toast.error('Brand is required');
      return false;
    }
    if (!formData.quantity && currentCategoryName?.toLowerCase() !== 'service' && !isDraft) {
      toast.error('Quantity is required');
      return false;
    }
    if (!formData.description && !isDraft) {
      toast.error('Description is required');
      return false;
    }
    if (formData.gst_requirement === 'yes' && formData.paymentAndDelivery?.gstNumber && !isDraft) {
      if (!gstRegex.test(formData.paymentAndDelivery.gstNumber.trim())) {
        toast.error('Invalid GST Number format. Must be 15 characters (Format: 22AAAAA0000A1Z5)');
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
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

  const handleSubmit = async (isDraft, resolvedBidDuration) => {
    if (!user) {
      setOpen(true);
      return;
    }

    if (
      !user?.firstName?.trim() ||
      !user?.lastName?.trim() ||
      !user?.email?.trim() ||
      !user?.phone?.trim()
    ) {
      toast.info('Please update your profile first before adding quotes');
      navigate('/account');
      return;
    }

    const formData = getValues();

    if (!formData.title) {
      toast.error('Please fill the form first');
      return;
    }

    const isValid = validateForm(formData, isDraft);
    if (!isValid) return;

    if (formData.quantity) {
      const qty = formData.quantity.toString().trim();
      if (!/^\d+$/.test(qty) || parseInt(qty) < 1) {
        toast.error('Invalid Quantity');
        return;
      }
    }

    if (formData.minimumBudget) {
      const minBudget = formData.minimumBudget.toString().trim();
      console.log(minBudget);
      if (!/^\d+$/.test(minBudget) || parseInt(minBudget) < 1) {
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
      if (field === 'subCategoryId') return;
      if (field === 'categoryId') return;
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

    multipartData.append('draft', isDraft);
    multipartData.append('categoryId', categoryId);
    multipartData.append('subCategoryId', formData.subCategoryId || subCategoryId);
    if (!isDraft && resolvedBidDuration) {
      multipartData.append('bidActiveDuration', resolvedBidDuration);
    }

    await createProduct(categoryId, subCategoryId, multipartData);
    toast.success(`Form ${isDraft ? 'saved as draft' : 'submitted'} successfully!`);
  };
  useEffect(() => {
    if (createProductRes) {
      navigate('/');
    }
  }, [createProductRes]);

  return (
    <>
      <Authentication setOpen={setOpen} open={open} />
      <div className="w-full max-w-7xl mx-auto p-4">
        <PlaceRequirementPopup
          buttonType={buttonType}
          loading={addProductLoading}
          open={bidPopUpOpen}
          setOpen={setBidPopUpOpen}
          setBidDuration={setBidDuration}
          bidDuration={bidDuration}
          createProductFn={handleSubmit}
        />

        <CategoryForm
          currentCategoryName={currentCategoryName}
          catByIdData={catByIdData}
          subCategroies={subCategroies}
          subCategoriesData={subCategoriesData}
          subCategoryId={subCategoryId}
          register={register}
          watch={watch}
          setValue={setValue}
          image={image}
          setImage={setImage}
          fileDoc={fileDoc}
          setFileDoc={setFileDoc}
        />

        <div className="flex justify-end gap-3 my-5">
          <Button
            type="button"
            variant="outline"
            className="w-32 cursor-pointer border-[#2C3E50]"
            onClick={() => handleSubmit(true)}
            disabled={addProductLoading}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            disabled={addProductLoading}
            className="text-white w-32 cursor-pointer bg-orange-600 border-primary-btn border-2"
            onClick={() => setBidPopUpOpen(true)}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateProductForm;
