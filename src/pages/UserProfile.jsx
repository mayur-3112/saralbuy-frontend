import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MoveLeft, MapPin, Calendar, Building2, ShieldCheck, Phone, FileCheck2, Briefcase } from 'lucide-react';
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
  const roleLabel = data.accountRole === 'supplier' ? 'Supplier' : 'Buyer';

  const chips = [
    data.phone && { icon: Phone, label: 'Phone Verified' },
    data.verificationStatus === 'verified' && { icon: ShieldCheck, label: 'GST Verified' },
    (data.panDocumentUrl || data.pan) && data.verificationStatus === 'verified' && { icon: FileCheck2, label: 'PAN on file' },
  ].filter(Boolean);

  const tiles = [
    { icon: Briefcase, label: 'Role', value: roleLabel },
    location && { icon: MapPin, label: 'Location', value: location },
    memberSince && { icon: Calendar, label: 'Member since', value: memberSince },
    { icon: ShieldCheck, label: 'Verification', value: data.verificationStatus === 'verified' ? 'Verified' : 'Unverified' },
  ].filter(Boolean);

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
                  <AvatarFallback className="bg-orange-100 text-orange-700 font-black text-lg">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {fullName}
                    </h1>
                    <VerifiedBadge status={data.verificationStatus} size="md" />
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {roleLabel}
                    </span>
                  </div>
                  {data.businessName && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {data.businessName}
                    </div>
                  )}
                </div>
              </div>

              {/* Trust chips */}
              {chips.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {chips.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                      <c.icon className="w-3.5 h-3.5" />
                      {c.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Stat tiles */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tiles.map((t, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-800 capitalize">{t.value}</p>
                  </div>
                ))}
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
