import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  // CloudUpload,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import userService from '@/services/user.service';
import { useDispatchUser, useUserState } from '@/redux/hooks/useUser';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema } from '@/validations/Schema';
import Authentication from '@/components/custom/auth/Authenticate';
import BusinessVerification from '@/components/custom/profile/BusinessVerification';

export function AccountSettings() {
  const [fileDoc, _] = useState(null);
  const { user } = useUserState();
  const { updateUserState } = useDispatchUser();
  const [open, setOpen] = useState(false);

  const {
    fn: updateProfilefn,
    data: updateProfileRes,
    loading,
  } = useFetch(userService.updateProfile);

  const { fn: logoutFn, data: logoutRes, loading: logoutLoading } = useFetch(userService.logout);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      accountRole: 'buyer',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      businessName: '',
      organizationName: '',
      procurementRole: '',
      gstin: '',
      supplierCategories: '',
    },
  });

  useEffect(() => {
    if (logoutRes) {
      toast.success('You are Logged out');

      updateUserState(null);

      reset({
        phone: '',
        fullName: '',
        email: '',
        address: '',
        businessName: '',
      });
    }
  }, [logoutRes]);

  useEffect(() => {
    if (user) {
      reset({
        accountRole: user?.accountRole || 'buyer',
        phone: user?.phone || '',
        fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.email || '',
        address: user?.address || '',
        businessName: user?.businessName || '',
        organizationName: user?.organizationName || '',
        procurementRole: user?.procurementRole || '',
        gstin: user?.gstin || '',
        supplierCategories: user?.supplierCategories || '',
      });
    }
  }, [user, reset]);

  const selectedRole = watch('accountRole');

  function senitizeField(str, fieldName) {
    if (str.replace(/\s/g, '') === '') {
      return toast.error(fieldName + ' is required');
    }
  }

  async function onSubmit(data) {
    const formData = new FormData();

    senitizeField(data.fullName, 'Full Name');
    senitizeField(data.email, 'Email');

    // Backend still stores firstName/lastName separately — split the single
    // Full Name field the same way mergeName() joins them back for display.
    const nameParts = data.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', data.email);
    formData.append('address', data.address);
    formData.append('accountRole', data.accountRole);

    // A single account can act as both buyer and supplier — save whichever
    // of the two field-sets the user filled in, not just the one matching
    // "Primary Account Role" (that field now only picks the default view/badge).
    formData.append('businessName', data.businessName || '');
    formData.append('gstin', data.gstin || '');
    formData.append('supplierCategories', data.supplierCategories || '');
    formData.append('organizationName', data.organizationName || '');
    formData.append('procurementRole', data.procurementRole || '');

    if (fileDoc) {
      formData.append('document', fileDoc);
    }

    await updateProfilefn(formData);
  }

  useEffect(() => {
    if (updateProfileRes) {
      updateUserState(updateProfileRes);
      toast.success('Profile updated successfully');
    }
  }, [updateProfileRes]);

  useEffect(() => {
    if (!user?.firstName && !user?.phone && !user?.lastName && !user?.email && !user?.address) {
      return;
    }

    for (let i = 0; i < Object.entries(errors).length; i++) {
      toast.error(Object.entries(errors)[i][1]?.message);
      break;
    }
  }, [errors]);

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-semibold w-full mb-3">
        <p className="font-bold text-lg sm:text-xl tracking-tight text-gray-600">Profile Details</p>
      </div>

      <Authentication setOpen={setOpen} open={open} />

      <Card className="shadow-none bg-transparent border-0 outline-0 py-0 w-full">
        <form
          onSubmit={handleSubmit(onSubmit, () => {
            if (!user) {
              setOpen(true);
            }
          })}
          className="p-2 sm:p-3 md:p-4"
        >
          <div className="space-y-4 p-3 sm:p-5 rounded-md">
            
            {/* Account Role — decides which section shows below. Backend
                still allows any account to post requirements AND place bids
                regardless of this value; it's purely a UI/display choice. */}
            <div className="mb-6">
              <Label className="text-gray-600 gap-0 text-sm mb-2 block">
                Primary Account Role
              </Label>
              <p className="text-xs text-slate-500 mb-2">
                Switch this to change which details section appears below.
              </p>
              <div className="flex bg-slate-100 rounded-lg p-1 w-full max-w-sm relative">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" value="buyer" {...register('accountRole')} className="peer sr-only" />
                  <div className="py-2 text-center text-sm font-semibold transition-all duration-200 rounded-md peer-checked:text-orange-600 peer-checked:bg-white peer-checked:shadow-sm text-slate-500 hover:text-slate-700">
                    As a Buyer
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" value="supplier" {...register('accountRole')} className="peer sr-only" />
                  <div className="py-2 text-center text-sm font-semibold transition-all duration-200 rounded-md peer-checked:text-orange-600 peer-checked:bg-white peer-checked:shadow-sm text-slate-500 hover:text-slate-700">
                    As a Supplier
                  </div>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2 w-full">
              <Label className="text-gray-600 gap-0 text-sm" htmlFor="full-name">
                Full Name
                <span className="text-red-500">*</span>
              </Label>

              <Input
                id="full-name"
                placeholder="Enter full name"
                className="bg-transparent w-full"
                {...register('fullName')}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label className="text-gray-600 gap-0 text-sm" htmlFor="email">
                  Email
                  <span className="text-red-500">*</span>
                </Label>

                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register('email')}
                    className="bg-transparent w-full"
                  />

                  <Button
                    type="button"
                    variant="link"
                    className="p-0 text-xs sm:text-sm text-orange-600 bg-transparent hover:underline cursor-pointer h-auto shrink-0"
                  >
                    Verify Email
                  </Button>
                </div>
              </div>

              <div className="space-y-2 cursor-not-allowed w-full">
                <Label className="text-gray-600 gap-0 text-sm" htmlFor="phone">
                  Phone
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  disabled
                  type="text"
                  inputMode="numeric"
                  className="bg-transparent w-full disabled:opacity-75 disabled:bg-slate-50"
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
                <p className="text-xs text-slate-500 mt-1">
                  To update your registered phone number, please contact support.
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 w-full">
              <Label className="text-gray-600 gap-0 text-sm" htmlFor="address">
                Address
                <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Textarea
                  cols={10}
                  id="address"
                  className="min-h-24 w-full max-w-full whitespace-pre-wrap break-words resize-none"
                  placeholder="Enter address"
                  {...register('address')}
                />
              </div>
            </div>

            {/* Buyer fields — shown only when Primary Account Role is Buyer */}
            {selectedRole !== 'supplier' && (
            <div className="space-y-2">
              <Label className="text-gray-600 text-sm font-semibold">Buyer Details</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                <div className="space-y-2 w-full">
                  <Label className="text-gray-600 text-sm" htmlFor="orgName">
                    Organization Name
                  </Label>
                  <Input id="orgName" type="text" placeholder="e.g. BuildRight Projects" {...register('organizationName')} className="bg-white w-full" />
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-gray-600 text-sm" htmlFor="procurementRole">
                    Procurement Role
                  </Label>
                  <Input id="procurementRole" type="text" placeholder="e.g. Purchasing Manager" {...register('procurementRole')} className="bg-white w-full" />
                </div>
                <div className="space-y-2 w-full sm:col-span-2">
                  <Label className="text-gray-600 text-sm" htmlFor="buyer-gstin">
                    GST Number <span className="text-slate-400 font-normal">(if applicable)</span>
                  </Label>
                  <Input id="buyer-gstin" type="text" placeholder="27XXXXX... (optional)" {...register('gstin')} className="bg-white w-full uppercase" />
                </div>
              </div>
            </div>
            )}

            {/* Supplier fields — shown only when Primary Account Role is Supplier */}
            {selectedRole === 'supplier' && (
            <div className="space-y-2">
              <Label className="text-gray-600 text-sm font-semibold">Supplier Details</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-md border border-orange-100">
                <div className="space-y-2 w-full sm:col-span-2">
                  <Label className="text-gray-600 text-sm" htmlFor="business">
                    Registered Business Name
                  </Label>
                  <Input id="business" type="text" placeholder="e.g. Acme Corp Ltd." {...register('businessName')} className="bg-white w-full" />
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-gray-600 text-sm" htmlFor="gstin">
                    GSTIN Number
                  </Label>
                  <Input id="gstin" type="text" placeholder="27XXXXX..." {...register('gstin')} className="bg-white w-full uppercase" />
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-gray-600 text-sm" htmlFor="supplierCategories">
                    Primary Categories Supplied
                  </Label>
                  <Input id="supplierCategories" type="text" placeholder="e.g. Cement, Steel, Electrical" {...register('supplierCategories')} className="bg-white w-full" />
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            {user ? (
              <Button
                disabled={logoutLoading}
                className="w-full sm:w-32 cursor-pointer text-sm"
                variant="destructive"
                onClick={() => logoutFn()}
                type="button"
              >
                {logoutLoading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Log out'}
              </Button>
            ) : (
              <Button
                className="w-full sm:w-32 cursor-pointer text-sm bc"
                onClick={() => setOpen(true)}
                type="button"
              >
                Login
              </Button>
            )}

            <Button
              type="submit"
              className="cursor-pointer w-full sm:w-32 bc text-sm"
              disabled={loading}
            >
              {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Business verification (Aadhaar replacement — GSTIN/PAN) */}
      <div className="mt-6">
        <BusinessVerification />
      </div>
    </div>
  );
}
