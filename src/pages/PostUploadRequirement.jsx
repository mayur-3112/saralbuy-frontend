import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, UploadCloud } from 'lucide-react';
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
import { useUserState } from '@/redux/hooks/useUser';
import Authentication from '@/components/custom/auth/Authenticate';
import { Spinner } from '@/components/ui/spinner';
import axiosInstance from '@/services/axiosInstance'; // Using raw axios for FormData

const PostUploadRequirement = () => {
  const navigate = useNavigate();
  const { user } = useUserState();
  const dispatachCategory = useCategory();
  const { categories } = useCategoryState();
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatachCategory();
  }, []);

  const { control, register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      categories: [], // Array of selected category IDs
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

  const selectedCategories = watch('categories');

  const toggleCategory = (catId) => {
    const current = selectedCategories || [];
    if (current.includes(catId)) {
      setValue('categories', current.filter(id => id !== catId));
    } else {
      setValue('categories', [...current, catId]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    if (!user?._id) {
      setAuthOpen(true);
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a file document');
      return;
    }

    if (!data.categories || data.categories.length === 0) {
      toast.error('Please select at least one relevant category');
      return;
    }

    if (!data.commonDetails.title) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('categories', JSON.stringify(data.categories));
      formData.append('commonDetails', JSON.stringify(data.commonDetails));

      const response = await axiosInstance.post('/product/upload-multiple-requirement', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Requirements document posted successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to post document requirement');
    } finally {
      setLoading(false);
    }
  };

  const gstField = watch('commonDetails.gst_requirement');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 min-h-screen py-10 bg-gray-50/30">
      <div className="flex gap-2 items-center mb-6">
        <MoveLeft
          className="w-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-2xl font-bold text-gray-800">Upload Requirements Document</h2>
      </div>
      <p className="text-gray-600 mb-8">Have a Bill of Materials, PDF, Excel sheet, or Image? Upload it directly and we will notify sellers in the relevant categories.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Upload Box */}
        <div className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <UploadCloud className="w-16 h-16 text-orange-400 mb-4" />
          <p className="text-gray-700 font-semibold mb-2">Drag and drop your file here, or click to browse</p>
          <p className="text-sm text-gray-500 mb-6">Supported formats: PDF, Excel, Word, JPEG, PNG</p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
          />
          <label 
            htmlFor="file-upload"
            className="px-6 py-2 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Select File
          </label>
          {selectedFile && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded text-orange-800 text-sm font-semibold w-full max-w-md">
              Selected: {selectedFile.name}
            </div>
          )}
        </div>

        {/* Category Multi-Select */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Which categories does this file relate to?*</h3>
          <p className="text-sm text-gray-500 mb-4">Select all applicable categories so the right sellers get notified.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories?.map(cat => (
              <label 
                key={cat._id} 
                className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition-colors ${selectedCategories.includes(cat._id) ? 'bg-orange-50 border-orange-400 text-orange-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium select-none">{cat.categoryName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Common Details Section */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <Input
                placeholder="e.g. Electrical & Hardware BOM for Phase 1"
                {...register('commonDetails.title')}
                className="bg-gray-50"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">General Notes / Description</label>
              <Textarea
                placeholder="Any special instructions for the sellers viewing this document..."
                {...register('commonDetails.description')}
                className="bg-gray-50 min-h-20"
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
            {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Post Uploaded Requirement'}
          </Button>
        </div>
      </form>

      <Authentication open={authOpen} setOpen={setAuthOpen} />
    </div>
  );
};

export default PostUploadRequirement;
