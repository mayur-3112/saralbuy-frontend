import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { House, MoveLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import userService from '@/services/user.service';
import { useEffect } from 'react';
import { mergeName } from '@/utils/mergerName';
import Loader from '@/components/custom/Loader';
import VerifiedBadge from '@/components/custom/VerifiedBadge';

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value || '—'}</p>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { fn, data, loading } = useFetch(userService.getUserProfile);

  useEffect(() => {
    fn(userId);
  }, [userId]);

  const fullName =
    [data?.firstName, data?.lastName]
      .filter(Boolean)
      .map(n => n.charAt(0).toUpperCase() + n.slice(1))
      .join(' ') || '—';

  const formattedDate = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="space-y-4 w-full max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <BreadcrumbPage className="capitalize font-regular text-gray-500">
                <MoveLeft className="w-5 h-5" />
              </BreadcrumbPage>
              {/* <BreadcrumbSeparator /> */}
              <BreadcrumbPage className="capitalize font-regular text-gray-600 font-semibold text-lg">
                User Profile
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={data?.profileImage} alt={fullName} />
                  <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold text-lg overflow-hidden">
                    <img src="/avatar.jpg" alt="" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-semibold text-foreground">{mergeName(data)}</p>
                    <VerifiedBadge status={data?.verificationStatus} size="md" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    {data?.currentLocation && (
                      <>
                        <span>{data.currentLocation}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={
                        data?.status === 'active'
                          ? 'border-green-500 text-green-600 text-xs'
                          : 'border-gray-400 text-gray-500 text-xs'
                      }
                    >
                      {data?.status || '—'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <ProfileField label="First Name" value={data?.firstName} />
              <ProfileField label="Last Name" value={data?.lastName} />
              <ProfileField label="Email Address" value={data?.email} />
              <ProfileField label="Phone" value={data?.phone} />
              <ProfileField label="Business Name" value={data?.businessName} />
              <ProfileField label="Member Since" value={formattedDate} />
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <ProfileField label="Address" value={data?.address} />
              <ProfileField label="Current Location" value={data?.currentLocation} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
