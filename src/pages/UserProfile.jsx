import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  MoveLeft,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  Phone,
  FileCheck2,
  Briefcase,
  Globe,
  FileText,
  Package,
  Lightbulb,
  Award,
  Factory,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import userService from '@/services/user.service';
import { useEffect } from 'react';
import { mergeName } from '@/utils/mergerName';
import Loader from '@/components/custom/Loader';
import VerifiedBadge from '@/components/custom/VerifiedBadge';

/**
 * UserProfile — the PUBLIC-FACING profile shown when another user clicks
 * a supplier or buyer's name. Single shared component/route for every entry
 * point (Chat, RequirementOverview's quotes table + Compare Quotes dialog,
 * and any future one) — never duplicate this page, just link to
 * `/user-profile/:userId` from wherever a name/avatar needs to be clickable.
 *
 * Old version showed email, phone, home address, and full personal fields
 * to anyone with a link — a direct violation of the platform's core
 * anonymity promise (contact details are only revealed once the buyer
 * commits to a deal). Reworked to show only what a stranger should see.
 * Contact details are not shown here; they get revealed via CloseDeal when
 * both sides agree. Backend enforces this (getUserProfile strips
 * email/phone/address for non-owners), not just the UI.
 *
 * Redesigned from a stat-tile grid (told you THAT a supplier exists and is
 * verified, nothing about what they do) into a company-page layout: hero,
 * then conditionally-rendered sections built from the supplier's own
 * Organisation Details fields (businessDescription, supplierCategories,
 * topProblemsSolved, accomplishments, website). Sections a supplier hasn't
 * filled in just don't render — no empty boxes — and if none of them exist
 * at all, one clear empty-state message replaces the whole block.
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
  const isSupplier = data.accountRole === 'supplier';
  const roleLabel = isSupplier ? 'Supplier' : 'Buyer';
  const companyName = data.businessName || data.organizationName;

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

  // Company Overview — org identity fields, only the ones actually present.
  const overviewFacts = [
    companyName && { icon: Building2, label: 'Organisation', value: companyName },
    data.roleInCompany && { icon: Briefcase, label: 'Role in Organisation', value: data.roleInCompany },
    data.businessSince != null && {
      icon: Clock,
      label: 'Years in Business',
      value: `${new Date().getFullYear() - data.businessSince}+ yrs (since ${data.businessSince})`,
    },
    data.website && {
      icon: Globe,
      label: 'Website',
      value: data.website,
      href: data.website.startsWith('http') ? data.website : `https://${data.website}`,
    },
  ].filter(Boolean);

  // Company-page sections — a supplier fills these in via Organisation
  // Details; each renders only if it has content.
  const sections = [
    { icon: FileText, title: 'About the Business', body: data.businessDescription },
    { icon: Package, title: 'Products Supplied', body: data.supplierCategories },
    { icon: Factory, title: 'Industries Served', body: data.industriesServed },
    { icon: Lightbulb, title: 'Problems We Solve', body: data.topProblemsSolved },
    { icon: Award, title: 'Accomplishments', body: data.accomplishments },
    { icon: BadgeCheck, title: 'Certifications', body: data.certifications },
  ].filter(s => s.body && s.body.trim());

  const hasCompanyContent = isSupplier && (overviewFacts.length > 0 || sections.length > 0);

  // Profile completion — a light trust signal, not a gate: how many of the
  // storefront fields a supplier has actually filled in.
  const completionFields = [
    companyName, data.roleInCompany, data.website, data.businessDescription,
    data.supplierCategories, data.industriesServed, data.topProblemsSolved,
    data.accomplishments, data.certifications, data.businessSince != null,
  ];
  const completionPct = isSupplier
    ? Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)
    : null;

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
                  {companyName && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {companyName}
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

              {/* Profile completion — supplier-only, a light trust signal */}
              {isSupplier && completionPct != null && completionPct < 100 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>Profile completeness</span>
                    <span>{completionPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${completionPct}%` }} />
                  </div>
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

        {/* Company page — supplier-only. Buyers don't fill in Organisation
            Details, so there's nothing to show here for them. */}
        {isSupplier && (
          <div className="mt-6 space-y-4">
            {!hasCompanyContent ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">
                    This supplier hasn't added company details yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {overviewFacts.length > 0 && (
                  <Card>
                    <CardContent className="p-6 sm:p-7">
                      <h2 className="text-sm font-black uppercase tracking-wide text-slate-400 mb-4">
                        Company Overview
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {overviewFacts.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <f.icon className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{f.label}</p>
                              {f.href ? (
                                <a
                                  href={f.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-bold text-orange-600 hover:underline break-all"
                                >
                                  {f.value}
                                </a>
                              ) : (
                                <p className="text-sm font-bold text-slate-800 break-words">{f.value}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {sections.map((s, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 sm:p-7">
                      <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-400 mb-3">
                        <s.icon className="w-4 h-4 text-orange-500" />
                        {s.title}
                      </h2>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {s.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
