import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/lib/DatePicker';
import { toast } from 'sonner';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import productService from '@/services/product.service';
import { useUserState } from '@/redux/hooks/useUser';
import Authentication from '@/components/custom/auth/Authenticate';
import { Spinner } from '@/components/ui/spinner';

const PostMultipleRequirements = () => {
  const navigate = useNavigate();
  const { user } = useUserState();
  const dispatachCategory = useCategory();
  const { categories } = useCategoryState();
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    dispatachCategory();
  }, []);

  const { control, register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      items: [
        {
          categoryId: '',
          subCategoryId: '',
          brand: '',
          quantity: '',
          quantityUnit: 'pcs',
          typeOfProduct: '',
        },
      ],
      commonDetails: {
        title: '',
        description: '',
        minimumBudget: '',
        paymentAndDelivery: {
          ex_deliveryDate: undefined,
          paymentMode: '',
          gstNumber: '',
          organizationName: '',
          organizationAddress: '',
        },
        draft: false,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data) => {
    if (!user?._id) {
      setAuthOpen(true);
      return;
    }

    if (data.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    // Validate
    for (let i = 0; i < data.items.length; i++) {
      if (!data.items[i].categoryId || !data.items[i].subCategoryId) {
        toast.error(`Please select Category and Subcategory for Item #${i + 1}`);
        return;
      }
    }

    if (!data.commonDetails.title) {
      toast.error('Please enter a common title');
      return;
    }

    setLoading(true);
    try {
      // Map names before sending
      const mappedItems = data.items.map(item => {
        const cat = categories?.find(c => c._id === item.categoryId);
        const sub = cat?.subCategories?.find(s => s._id === item.subCategoryId);
        return {
          ...item,
          subCategoryName: sub?.name || '',
        };
      });

      const payload = {
        commonDetails: data.commonDetails,
        items: mappedItems,
      };

      await productService.addMultipleProducts(payload);
      toast.success('Multiple requirements posted successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post requirements');
    } finally {
      setLoading(false);
    }
  };

  const gstField = watch('commonDetails.gst_requirement');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 min-h-screen py-10">
      <div className="flex gap-2 items-center mb-6">
        <MoveLeft
          className="w-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-2xl font-bold text-gray-800">Post Multiple Requirements</h2>
      </div>
      <p className="text-gray-600 mb-8">Build your list of items across different categories, then submit them together as separate category posts.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Items Section */}
        <div className="space-y-6">
          {fields.map((field, index) => {
            const selectedCategoryId = watch(`items.${index}.categoryId`);
            const selectedCategory = categories?.find(c => c._id === selectedCategoryId);
            const subCategories = selectedCategory?.subCategories || [];
            const catName = selectedCategory?.categoryName?.toLowerCase() || '';

            return (
              <div key={field.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <h3 className="text-sm font-bold text-gray-400">Item #{index + 1}</h3>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Category */}
                  <Controller
                    name={`items.${index}.categoryId`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={(val) => {
                        onChange(val);
                        setValue(`items.${index}.subCategoryId`, ''); // Reset subcat on cat change
                      }}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Category*" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map(c => (
                            <SelectItem key={c._id} value={c._id}>{c.categoryName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {/* SubCategory */}
                  <Controller
                    name={`items.${index}.subCategoryId`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange} disabled={!selectedCategoryId}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Subcategory*" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map(sub => (
                            <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {/* Brand */}
                  <Input
                    placeholder="Brand (or 'General')"
                    {...register(`items.${index}.brand`)}
                    className="bg-white"
                  />

                  {/* Qty & Unit */}
                  <div className="flex items-center gap-2">
                    <Controller
                      name={`items.${index}.quantityUnit`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select value={value} onValueChange={onChange}>
                          <SelectTrigger className="w-[80px] bg-white">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ltr">Ltr</SelectItem>
                            <SelectItem value="kg">KG</SelectItem>
                            <SelectItem value="pcs">Pcs</SelectItem>
                            <SelectItem value="ft">Ft</SelectItem>
                            <SelectItem value="mtr">Mtr</SelectItem>
                            <SelectItem value="tons">Tons</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      type="number"
                      placeholder="Qty*"
                      {...register(`items.${index}.quantity`)}
                      className="flex-1 bg-white"
                      min="1"
                    />
                  </div>

                  {/* Type of Product */}
                  <Input
                    placeholder="Type / Model / Specifics"
                    {...register(`items.${index}.typeOfProduct`)}
                    className="bg-white"
                  />
                  
                  {/* Additional dynamic fields could go here based on catName */}
                  {catName === 'fashion' && (
                    <Controller
                      name={`items.${index}.gender`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select value={value} onValueChange={onChange}>
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
                    />
                  )}
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ categoryId: '', subCategoryId: '', brand: '', quantity: '', quantityUnit: 'pcs', typeOfProduct: '' })}
            className="w-full border-dashed border-2 border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 py-8"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Another Item
          </Button>
        </div>

        {/* Common Details Section */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Overall Details (Applied to all items)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Overall Title* (e.g. Project Phase 1 Materials)"
              {...register('commonDetails.title')}
              className="bg-white col-span-1 md:col-span-2"
            />
            <Textarea
              placeholder="Overall Description / Notes for Sellers"
              {...register('commonDetails.description')}
              className="bg-white col-span-1 md:col-span-2 min-h-24"
            />
            <div className="relative">
              <p className="absolute top-1/2 left-2 text-sm text-orange-600 font-semibold -translate-y-1/2">₹</p>
              <Input
                type="number"
                placeholder="Total Minimum Budget (Optional)"
                {...register('commonDetails.minimumBudget')}
                className="bg-white pl-5"
              />
            </div>
            
            <Controller
              control={control}
              name="commonDetails.paymentAndDelivery.ex_deliveryDate"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  date={value}
                  title="Delivery Date"
                  disabledBeforeDate={new Date()}
                  setDate={onChange}
                />
              )}
            />

            <Controller
              name="commonDetails.paymentAndDelivery.paymentMode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank or online">Banking or Online mode</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="commonDetails.gst_requirement"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="GST Input Required?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {gstField === 'yes' && (
              <>
                <Input
                  placeholder="GST Number"
                  {...register('commonDetails.paymentAndDelivery.gstNumber')}
                  className="bg-white"
                  maxLength={15}
                  onChange={(e) => setValue('commonDetails.paymentAndDelivery.gstNumber', e.target.value.toUpperCase())}
                />
                <Input
                  placeholder="Entity Name"
                  {...register('commonDetails.paymentAndDelivery.organizationName')}
                  className="bg-white"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-64 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg"
          >
            {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Post All Requirements'}
          </Button>
        </div>
      </form>

      <Authentication open={authOpen} setOpen={setAuthOpen} />
    </div>
  );
};

export default PostMultipleRequirements;
