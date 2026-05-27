import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  // CloudUpload,
  Plus,
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
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      aadhaarNumber: '',
      businessName: '',
    },
  });

  useEffect(() => {
    if (logoutRes) {
      toast.success('You are Logged out');

      updateUserState(null);

      reset({
        phone: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        aadhaarNumber: '',
        businessName: '',
      });
    }
  }, [logoutRes]);

  useEffect(() => {
    if (user) {
      reset({
        phone: user?.phone || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        address: user?.address || '',
        aadhaarNumber: user?.aadhaarNumber || '',
        businessName: user?.businessName || '',
      });
    }
  }, [user, reset]);

  function senitizeField(str, fieldName) {
    if (str.replace(/\s/g, '') === '') {
      return toast.error(fieldName + ' is required');
    }
  }

  async function onSubmit(data) {
    const formData = new FormData();

    senitizeField(data.firstName, 'First Name');
    senitizeField(data.lastName, 'Last Name');
    senitizeField(data.email, 'Email');

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('address', data.address);
    formData.append('aadhaarNumber', data.aadhaarNumber);
    formData.append('businessName', data.businessName);

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
            {/* First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label className="text-gray-600 gap-0 text-sm" htmlFor="first-name">
                  First Name
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="first-name"
                  placeholder="Enter first name"
                  className="bg-transparent w-full"
                  {...register('firstName')}
                />
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-gray-600 gap-0 text-sm" htmlFor="last-name">
                  Last Name
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="last-name"
                  placeholder="Enter last name"
                  className="bg-transparent w-full"
                  {...register('lastName')}
                />
              </div>
            </div>

            {/* Business Name */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2 w-full">
                <Label className="text-gray-600 text-sm" htmlFor="business">
                  Business Name
                </Label>

                <div className="flex items-center gap-2 relative">
                  <Input
                    id="business"
                    type="text"
                    placeholder="Business Name"
                    {...register('businessName')}
                    className="pr-16 bg-transparent w-full"
                  />
                </div>
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label className="text-gray-600 gap-0 text-sm" htmlFor="email">
                  Email
                  <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register('email')}
                    className="bg-transparent w-full pr-28 sm:pr-32"
                  />

                  <p
                    type="button"
                    variant="link"
                    className="p-0 text-xs sm:text-sm text-orange-600 bg-transparent hover:underline cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Verify Email
                  </p>
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
                  className="bg-transparent w-full"
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
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
                disabled={logoutLoading}
                className="w-full sm:w-32 cursor-pointer text-sm bc"
                onClick={() => logoutFn()}
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
    </div>
  );
}
