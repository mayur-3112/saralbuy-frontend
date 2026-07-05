import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Camera, House, Settings, FileText, Briefcase, Bell, ChevronRight } from 'lucide-react';
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
    case 'profile':      return '/account';
    case 'your_biding':  return '/account/bid';
    case 'requirements': return '/account/requirements';
    case 'your_deal':    return '/account/deal';
    case 'notifications':return '/account/notification';
    case 'faq':          return '/faq';
    case 'about_us':     return '/about-us';
    case 'contact_us':   return '/contact-us';
    default:             return '/account';
  }
};

const getTabIcon = value => {
  switch (value) {
    case 'profile':       return Settings;
    case 'your_biding':   return FileText;
    case 'requirements':  return Briefcase;
    case 'your_deal':     return Briefcase;
    case 'notifications': return Bell;
    default:              return FileText;
  }
};

const tags = [
  { title: 'Settings',                  value: 'profile' },
  { title: 'Quotes Submitted',          value: 'your_biding' },
  { title: 'Requirements',              value: 'requirements' },
  { title: 'Closed Deals',              value: 'your_deal' },
  { title: 'Notifications',             value: 'notifications' },
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

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Your Account'
    : 'Your Account';
  const roleBadge = user?.accountRole === 'supplier' ? 'Supplier' : 'Buyer';
  const roleBadgeColor =
    user?.accountRole === 'supplier'
      ? 'bg-orange-100 text-orange-700'
      : 'bg-slate-100 text-slate-600';

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4">
      {/* Breadcrumb — desktop only */}
      <Breadcrumb className="hidden sm:block mb-6">
        <BreadcrumbList>
          <BreadcrumbItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <BreadcrumbPage className="text-gray-500">
              <House className="w-5 h-5" />
            </BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="font-semibold">Account</BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="text-orange-600 font-semibold capitalize">
              {pathname.split('/')[2] || 'Profile'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── MOBILE PROFILE HEADER (hidden on md+) ── */}
      <div className="md:hidden mb-4">
        <div
          className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fff5ed 0%, #ffe8d6 100%)' }}
        >
          {/* Orange accent blob */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-orange-300/20 pointer-events-none" />

          {/* Avatar with camera */}
          <div className="relative shrink-0">
            <Avatar className="w-20 h-20 border-2 border-orange-300 shadow-md">
              {updateProfileLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Spinner className="w-5 h-5 text-orange-500" />
                </div>
              ) : (
                <AvatarImage
                  src={user?.profileImage || '/avatar.jpg'}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
              {!updateProfileLoading && (
                <AvatarFallback className="text-lg font-bold bg-orange-100 text-orange-700">
                  {fallBackName(fullName)}
                </AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              name="image"
              hidden
              ref={avatarRef}
              onChange={handleUpdateProfile}
            />
            <button
              disabled={updateProfileLoading}
              onClick={e => { e.preventDefault(); avatarRef.current?.click(); }}
              className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full shadow-md hover:bg-orange-600 active:scale-95 transition-transform cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0 z-10">
            <p className="text-base font-bold text-slate-900 truncate">{fullName}</p>
            {user?.phone && (
              <p className="text-xs text-slate-500 mt-0.5">{user.phone}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                {roleBadge}
              </span>
              {user?.accountRole === 'supplier' && user?.businessName && (
                <span className="text-xs text-slate-500 truncate max-w-[120px]">
                  {user.businessName}
                </span>
              )}
              {user?.accountRole !== 'supplier' && user?.organizationName && (
                <span className="text-xs text-slate-500 truncate max-w-[120px]">
                  {user.organizationName}
                </span>
              )}
            </div>
          </div>

          {/* Settings shortcut */}
          <NavLink
            to="/account"
            end
            className="shrink-0 z-10 p-2 rounded-full bg-white/70 text-slate-500 hover:bg-white hover:text-orange-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Mobile horizontal tab bar */}
        <div className="mt-3 -mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-1 w-max">
            {tags.map(tag => {
              const Icon = getTabIcon(tag.value);
              const routePath = getRoutePath(tag.value);
              return (
                <NavLink
                  key={tag.value}
                  to={routePath}
                  end={tag.value === 'profile'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {tag.title}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Sidebar — desktop only */}
        <div className="hidden md:flex flex-col space-y-4 bg-white border border-slate-200 shadow-sm p-5 rounded-xl sticky top-24 self-start">
          {/* Avatar block */}
          <div className="flex flex-col items-center mt-2 mb-2 relative">
            <div className="relative">
              <Avatar className="w-28 h-28 border-3 border-orange-200 shadow">
                {updateProfileLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Spinner className="w-5 h-5 text-orange-500" />
                  </div>
                ) : (
                  <AvatarImage
                    src={user?.profileImage || '/avatar.jpg'}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
                {!updateProfileLoading && (
                  <AvatarFallback className="text-xl font-bold bg-orange-50 text-orange-700">
                    {fallBackName(fullName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <input
                type="file"
                name="image"
                hidden
                ref={avatarRef}
                onChange={handleUpdateProfile}
              />
              <button
                disabled={updateProfileLoading}
                onClick={e => { e.preventDefault(); avatarRef.current?.click(); }}
                className="absolute bottom-4 right-0 bg-orange-500 p-1.5 rounded-full shadow-md hover:bg-orange-600 cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <p className="mt-3 text-sm font-bold text-slate-800 text-center">{fullName}</p>
            <span className={`mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
              {roleBadge}
            </span>

            <button
              onClick={() => avatarRef.current?.click()}
              className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
            >
              Update Photo
            </button>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
            {tags.map(tag => {
              const Icon = getTabIcon(tag.value);
              const routePath = getRoutePath(tag.value);
              return (
                <NavLink
                  key={tag.title}
                  to={routePath}
                  end={tag.value === 'profile'}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 pl-[18px]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tag.title}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="min-h-[300px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
