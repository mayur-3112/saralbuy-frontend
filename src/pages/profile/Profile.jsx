import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Camera, House } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavLink } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import userService from '@/services/user.service';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useDispatchUser, useUserState } from '@/redux/hooks/useUser';
import { fallBackName } from '@/utils/fallBackName';
import { Spinner } from '@/components/ui/spinner';
const getRoutePath = value => {
  switch (value) {
    case 'profile':
      return '/account';
    case 'your_biding':
      return '/account/bid';
    case 'requirements':
      return '/account/requirements';
    case 'your_deal':
      return '/account/deal';
    case 'notifications':
      return '/account/notification';
    case 'faq':
      return '/faq';
    case 'about_us':
      return '/about-us';
    case 'contact_us':
      return '/contact-us';
    default:
      return '/account';
  }
};

const tags = [
  {
    title: 'Settings',
    value: 'profile',
  },
  {
    title: 'Quotes Submitted',
    value: 'your_biding',
  },
  {
    title: 'Requirements (Posted / Draft)',
    value: 'requirements',
  },
  {
    title: 'Closed Deals',
    value: 'your_deal',
  },
  {
    title: 'Notifications',
    value: 'notifications',
  },
  {
    title: 'FAQs',
    value: 'faq',
  },
  {
    title: 'About Us',
    value: 'about_us',
  },
  {
    title: 'Contact Us',
    value: 'contact_us',
  },
];

const Profile = () => {
  const { user } = useUserState();
  const { dispatchUser } = useDispatchUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    fn: updateProfilefn,
    data: updateProfileRes,
    loading: updateProfileLoading,
  } = useFetch(userService.updateProfile);
  const avatarRef = useRef(null);
  const handleUpdateProfile = async () => {
    const formData = new FormData();
    if (avatarRef.current && avatarRef.current.files) {
      const file = avatarRef.current.files[0];
      const maxSize = 2 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG or WEBP images are allowed');
        avatarRef.current.value = '';
        return;
      }

      if (file.size > maxSize) {
        toast.error('Image size should be less than 2MB');
        avatarRef.current.value = '';
        return;
      }
      formData.append('image', file);
    }
    await updateProfilefn(formData);
  };

  useEffect(() => {
    if (updateProfileRes) {
      dispatchUser(updateProfileRes);
      toast.success('Profile updated successfully');
    }
  }, [updateProfileRes]);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-6 px-4 ">
      {/* Breadcrumb */}
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <BreadcrumbPage className="capitalize font-regular text-gray-500">
              <House className="w-5 h-5" />
            </BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular  font-semibold">
              Account
            </BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-orange-600 font-semibold">
              {pathname.split('/')[2] || 'Profile'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col space-y-4 bg-white border border-slate-200 shadow-sm p-5 rounded-lg sticky top-24 self-start">
            <div className="flex flex-col items-center mt-2 mb-4 relative">
              <div className="relative">
                <Avatar className="w-28 h-28 border-gray-600 border-3 flex ">
                  {updateProfileLoading ? (
                    <div className="h-full w-full  flex items-center justify-center object-contain">
                      <Spinner className="w-5 h-5 text-orange-500" />
                    </div>
                  ) : (
                    <AvatarImage
                      src={user?.profileImage || '/avatar.jpg'}
                      className="w-full h-full object-contain rounded-full"
                    />
                  )}

                  {!updateProfileLoading && user?.profileImage && (
                    <AvatarFallback>
                      {fallBackName(`${user?.firstName} ${user?.lastName}`)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  type="file"
                  name="image"
                  hidden
                  id=""
                  ref={avatarRef}
                  onChange={handleUpdateProfile}
                />
                <button
                  disabled={updateProfileLoading}
                  onClick={e => {
                    e.preventDefault();
                    if (avatarRef) {
                      avatarRef.current?.click();
                    }
                  }}
                  className="absolute bottom-4 cursor-pointer right-0 bg-gray-500 p-1 rounded-full shadow-md hover:bg-gray-400"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <a
              onClick={e => {
                e.preventDefault();
                if (avatarRef) {
                  avatarRef.current?.click();
                }
              }}
              href="javascript:void(0)"
              className="mt-4 mb-2 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline text-center"
            >
              Update Photo
            </a>

            <div className="flex flex-col gap-1 mt-4 border-t border-slate-100 pt-4">
              {tags.map(tag => {
                const routePath = getRoutePath(tag.value);
                return (
                  <NavLink
                    key={tag.title}
                    to={routePath}
                    end={tag.value === 'profile'}
                    className={({ isActive }) =>
                      `text-left px-4 py-2.5 cursor-pointer text-sm font-bold rounded-md transition-colors ${
                        isActive ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    {tag.title}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[300px]">
            <section className="">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
