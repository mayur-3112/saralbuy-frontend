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
    <div className="w-full max-w-7xl mx-auto px-4 min-h-screen py-10 bg-slate-50">
      <div className="flex gap-4 items-center mb-8 pb-4 border-b border-slate-200">
        <MoveLeft className="w-6 h-6 cursor-pointer text-slate-600 hover:text-blue-600 transition-colors" onClick={() => navigate(-1)} />
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Post Your Requirement (RFQ)</h2>
          <p className="text-sm text-slate-500 mt-0.5">Publish your requirements to receive competitive bids from verified suppliers.</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product/Category Info & Materials Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs relative">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">1</span>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Title of Requirement*</label>
                <Input placeholder="e.g., Procurement of Seamless Pipes and Tubes" {...register('title')} className="bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category*</label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={(val) => { onChange(val); setValue('subCategoryId', ''); }} disabled={!!initialCat}>
                      <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 focus:ring-blue-500/20 font-medium">
                        <SelectValue placeholder="Select Category" />
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Subcategory*</label>
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
                      disabled={!selectedCategoryId || !!initialSub}
                    >
                      <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 focus:ring-blue-500/20 font-medium">
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

          {/* Section 2: Material Items List */}
          {mode === 'single' && (
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">2</span>
                List of Materials
              </h3>

              {/* Desktop Material Headers */}
              <div className="hidden sm:grid grid-cols-12 gap-3 mb-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <div className="col-span-3">Item Name</div>
                <div className="col-span-3">Specs / Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-1.5">Units</div>
                <div className="col-span-2">Brand</div>
                <div className="col-span-0.5 text-center">Action</div>
              </div>

              <div className="space-y-3">
                {fields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/30 p-3 rounded-lg border border-slate-200/60 hover:border-blue-400/40 transition-colors">
                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Item Name</label>
                      <Input placeholder="e.g., Cement" {...register(`items.${index}.itemName`)} className="bg-white border-slate-200 font-medium text-sm" />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Specs / Desc</label>
                      <Input placeholder="e.g., Grade 53" {...register(`items.${index}.itemDescription`)} className="bg-white border-slate-200 font-medium text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Quantity</label>
                      <Input type="number" placeholder="Qty" {...register(`items.${index}.quantity`)} className="bg-white border-slate-200 font-medium text-sm" min="1" />
                    </div>

                    <div className="sm:col-span-1.5">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Units</label>
                      <Controller
                        name={`items.${index}.quantityUnit`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select value={value} onValueChange={onChange}>
                            <SelectTrigger className="bg-white border-slate-200 font-medium text-sm">
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

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Brand</label>
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
                                placeholder="Brand..."
                                className="bg-white border-slate-200 font-medium text-sm flex-1"
                                autoFocus={value === '__custom__'}
                                onChange={(e) => onChange(e.target.value)}
                                onBlur={(e) => {
                                  if (!e.target.value.trim()) onChange('Any');
                                }}
                              />
                              <button
                                type="button"
                                className="text-xs text-slate-400 hover:text-slate-600 px-1 shrink-0 font-bold"
                                onClick={() => onChange('Any')}
                              >✕</button>
                            </div>
                          ) : (
                            <Select value={value} onValueChange={onChange}>
                              <SelectTrigger className="bg-white border-slate-200 font-medium text-sm">
                                <SelectValue placeholder="Brand" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableBrands.map(b => (
                                  <SelectItem key={b} value={b}>{b}</SelectItem>
                                ))}
                                <SelectItem value="__custom__" className="text-blue-600 font-bold border-t border-slate-100 mt-1">
                                  ✏️ Custom
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    </div>

                    <div className="sm:col-span-0.5 flex justify-end sm:justify-center mt-2 sm:mt-0">
                      <button type="button" onClick={() => remove(index)} disabled={fields.length <= 1} className={`p-1.5 rounded transition-colors ${fields.length <= 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`} title="Delete Item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => append({ itemName: '', itemDescription: '', quantity: '', quantityUnit: 'pcs', brand: 'Any' })}
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold border border-dashed border-blue-200 text-xs px-4 py-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Another Item
              </Button>
            </div>
          )}
        </div>

        {/* Right Side: Delivery, Terms & Submit Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 3: Delivery Terms */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">3</span>
              Timeline & Payment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Delivery Date</label>
                <Controller
                  control={control}
                  name="deliveryDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker date={value} title="Select Date" disabledBeforeDate={new Date()} setDate={onChange} />
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Bid Valid Until</label>
                <Controller
                  control={control}
                  name="expiryDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker date={value} title="Select Expiry" disabledBeforeDate={new Date()} setDate={onChange} />
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Mode</label>
                <Controller
                  name="paymentMode"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 font-medium">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">GST Input Required?</label>
                <Controller
                  name="gstRequired"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 font-medium">
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
                <div className="space-y-4 p-4 bg-blue-50/30 border border-blue-100 rounded-lg">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">GST Number*</label>
                    <Input placeholder="Enter GSTIN" {...register('gstNumber')} className="bg-white border-slate-200 font-medium uppercase" maxLength={15} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Organization Name</label>
                    <Input placeholder="Registered Company Name" {...register('organizationName')} className="bg-white border-slate-200 font-medium" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Locality, City, State*</label>
                <p className="text-[10px] text-slate-400 mb-1.5 font-medium">⚠️ Provide general area (e.g. city/state), not full street address.</p>
                <Input placeholder="e.g. Indiranagar, Bangalore, KA" {...register('deliveryAddress')} className="bg-slate-50/50 border-slate-200 font-medium" />
              </div>
            </div>
          </div>

          {/* Section 4: Attachments & Notes */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">4</span>
              Files & Terms
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Attachments (Max 2)</label>
                <div className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center hover:bg-slate-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.png"
                  />
                  <Button type="button" variant="outline" className="font-bold border-slate-300 bg-white text-xs h-8 px-3" onClick={() => fileInputRef.current.click()}>
                    Choose Files
                  </Button>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded border border-emerald-100 text-xs font-medium">
                        <span className="truncate max-w-[160px]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-emerald-500 hover:text-emerald-800">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Other Terms / Notes</label>
                <Textarea
                  placeholder="Quotation instructions, brand preferences, specific conditions..."
                  {...register('otherTerms')}
                  className="bg-slate-50/50 border-slate-200 font-medium min-h-[90px]"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {loading ? <span className="animate-spin mr-2">⏳</span> : 'Post Requirement'}
            {!loading && <span>→</span>}
          </Button>
        </div>
      </form>

      <Authentication open={authOpen} setOpen={setAuthOpen} />
    </div>
  );
};

export default PostRequirementForm;
