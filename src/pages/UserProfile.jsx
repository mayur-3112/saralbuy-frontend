import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MoveLeft, MapPin, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import userService from '@/services/user.service';
import { useEffect } from 'react';
import { mergeName } from '@/utils/mergerName';
import Loader from '@/components/custom/Loader';
import VerifiedBadge from '@/components/custom/VerifiedBadge';

/**
 * UserProfile — the PUBLIC-FACING profile shown when another user clicks
 * a supplier or buyer's name.
 *
 * Old version showed email, phone, home address, and full personal fields
 * to anyone with a link — a direct violation of the platform's core
 * anonymity promise (contact details are only revealed once the buyer
 * commits to a deal). Reworked to show only what a stranger should see:
 * name, verification badge, business name (opt-in public), city, and
 * "member since" date. Contact details are not shown here; they get
 * revealed via CloseDeal when both sides agree.
 *
 * Backend TODO: also strip email/phone/address at the API layer so this
 * privacy guarantee holds even if a client is tampered with. For now the
 * frontend simply doesn't render them.
 */
export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { fn, data, loading } = useFetch(userService.getUserProfile);

  useEffect(() => { fn(userId); }, [userId]);

  if (loading) return <Loader />;
  if (!data) return null;

  const fullName = mergeName(data) || '—';
  const memberSince = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
    : null;
  const cityOnly = (loc) => {
    if (!loc) return null;
    // Return first token before comma — respect location privacy at city granularity
    return loc.split(',')[0].trim();
  };
  const location = cityOnly(data.currentLocation) || cityOnly(data.address);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
        >
          <MoveLeft className="w-4 h-4" />
          Back
        </button>

        {/* Hero card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Top band — subtle accent */}
            <div className="h-16 bg-gradient-to-r from-slate-900 to-slate-800" />

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 -mt-10">
              <div className="flex items-end gap-4 flex-wrap">
                <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                  <AvatarImage src={data.profileImage} alt={fullName} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-black text-lg">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {fullName}
                    </h1>
                    <VerifiedBadge status={data.verificationStatus} size="md" />
                  </div>
                  {data.businessName && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {data.businessName}
                    </div>
                  )}
                </div>
              </div>

              {/* Meta row */}
              <div className="mt-5 pt-5 border-t border-slate-100 flex gap-6 flex-wrap text-sm">
                {location && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{location}</span>
                  </div>
                )}
                {memberSince && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">On SaralBuy since {memberSince}</span>
                  </div>
                )}
              </div>

              {/* Privacy notice — sets expectations */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Contact details are shared privately with a buyer only when a deal is confirmed.
                  {data.verificationStatus === 'verified'
                    ? " This supplier's business (GSTIN/PAN) has been reviewed by our team."
                    : ' Ask this member to submit business verification if you want a Verified badge here.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
