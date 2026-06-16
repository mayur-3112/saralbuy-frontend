import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, Plus, Trash2, Layers } from 'lucide-react';
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
import { DatePicker } from '@/lib/DatePicker';
import { toast } from 'sonner';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import productService from '@/services/product.service';
import { useUserState } from '@/redux/hooks/useUser';
import Authentication from '@/components/custom/auth/Authenticate';
import { Spinner } from '@/components/ui/spinner';

const CategoryGroup = ({ nestIndex, control, register, watch, setValue, removeGroup, categories }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categoryGroups.${nestIndex}.items`,
  });

  const selectedCategoryId = watch(`categoryGroups.${nestIndex}.categoryId`);
  const selectedCategory = categories?.find(c => c._id === selectedCategoryId);
  const subCategories = selectedCategory?.subCategories || [];

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm relative mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-500" />
          Category Group #{nestIndex + 1}
        </h3>
        <button type="button" onClick={() => removeGroup(nestIndex)} className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Remove Group
        </button>
      </div>

      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Main Category*</label>
          <Controller
            name={`categoryGroups.${nestIndex}.categoryId`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={(val) => {
                onChange(val);
                // Reset all subcategories in this group when main category changes
                fields.forEach((_, i) => setValue(`categoryGroups.${nestIndex}.items.${i}.subCategoryId`, ''));
              }}>
                <SelectTrigger className="w-full md:w-1/2 bg-white">
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
        </div>

        {/* Category Level Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description for this Category (Optional)</label>
          <Textarea
            placeholder="Add any specific instructions, requirements, or general notes for all items in this category..."
            {...register(`categoryGroups.${nestIndex}.description`)}
            className="bg-gray-50 text-sm min-h-20"
          />
        </div>

        {/* Items Array */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Items in this Category</h4>
          <div className="space-y-3">
            {fields.map((item, k) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="md:col-span-3">
                  <Controller
                    name={`categoryGroups.${nestIndex}.items.${k}.subCategoryId`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange} disabled={!selectedCategoryId}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Subcategory*" />
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
                
                <div className="md:col-span-2">
                  <Input
                    placeholder="Brand (e.g. Tata)"
                    {...register(`categoryGroups.${nestIndex}.items.${k}.brand`)}
                    className="bg-white"
                  />
                </div>

                <div className="md:col-span-4">
                  <Input
                    placeholder="Specifications / Type / Model"
                    {...register(`categoryGroups.${nestIndex}.items.${k}.typeOfProduct`)}
                    className="bg-white"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Qty*"
                    {...register(`categoryGroups.${nestIndex}.items.${k}.quantity`)}
                    className="w-full bg-white"
                    min="1"
                  />
                  <Controller
                    name={`categoryGroups.${nestIndex}.items.${k}.quantityUnit`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="w-20 bg-white px-2">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ltr">Ltr</SelectItem>
                          <SelectItem value="kg">KG</SelectItem>
                          <SelectItem value="pcs">Pcs</SelectItem>
                          <SelectItem value="ft">Ft</SelectItem>
                          <SelectItem value="mtr">Mtr</SelectItem>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="md:col-span-1 flex justify-center mt-2 md:mt-0">
                  <button type="button" onClick={() => remove(k)} className="text-gray-400 hover:text-red-500 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => append({ subCategoryId: '', brand: '', quantity: '', quantityUnit: 'pcs', typeOfProduct: '' })}
            className="mt-3 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item Row
          </Button>
        </div>
      </div>
    </div>
  );
};

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
      categoryGroups: [
        {
          categoryId: '',
          description: '',
          items: [
            {
              subCategoryId: '',
              brand: '',
              quantity: '',
              quantityUnit: 'pcs',
              typeOfProduct: '',
            },
          ],
        }
      ],
      commonDetails: {
        title: '',
        description: '', // Fallback description if group description is empty
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
    name: 'categoryGroups',
  });

  const onSubmit = async (data) => {
    if (!user?._id) {
      setAuthOpen(true);
      return;
    }

    if (data.categoryGroups.length === 0) {
      toast.error('Please add at least one category group');
      return;
    }

    // Validate
    for (let i = 0; i < data.categoryGroups.length; i++) {
      const group = data.categoryGroups[i];
      if (!group.categoryId) {
        toast.error(`Please select a Category for Group #${i + 1}`);
        return;
      }
      if (group.items.length === 0) {
        toast.error(`Please add at least one item in Group #${i + 1}`);
        return;
      }
      for (let j = 0; j < group.items.length; j++) {
        if (!group.items[j].subCategoryId) {
          toast.error(`Please select a Subcategory for Item #${j + 1} in Group #${i + 1}`);
          return;
        }
      }
    }

    if (!data.commonDetails.title) {
      toast.error('Please enter a common title');
      return;
    }

    setLoading(true);
    try {
      // Map names before sending
      const mappedGroups = data.categoryGroups.map(group => {
        const cat = categories?.find(c => c._id === group.categoryId);
        const mappedItems = group.items.map(item => {
          const sub = cat?.subCategories?.find(s => s._id === item.subCategoryId);
          return {
            ...item,
            subCategoryName: sub?.name || '',
          };
        });
        return {
          ...group,
          items: mappedItems
        };
      });

      const payload = {
        commonDetails: data.commonDetails,
        categoryGroups: mappedGroups,
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
    <div className="w-full max-w-5xl mx-auto px-4 min-h-screen py-10 bg-gray-50/30">
      <div className="flex gap-2 items-center mb-6">
        <MoveLeft
          className="w-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-2xl font-bold text-gray-800">Post Multiple Requirements</h2>
      </div>
      <p className="text-gray-600 mb-8">Group your items by category, add their specific details, and submit them together.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Category Groups Section */}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <CategoryGroup
              key={field.id}
              nestIndex={index}
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              removeGroup={remove}
              categories={categories}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ categoryId: '', description: '', items: [{ subCategoryId: '', brand: '', quantity: '', quantityUnit: 'pcs', typeOfProduct: '' }] })}
            className="w-full border-dashed border-2 border-orange-300 text-orange-600 bg-orange-50/50 hover:bg-orange-100 hover:border-orange-400 py-8 mb-8"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Another Category Group
          </Button>
        </div>

        {/* Common Details Section */}
        <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Common Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Title*</label>
              <Input
                placeholder="e.g. Project Phase 1 Materials"
                {...register('commonDetails.title')}
                className="bg-gray-50"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Minimum Budget (Optional)</label>
              <p className="absolute top-[34px] left-3 text-sm text-orange-600 font-semibold">₹</p>
              <Input
                type="number"
                placeholder="0.00"
                {...register('commonDetails.minimumBudget')}
                className="bg-gray-50 pl-7"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <Controller
                control={control}
                name="commonDetails.paymentAndDelivery.ex_deliveryDate"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value}
                    title="Select Date"
                    disabledBeforeDate={new Date()}
                    setDate={onChange}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <Controller
                name="commonDetails.paymentAndDelivery.paymentMode"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full bg-gray-50">
                      <SelectValue placeholder="Select Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank or online">Banking or Online mode</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Input Required?</label>
              <Controller
                name="commonDetails.gst_requirement"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full bg-gray-50">
                      <SelectValue placeholder="Select Yes/No" />
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
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <Input
                    placeholder="Enter GSTIN"
                    {...register('commonDetails.paymentAndDelivery.gstNumber')}
                    className="bg-gray-50"
                    maxLength={15}
                    onChange={(e) => setValue('commonDetails.paymentAndDelivery.gstNumber', e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
                  <Input
                    placeholder="Registered Company Name"
                    {...register('commonDetails.paymentAndDelivery.organizationName')}
                    className="bg-gray-50"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-64 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-full"
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
