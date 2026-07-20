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

  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingSubCategoryId, setPendingSubCategoryId] = useState(null);
  const [isSubmittingData, setIsSubmittingData] = useState(false);

  useEffect(() => {
    dispatachCategory();
  }, []);

  const { control, register, handleSubmit, watch, setValue, formState: { isDirty } } = useForm({
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

  const handleSave = async (data, isDraft = false) => {
    if (!user?._id) {
      setAuthOpen(true);
      return;
    }

    setIsSubmittingData(true);

    const selectedCat = categories?.find(c => c._id === data.categoryId);
    const hasSubCategories = selectedCat?.subCategories?.length > 0;

    if (!data.title || !data.categoryId || (hasSubCategories && !data.subCategoryId)) {
      toast.error('Please fill in the title, category, and subcategory.');
      setIsSubmittingData(false);
      return;
    }

    if (data.items.length === 0) {
      toast.error('Please add at least one item.');
      setIsSubmittingData(false);
      return;
    }

    if (data.gstRequired === 'yes' && !data.gstNumber) {
      toast.error('Please provide a GST Number.');
      setIsSubmittingData(false);
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
        draft: isDraft,
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
        navigate('/account/requirements');
      } else {
        toast.error(res.data.message || 'Failed to post requirement.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to post requirement.');
    } finally {
      setLoading(false);
      setIsSubmittingData(false);
    }
  };

  const formValues = watch();
  const hasUserChanges = isDirty || 
    (formValues.title && formValues.title.trim() !== '') || 
    formValues.categoryId !== (initialCat || '') ||
    (formValues.items && formValues.items[0]?.itemName?.trim() !== '');

  const shouldBlock = hasUserChanges && !isSubmittingData;

  // useBlocker is not available in the installed react-router-dom v7 build;
  // stub it so the exit-dialog code below doesn't crash.
  const blocker = { state: 'idle', proceed: () => {}, reset: () => {} };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (shouldBlock) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock]);

  const handleBackClick = () => {
    if (shouldBlock) {
      setShowExitWarning(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 min-h-screen py-10 bg-slate-50">
      <div className="flex gap-4 items-center mb-8 pb-4 border-b border-slate-200">
        <div onClick={handleBackClick} className="cursor-pointer">
          <MoveLeft className="w-6 h-6 text-slate-600 hover:text-orange-600 transition-colors" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Post Your Requirement (RFQ)</h2>
          <p className="text-sm text-slate-500 mt-0.5">Publish your requirements to receive competitive bids from verified suppliers.</p>
        </div>
      </div>

      <AlertDialog 
        open={showExitWarning} 
        onOpenChange={(open) => {
          if (!open) {
            setShowExitWarning(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save this requirement as a draft or discard it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => { 
                setShowExitWarning(false);
                if (blocker.state === 'blocked') blocker.proceed();
                else navigate(-1); 
              }} className="text-slate-500 w-full sm:w-auto">
              Leave & Discard
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <AlertDialogCancel onClick={() => {
                setShowExitWarning(false);
                if (blocker.state === 'blocked') blocker.reset();
              }} className="mt-0 w-full sm:w-auto">Cancel</AlertDialogCancel>
              <Button onClick={() => { 
                setShowExitWarning(false); 
                handleSubmit((data) => {
                  handleSave(data, true).then(() => {
                    if (blocker.state === 'blocked') blocker.proceed();
                  });
                })(); 
              }} className="w-full sm:w-auto bg-slate-900 text-white">
                Save as Draft
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form onSubmit={handleSubmit((data) => handleSave(data, false))} className="max-w-3xl mx-auto space-y-6">

          {/* Section 1: Basic Information */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs relative">
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">1</span>
                Basic Information
              </h3>
              <p className="text-sm text-slate-500 mt-1 ml-8">Choose the category that best matches what you need, and give your requirement a clear title.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Title of Requirement*</label>
                <Input placeholder="e.g., Procurement of Seamless Pipes and Tubes" {...register('title')} className="bg-slate-50/50 border-slate-200 focus-visible:ring-orange-500/20 font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category*</label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={(val) => { onChange(val); setValue('subCategoryId', ''); }} disabled={!!initialCat}>
                      <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 focus:ring-orange-500/20 font-medium">
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

              {dynamicSubcategories.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Subcategory*</label>
                  <Controller
                    name="subCategoryId"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onValueChange={onChange}
                        disabled={!selectedCategoryId || !!initialSub}
                      >
                        <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 focus:ring-orange-500/20 font-medium">
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
                  {selectedSubCategory && (selectedSubCategory.name.toLowerCase() === 'other' || selectedSubCategory.name.toLowerCase() === 'others') && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">⚠️</span>
                      <span>Note: Please ensure custom requirements match our platform's building material scope.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Material Items List (single) OR File Upload (upload) */}
          {mode === 'upload' ? (
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">2</span>
                  Upload Your Document
                </h3>
                <p className="text-sm text-slate-500 mt-1 ml-8">Upload your BOQ, Excel sheet, or PDF. Suppliers will quote based on this document.</p>
              </div>
              <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center hover:bg-slate-100 hover:border-orange-300 transition-colors">
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600 mb-1">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-400 mb-4">PDF, Excel, Word, CSV, JPG, PNG — max 2 files</p>
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
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-3 py-2 rounded-lg border border-emerald-100 text-sm font-medium">
                      <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span className="truncate max-w-[260px]">{file.name}</span></div>
                      <button type="button" onClick={() => removeFile(idx)} className="text-emerald-500 hover:text-emerald-800 ml-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">2</span>
                  List of Materials
                </h3>
                <p className="text-sm text-slate-500 mt-1 ml-8">Add each item you need. Specify quantity, unit, and preferred brand so suppliers can quote accurately.</p>
              </div>

              {/* Desktop Material Headers */}
              <div className="hidden sm:grid grid-cols-12 gap-3 mb-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <div className="col-span-3">Item Name</div>
                <div className="col-span-2">Specs / Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Units</div>
                <div className="col-span-2">Brand</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              <div className="space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white sm:bg-slate-50/30 p-4 sm:p-3 rounded-xl sm:rounded-lg border border-slate-200 sm:border-slate-200/60 shadow-sm sm:shadow-none hover:border-orange-400/40 transition-colors">
                    <div className="sm:col-span-3">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Item Name</label>
                      <Input placeholder="e.g., Cement" {...register(`items.${index}.itemName`)} className="bg-white border-slate-200 font-medium text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Specs / Desc</label>
                      <Input placeholder="e.g., Grade 53" {...register(`items.${index}.itemDescription`)} className="bg-white border-slate-200 font-medium text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Quantity</label>
                      <Input type="number" placeholder="Qty" {...register(`items.${index}.quantity`)} className="bg-white border-slate-200 font-medium text-sm" min="1" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block sm:hidden text-xs font-semibold text-slate-400 mb-1">Units</label>
                      <Input
                        list={`unit-options-${index}`}
                        placeholder="e.g. pcs, kg, mtr"
                        {...register(`items.${index}.quantityUnit`)}
                        className="bg-white border-slate-200 font-medium text-sm"
                      />
                      <datalist id={`unit-options-${index}`}>
                        {['pcs', 'ltr', 'kg', 'ft', 'mtr', 'tons', 'bags', 'set', 'rmt', 'sqft', 'nos', 'mt'].map(u => (
                          <option key={u} value={u} />
                        ))}
                      </datalist>
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
                                <SelectItem value="__custom__" className="text-orange-600 font-bold border-t border-slate-100 mt-1">
                                  ✏️ Custom
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end sm:justify-center mt-2 sm:mt-0">
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
                className="mt-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold border border-dashed border-orange-200 text-xs px-4 py-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Another Item
              </Button>
            </div>
          )}

          {/* Section 3: Reference Files & Notes */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">3</span>
                {mode === 'upload' ? 'Additional Notes' : 'Reference Files & Notes'}
              </h3>
              <p className="text-sm text-slate-500 mt-1 ml-8">
                {mode === 'upload'
                  ? 'Add any extra instructions or conditions for suppliers quoting on your document.'
                  : 'Optionally attach reference drawings or documents, and add any specific quotation instructions.'}
              </p>
            </div>

            <div className="space-y-4">
              {mode === 'single' && (
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
                          <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /><span className="truncate max-w-[240px]">{file.name}</span></div>
                          <button type="button" onClick={() => removeFile(idx)} className="text-emerald-500 hover:text-emerald-800"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Other Terms / Notes</label>
                <Textarea
                  placeholder="Quotation instructions, brand preferences, specific conditions..."
                  {...register('otherTerms')}
                  className="bg-slate-50/50 border-slate-200 font-medium min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Timeline & Payment */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">4</span>
                Timeline & Payment
              </h3>
              <p className="text-sm text-slate-500 mt-1 ml-8">Set your delivery deadline, how long suppliers can bid, and how you prefer to pay.</p>
            </div>

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
                <div className="space-y-4 p-4 bg-orange-50/30 border border-orange-100 rounded-lg">
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

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmittingData}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 hover:shadow-lg text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmittingData ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {selectedFiles.length > 0 ? 'Uploading & Posting…' : 'Posting Requirement…'}
              </>
            ) : (
              <>Post Requirement <span>→</span></>
            )}
          </Button>

      </form>

      <Authentication open={authOpen} setOpen={setAuthOpen} />
    </div>
  );
};

export default PostRequirementForm;
