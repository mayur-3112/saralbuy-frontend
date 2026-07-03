import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MoveLeft, Plus, Trash2, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DatePicker } from '@/lib/DatePicker';
import { toast } from 'sonner';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import { useUserState } from '@/redux/hooks/useUser';
import Authentication from '@/components/custom/auth/Authenticate';
import { Spinner } from '@/components/ui/spinner';
import instance from '@/helper/instance';



const PostRequirementForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'single';
  const initialCat = searchParams.get('cat');
  const initialSub = searchParams.get('sub');
  
  const { user } = useUserState();
  const dispatachCategory = useCategory();
  const { categories } = useCategoryState();
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [showCustomCategoryWarning, setShowCustomCategoryWarning] = useState(false);
  const [pendingSubCategoryId, setPendingSubCategoryId] = useState(null);

  useEffect(() => {
    dispatachCategory();
  }, []);

  const { control, register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      categoryId: initialCat || '',
      subCategoryId: initialSub || '',
      items: [
        { itemName: '', itemDescription: '', quantity: '', quantityUnit: 'pcs', brand: 'Any' }
      ],
      otherTerms: '',
      deliveryDate: undefined,
      expiryDate: undefined,
      paymentMode: '',
      gstRequired: 'no',
      gstNumber: '',
      organizationName: '',
      deliveryAddress: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const selectedCategoryId = watch('categoryId');
  const selectedCategory = categories?.find(c => c._id === selectedCategoryId);
  const dynamicSubcategories = selectedCategory?.subCategories || [];
  const subCategories = [...dynamicSubcategories, { _id: 'other', name: 'Other', brands: [] }];
  const selectedSubCategoryId = watch('subCategoryId');
  const selectedSubCategory = subCategories.find(sub => sub._id === selectedSubCategoryId);
  const dynamicBrands = selectedSubCategory?.brands || [];
  const availableBrands = [...dynamicBrands, 'Any'];
  const gstField = watch('gstRequired');

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles.length + newFiles.length > 2) {
        toast.error('You can only upload a maximum of 2 documents.');
        return;
      }
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 2));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data) => {
    if (!user?._id) {
      setAuthOpen(true);
      return;
    }

    const selectedCat = categories?.find(c => c._id === data.categoryId);
    const hasSubCategories = selectedCat?.subCategories?.length > 0;

    if (!data.title || !data.categoryId || (hasSubCategories && !data.subCategoryId)) {
      toast.error('Please fill in the title, category, and subcategory.');
      return;
    }

    if (data.items.length === 0) {
      toast.error('Please add at least one item.');
      return;
    }

    if (data.gstRequired === 'yes' && !data.gstNumber) {
      toast.error('Please provide a GST Number.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('document', file);
      });

      // Map to the backend expected structure
      const commonDetails = {
        title: data.title,
        description: data.otherTerms,
        bidExpiryDate: data.expiryDate,
        paymentAndDelivery: {
          ex_deliveryDate: data.deliveryDate,
          paymentMode: data.paymentMode,
          gstNumber: data.gstNumber,
          organizationName: data.organizationName,
          organizationAddress: data.deliveryAddress,
        },
        draft: false,
      };

      const categoryGroups = [{
        categoryId: data.categoryId,
        items: data.items.map(item => ({
          subCategoryId: data.subCategoryId,
          typeOfProduct: item.itemDescription ? `${item.itemName} - ${item.itemDescription}` : item.itemName,
          quantity: item.quantity,
          quantityUnit: item.quantityUnit,
          brand: item.brand,
        }))
      }];

      let res;
      if (selectedFiles.length > 0) {
        // Upload logic
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('document', file);
        });
        formData.append('commonDetails', JSON.stringify(commonDetails));
        formData.append('categories', JSON.stringify([data.categoryId]));
        formData.append('categoryGroups', JSON.stringify(categoryGroups));
        res = await instance.post('/product/upload-multiple-requirement', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Standard data logic
        const payload = {
          commonDetails,
          categoryGroups,
        };
        res = await instance.post('/product/create-multiple', payload);
      }

      if (res.data.statusCode === 200 || res.data.statusCode === 201) {
        toast.success('Requirement posted successfully!');
        navigate('/');
      } else {
        toast.error(res.data.message || 'Failed to post requirement.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to post requirement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 min-h-screen py-10 bg-slate-50">
      <div className="flex gap-3 items-center mb-8 pb-4 border-b border-slate-200">
        <MoveLeft className="w-6 h-6 cursor-pointer text-slate-600 hover:text-blue-600 transition-colors" onClick={() => navigate(-1)} />
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Post Your Requirement (RFQ)</h2>
          <p className="text-sm text-slate-500 mt-0.5">Fill in the details below to get quotes from verified suppliers.</p>
        </div>
      </div>

      <AlertDialog open={showCustomCategoryWarning} onOpenChange={setShowCustomCategoryWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Custom Category Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Please note: Any custom requirement you enter must be aligned with our existing construction and building material offerings. Unrelated products may be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCustomCategoryWarning(false);
              setPendingSubCategoryId(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowCustomCategoryWarning(false);
              setValue('subCategoryId', pendingSubCategoryId);
            }}>Accept & Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Step 1 — Basic Information */}
        <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-l-2xl" />
          <div className="mb-6 border-b border-slate-100 pb-4 flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">1</span>
            <div>
              <h3 className="text-lg font-black text-slate-900">Basic Information</h3>
              <p className="text-[13px] text-slate-400 mt-0.5">Provide the primary details of your requirement to help suppliers quickly understand what you need.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Title of Requirement*</label>
              <Input placeholder="e.g., Procurement of Seamless Pipes and Tubes" {...register('title')} className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium" />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Category*</label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={(val) => { onChange(val); setValue('subCategoryId', ''); }}>
                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 hover:border-blue-300 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium">
                      <SelectValue placeholder="Select Main Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(c => (
                        <SelectItem key={c._id} value={c._id}>{c.categoryName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Subcategory*</label>
              <Controller
                name="subCategoryId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select 
                    value={value} 
                    onValueChange={(val) => {
                      const selectedSub = subCategories.find(s => s._id === val);
                      if (selectedSub && (selectedSub.name.toLowerCase() === 'other' || selectedSub.name.toLowerCase() === 'others')) {
                        setPendingSubCategoryId(val);
                        setShowCustomCategoryWarning(true);
                      } else {
                        onChange(val);
                      }
                    }} 
                    disabled={!selectedCategoryId}
                  >
                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 hover:border-blue-300 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium">
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map(sub => (
                        <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Step 2 — Items */}
        {mode === 'single' && (
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-l-2xl" />
            <div className="border-b border-slate-200 pb-4 mb-4 flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">List of Materials</h3>
                <p className="text-[13px] text-slate-400 mt-0.5">Add the specific items or materials you need, including quantities and specifications.</p>
              </div>
            </div>
          
            {/* Header Row for Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-3 mb-2 px-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <div className="col-span-3">Item Name</div>
              <div className="col-span-3">Description / Specs</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-1">Units</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="md:col-span-3">
                    <label className="block md:hidden text-xs font-bold text-slate-500 mb-1">Item Name</label>
                    <Input placeholder="e.g., Pipe" {...register(`items.${index}.itemName`)} className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium" />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block md:hidden text-xs font-bold text-slate-500 mb-1">Description / Specs</label>
                    <Input placeholder="e.g., DN65 ASTM A106" {...register(`items.${index}.itemDescription`)} className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block md:hidden text-xs font-bold text-slate-500 mb-1">Qty</label>
                    <Input type="number" placeholder="Qty" {...register(`items.${index}.quantity`)} className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium" min="1" />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="block md:hidden text-xs font-bold text-slate-500 mb-1">Units</label>
                    <Controller
                      name={`items.${index}.quantityUnit`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select value={value} onValueChange={onChange}>
                          <SelectTrigger className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {['pcs', 'ltr', 'kg', 'ft', 'mtr', 'tons', 'bags', 'set'].map(u => (
                              <SelectItem key={u} value={u} className="uppercase">{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block md:hidden text-xs font-bold text-slate-500 mb-1">Brand</label>
                    <Controller
                      name={`items.${index}.brand`}
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        const isCustom = value === '__custom__' || (!availableBrands.includes(value) && value !== 'Any');
                        return isCustom ? (
                          <div className="flex gap-1.5">
                            <Input
                              type="text"
                              value={value === '__custom__' ? '' : value}
                              placeholder="Type brand name..."
                              className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium flex-1"
                              autoFocus={value === '__custom__'}
                              onChange={(e) => onChange(e.target.value)}
                              onBlur={(e) => {
                                if (!e.target.value.trim()) onChange('Any');
                              }}
                            />
                            <button
                              type="button"
                              className="text-xs text-slate-400 hover:text-slate-600 px-1 shrink-0"
                              onClick={() => onChange('Any')}
                              title="Back to dropdown"
                            >✕</button>
                          </div>
                        ) : (
                          <Select value={value} onValueChange={onChange}>
                            <SelectTrigger className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium">
                              <SelectValue placeholder="Brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableBrands.map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                              ))}
                              <SelectItem value="__custom__" className="text-blue-600 font-semibold border-t border-slate-100 mt-1">
                                ✏️ Other (type your own)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                    <button type="button" onClick={() => remove(index)} disabled={fields.length <= 1} className={`p-2 rounded transition-colors ${fields.length <= 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`} title={fields.length <= 1 ? 'At least one item is required' : 'Delete Row'}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => append({ itemName: '', itemDescription: '', quantity: '', quantityUnit: 'pcs', brand: 'Any' })}
              className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-extrabold border border-dashed border-blue-200"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Another Item
            </Button>
          </div>
        )}

        {/* Step 3 — Documents & Terms */}
        <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-l-2xl" />
          <div className="border-b border-slate-200 pb-4 mb-6 flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
            <div>
              <h3 className="text-lg font-black text-slate-900">Other Details & Terms</h3>
              <p className="text-[13px] text-slate-400 mt-0.5">Upload relevant documents, reference images, or specifications, and mention any specific terms.</p>
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-extrabold text-slate-800 mb-2">Attachments (Optional, max 2 docs)</label>
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg text-center hover:bg-slate-100 transition-colors">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 font-medium text-sm mb-4">Drag and drop or click to upload</p>
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.png"
              />
              <Button type="button" variant="outline" className="font-bold border-slate-300 bg-white" onClick={() => fileInputRef.current.click()}>
                Choose Files
              </Button>
              <p className="text-xs text-slate-400 mt-3 font-medium">Max size: 10MB per file. Formats: PDF, Excel, Word, Image</p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-2 rounded-md shadow-sm">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                    <button type="button" onClick={() => removeFile(idx)} className="text-emerald-500 hover:text-emerald-800 ml-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-extrabold text-slate-800 mb-2">Other Terms</label>
            <Textarea
              placeholder="Any specific delivery terms, conditions, or quotation instructions..."
              {...register('otherTerms')}
              className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium min-h-[100px]"
            />
          </div>
        </div>

        {/* Step 4 — Delivery & Organization */}
        <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-l-2xl" />
          <div className="border-b border-slate-100 pb-5 mb-8 flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">4</span>
            <div>
              <h3 className="text-lg font-black text-slate-900">Delivery & Organization Details</h3>
              <p className="text-[13px] text-slate-400 mt-0.5">Specify your timeline, payment terms, and delivery location so suppliers can quote accurately.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Delivery Date</label>
              <Controller
                control={control}
                name="deliveryDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker date={value} title="Select Date" disabledBeforeDate={new Date()} setDate={onChange} />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Bid Valid Until</label>
              <Controller
                control={control}
                name="expiryDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker date={value} title="Select Expiry" disabledBeforeDate={new Date()} setDate={onChange} />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Payment Mode</label>
              <Controller
                name="paymentMode"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium">
                      <SelectValue placeholder="Select Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank or online">Banking or Online mode</SelectItem>
                      <SelectItem value="credit">Credit terms</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-2">GST Input Required?</label>
              <Controller
                name="gstRequired"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium">
                      <SelectValue placeholder="Yes / No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {gstField === 'yes' && (
              <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-blue-50/50 border border-blue-100 rounded-md">
                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-2">GST Number*</label>
                  <Input placeholder="Enter GSTIN" {...register('gstNumber')} className="bg-white border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium uppercase" maxLength={15} />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-2">Organization Name</label>
                  <Input placeholder="Registered Company Name" {...register('organizationName')} className="bg-white border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium" />
                </div>
              </div>
            )}

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-sm font-extrabold text-slate-800 mb-2">Locality, City, State*</label>
              <p className="text-xs text-slate-500 mb-2 font-medium">⚠️ For your privacy, please provide only the city, state, or general area. Do not enter your full street address.</p>
              <Input placeholder="e.g. Rajajinagar, Bangalore, Karnataka" {...register('deliveryAddress')} className="bg-slate-50/50 border-slate-200 hover:border-blue-300 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-all font-medium" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 pb-12">
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-14 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 text-white font-bold text-lg rounded-2xl transition-all duration-300 group"
          >
            {loading ? <Spinner className="w-6 h-6 animate-spin mx-auto" /> : 'Post Requirement'}
            {!loading && <span className="ml-2 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-2 group-hover:translate-x-1 transition-all duration-300">→</span>}
          </Button>
        </div>
      </form>

      <Authentication open={authOpen} setOpen={setAuthOpen} />
    </div>
  );
};

export default PostRequirementForm;
