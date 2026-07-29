import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert, BookOpen, Lock, Landmark, Users, FileText, Cookie, Scale,
  RotateCcw, Copyright, ServerCog, Share2, ShieldCheck, Gavel, Search, ChevronRight,
  Printer, Clock, ArrowLeft,
} from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Content was last substantively reviewed/updated during this engineering
// pass (KYC access restriction, Sentry PII scrubbing, account-deletion
// request flow, rate limiting) — kept as one shared date since every policy
// was touched in the same review, not per-policy dates that would imply
// independent revision histories that don't exist yet.
const LAST_UPDATED = 'July 29, 2026';

function readingTime(paragraphs) {
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Full policy set. Each entry's `paragraphs` reflects what the platform
// actually does today (per the engineering security/privacy review), not
// aspirational language — where something depends on a business decision
// not yet made (e.g. a future fee model), it's phrased as the current,
// factual state rather than a placeholder.
const POLICIES = [
  {
    id: 'terms-of-use',
    title: 'Terms of Use',
    icon: Landmark,
    summary: 'The core agreement governing your use of SaralBuy.',
    related: ['buyer-terms', 'supplier-terms', 'marketplace-rules', 'acceptable-use-policy'],
    paragraphs: [
      'By creating an account or using SaralBuy, you agree to this Terms of Use, the Buyer Terms or Supplier Terms (whichever applies to your account), the Privacy Policy, the Acceptable Use Policy, and the Marketplace Rules.',
      'You must be at least 18 years old and have authority to bind the business you represent.',
      'SaralBuy is a matching and reverse-bidding exchange. We do not buy, sell, warehouse, inspect, transport, or deliver any products, and we do not process payments between Buyers and Suppliers.',
      'You are responsible for all activity under your account, including the accuracy of information you submit.',
      'You may request deletion of your account and personal data at any time; see the Grievance Redressal Policy below for how.',
      'These terms are governed by the laws of India.',
    ],
  },
  {
    id: 'buyer-terms',
    title: 'Buyer Terms',
    icon: BookOpen,
    summary: 'What to expect as a Buyer posting requirements.',
    related: ['terms-of-use', 'marketplace-rules', 'refund-cancellation-policy'],
    paragraphs: [
      'You may post a Requirement describing the materials you need, including category, quantity, delivery expectations, budget, and location. You are responsible for the accuracy of what you post.',
      "Suppliers may respond with Quotes. A Supplier cannot see a competing Supplier's Quote on the same Requirement.",
      'Your contact details are withheld from Suppliers until you close a deal with a specific Supplier.',
      'Closing a deal records that you and a Supplier have agreed to proceed. SaralBuy does not verify, guarantee, or become a party to the underlying sale — that contract is directly between you and the Supplier.',
      'You are responsible for inspecting materials upon delivery. Quality, quantity, and delivery disputes are between you and the Supplier.',
      'There are currently no platform fees for posting a Requirement or receiving Quotes.',
    ],
  },
  {
    id: 'supplier-terms',
    title: 'Supplier Terms',
    icon: FileText,
    summary: 'What to expect as a Supplier submitting quotes.',
    related: ['terms-of-use', 'anti-fraud-verification-policy', 'marketplace-rules'],
    paragraphs: [
      'To submit Quotes, you provide business details including GSTIN and PAN. Submitting these makes you eligible for "Verified" status.',
      'SaralBuy does not independently verify GSTIN/PAN against government registries — "Verified" reflects that you submitted these details, not third-party confirmation of them.',
      'Your KYC documents (GST and PAN proof) are restricted to you and to administrators reviewing your verification — no other user can access them.',
      'You are responsible for the accuracy of your Quotes and your capacity to fulfil them. If a deal is closed, the resulting supply contract is directly between you and the Buyer.',
      'Submitting false GSTIN/PAN details, or misrepresenting your capacity to fulfil a Quote, may result in suspension and loss of Verified status.',
      'There are currently no platform fees for submitting Quotes.',
    ],
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    icon: Lock,
    summary: 'What personal data we collect, why, and how it is protected.',
    related: ['dpdp-consent-notice', 'cookie-policy', 'data-retention-policy', 'data-processing-addendum', 'grievance-redressal-policy'],
    paragraphs: [
      'We collect your phone number for login, your business details (name, GSTIN, PAN, address) for KYC and verification, and marketplace activity such as requirements, bids, and deal history. We do not collect Aadhaar or other sensitive national identity numbers, and we do not collect payment card or bank account details — the platform does not process payments.',
      'Business verification documents such as GST and PAN registration papers are restricted to you and to administrators reviewing your verification. We apply additional safeguards to sensitive business identifiers such as GSTIN and PAN, and our error-monitoring tools are configured to exclude sensitive fields (OTP codes, identity numbers) from technical logs.',
      'Your phone number, email, and address are not shown to other users by default. They become visible to a specific counterparty once a deal with that counterparty is marked complete on the platform.',
      'We share data only with the service providers who help us run the platform — cloud hosting and database providers, our SMS provider for login codes, our file-storage provider, and an error-monitoring tool. We do not sell your personal data or share it with advertisers.',
      'You can view and correct your profile information at any time. You may request deletion of your account and personal data at any time — your account is deactivated immediately on request, and your personal details are then anonymized.',
      'We retain requirement, bid, deal, and chat history associated with your account for as long as it is active. We are working toward a formal retention schedule for how long data is kept after account closure.',
    ],
  },
  {
    id: 'dpdp-consent-notice',
    title: 'DPDP Consent Notice',
    icon: ShieldCheck,
    summary: 'What you are agreeing to when you consent to data processing.',
    related: ['privacy-policy', 'grievance-redressal-policy'],
    paragraphs: [
      'When you create an account, you consent to SaralBuy processing your phone number for login and identity, and your business details (GSTIN, PAN, business name/address) for KYC and verification purposes.',
      'When you use the marketplace, you consent to your requirement, bid, and deal data being processed to operate the matching and reverse-bidding functionality you signed up for.',
      'You may withdraw consent by requesting account closure at any time — see the Grievance Redressal Policy. Withdrawing consent for KYC data will affect your ability to hold Verified status or submit Quotes.',
      'We are working toward more granular, purpose-specific consent capture (separating login consent from KYC-data consent) as the platform matures.',
    ],
  },
  {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    icon: Cookie,
    summary: 'The only two cookies SaralBuy uses, and why.',
    related: ['privacy-policy', 'information-security-policy'],
    paragraphs: [
      'We use two cookies, both strictly necessary to keep you securely logged in as a Buyer, Supplier, or Administrator. Neither cookie is used for advertising, tracking, or analytics.',
      'We do not use any third-party tracking, advertising, or analytics cookies, and no such scripts run on SaralBuy.',
      'Because only strictly-necessary cookies are used, we do not currently show a cookie-consent banner. If that changes — for example, if we ever add analytics — we will update this policy and add a consent mechanism first.',
      'You can clear cookies via your browser at any time; you will need to log in again afterward.',
    ],
  },
  {
    id: 'acceptable-use-policy',
    title: 'Acceptable Use Policy',
    icon: ShieldAlert,
    summary: 'Rules for how you can and cannot use the platform.',
    related: ['terms-of-use', 'marketplace-rules', 'information-security-policy'],
    paragraphs: [
      'You must not post false, fraudulent, or misleading Requirements or Quotes, or submit false GSTIN, PAN, or business details.',
      "You must not attempt to access another user's account, data, or uploaded documents without authorization.",
      'You must not upload content that infringes another party’s intellectual property or contains malicious code, or use Chat to harass or send unsolicited commercial messages.',
      'You must not share your account credentials with another person.',
      'Violations may result in content removal, suspension, or termination, and we rate-limit login/OTP requests and apply platform-wide request limits to protect against automated abuse.',
    ],
  },
  {
    id: 'marketplace-rules',
    title: 'Marketplace Rules',
    icon: Scale,
    summary: 'How posting, quoting, and closing a deal actually works.',
    related: ['buyer-terms', 'supplier-terms', 'disclaimer'],
    paragraphs: [
      'Requirements are publicly browsable by Suppliers unless kept in draft. Suppliers cannot view competing Suppliers’ Quotes on the same Requirement.',
      'Expired Requirements are excluded from live browse listings and their Quote action is disabled once expired.',
      'A deal is closed when both Buyer and Supplier mark it complete — this triggers the release of contact details between those two specific parties.',
      'SaralBuy holds no liability for payment default, delivery delay, quality disputes, or rejection of materials by either party. All resulting contracts are directly between the Buyer and Supplier.',
      'We may remove a Requirement or Quote that violates the Acceptable Use Policy.',
    ],
  },
  {
    id: 'data-retention-policy',
    title: 'Data Retention Policy',
    icon: ServerCog,
    summary: 'How long we keep your data.',
    related: ['privacy-policy', 'grievance-redressal-policy'],
    paragraphs: [
      'We retain your account and marketplace data for as long as your account is active and as needed to operate the platform.',
      'Certain system notifications are automatically deleted after 30 days. We are working toward a fuller, formal retention schedule for other data categories.',
      'You may request deletion of your account and data at any time — see the Grievance Redressal Policy. On request, your account is deactivated immediately and your personal details are anonymized.',
    ],
  },
  {
    id: 'grievance-redressal-policy',
    title: 'Grievance Redressal Policy',
    icon: Gavel,
    summary: 'How to raise a complaint or request your data.',
    related: ['privacy-policy', 'data-retention-policy', 'dpdp-consent-notice'],
    paragraphs: [
      'You can raise a complaint about another user’s conduct, request access to or deletion of your personal data, or report a security or privacy concern, by contacting us through the support channel in the app.',
      'Requesting deletion deactivates your account immediately; your personal data is then anonymized so it can no longer identify you, while marketplace records that reference your account (like a counterparty’s deal history) remain intact.',
      'We aim to acknowledge and respond to grievances promptly. We are working toward publishing a named Grievance Officer and a committed response-time standard, as required under the Digital Personal Data Protection Act.',
    ],
  },
  {
    id: 'refund-cancellation-policy',
    title: 'Refund & Cancellation Policy',
    icon: RotateCcw,
    summary: 'What happens with cancellations, since SaralBuy doesn’t process payments.',
    related: ['buyer-terms', 'supplier-terms', 'disclaimer'],
    paragraphs: [
      'SaralBuy does not process, hold, or facilitate payment for goods between Buyers and Suppliers. Refunds for goods, deposits, or advance payments made directly between a Buyer and Supplier are a matter between those two parties, not SaralBuy.',
      'A Buyer may withdraw a Requirement, and a Supplier may withdraw a Quote, at any time before a deal is closed.',
      'There are currently no platform fees to refund, since SaralBuy does not charge for posting Requirements or submitting Quotes.',
    ],
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    icon: ShieldAlert,
    summary: 'The zero-liability position, in full.',
    related: ['terms-of-use', 'marketplace-rules', 'anti-fraud-verification-policy'],
    paragraphs: [
      'SaralBuy is exclusively a B2B matching and reverse-bidding exchange platform. We do not participate in, control, verify, or assume any liability for the transactions, payments, material inspections, or delivery negotiations between buyers and suppliers.',
      'If a buyer rejects materials, or if either party defaults on payments, delivery terms, or contracts, the platform bears absolutely no liability, responsibility, or financial obligation. All trades are conducted at the sole risk of the participants.',
      'Requirements and Quotes are posted by users and are not independently verified for accuracy beyond the GSTIN/PAN submission check described in the Anti-Fraud & Verification Policy.',
      'GSTIN and PAN details submitted by Suppliers are not independently verified against government registries. Users must perform their own due diligence before transferring funds or delivering materials.',
      'The platform is provided "as is." We do not guarantee uninterrupted availability.',
    ],
  },
  {
    id: 'ip-takedown-policy',
    title: 'IP & Takedown Policy',
    icon: Copyright,
    summary: 'Content ownership and how to report infringement.',
    related: ['terms-of-use', 'grievance-redressal-policy'],
    paragraphs: [
      'You retain ownership of content you upload (product images, quote documents, KYC documents). You grant SaralBuy a license to store, process, and display this content as needed to operate the platform’s features.',
      'If you believe content on the platform infringes your intellectual property rights, contact us through the support channel with a description of the work and the location of the infringing content.',
      'We may remove content believed to infringe third-party rights at our discretion, pending a fuller review.',
    ],
  },
  {
    id: 'information-security-policy',
    title: 'Information Security Policy',
    icon: Lock,
    summary: 'The concrete security measures protecting the platform.',
    related: ['privacy-policy', 'cookie-policy', 'anti-fraud-verification-policy'],
    paragraphs: [
      'Login uses phone-based OTP verification with rate limiting to prevent abuse. Sessions use secure, httpOnly cookies.',
      'KYC documents (GST/PAN proof) are restricted to the uploader and administrators reviewing verification — not to any other logged-in user.',
      'Sensitive business identifiers (GSTIN, PAN) receive additional safeguards, and our error-monitoring tooling is configured to exclude OTPs, phone numbers, and identity numbers from the technical logs used to diagnose issues.',
      'We apply platform-wide request limits to protect against automated abuse and scraping, in addition to tighter limits on login and OTP endpoints specifically.',
      'Security is an ongoing process. We continue to review and strengthen these measures as the platform grows.',
    ],
  },
  {
    id: 'data-processing-addendum',
    title: 'Data Processing Addendum',
    icon: Share2,
    summary: 'Every third party that touches your data, and why.',
    related: ['privacy-policy', 'information-security-policy'],
    paragraphs: [
      'We use cloud hosting and database providers to run the platform and store application data, an SMS provider to deliver OTP login codes, a file-storage provider for uploaded images and documents, and an error-monitoring tool configured to exclude sensitive fields from what it captures.',
      'We do not use any payment gateway, analytics platform, advertising network, or email-marketing service — none of these are integrated into SaralBuy today.',
      'We do not sell your data to any third party, and we do not share it for advertising purposes.',
    ],
  },
  {
    id: 'anti-fraud-verification-policy',
    title: 'Anti-Fraud & Verification Policy',
    icon: Search,
    summary: 'What "Verified" means, and how we handle suspected fraud.',
    related: ['supplier-terms', 'information-security-policy', 'grievance-redressal-policy'],
    paragraphs: [
      'A Supplier is eligible for "Verified" status upon submitting GSTIN and/or PAN details. SaralBuy does not independently confirm these details against government registries — "Verified" means the details were submitted, not third-party-authenticated.',
      'Login uses phone-based OTP verification with rate limiting on both the send and verify steps.',
      'KYC documents require you to be logged in, and are restricted to the uploader and admins reviewing verification.',
      'You may report suspected fraudulent Requirements, Quotes, or business details through the support channel. Accounts found to have submitted fraudulent details may be suspended and lose Verified status.',
    ],
  },
];

export default function TermsAndPrivacy() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Deep-link support: /terms?policy=cookie-policy or /privacy?policy=ip-takedown-policy
  // opens that specific policy directly (used by the footer's Cookies/DMCA links),
  // falling back to the route-based default when no valid ?policy= is given.
  const requestedId = searchParams.get('policy');
  const isValidId = POLICIES.some(p => p.id === requestedId);
  const defaultId = isValidId
    ? requestedId
    : location.pathname === '/privacy' ? 'privacy-policy' : 'terms-of-use';
  const [query, setQuery] = useState('');
  const [openItem, setOpenItem] = useState(defaultId);

  // React Router's <Link> navigates client-side without remounting this
  // component, so a footer link changing only the ?policy= param (e.g.
  // Cookies Policy -> DMCA/Copyright) needs an explicit sync, not just the
  // initial useState value above.
  useEffect(() => {
    setOpenItem(defaultId);
  }, [defaultId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POLICIES;
    return POLICIES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.paragraphs.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  const currentPolicy = POLICIES.find(p => p.id === openItem);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6 print:hidden">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/trust-center">Trust Center</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPolicy?.title || 'Legal & Policies'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="text-center mb-8 space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Legal & Policies
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          Every policy governing the SaralBuy procurement exchange, in one place &mdash; {POLICIES.length} policies covering how the platform works, what we collect, and how it&apos;s protected.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          <span>Last updated: {LAST_UPDATED}</span>
          <span aria-hidden="true">&middot;</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 hover:text-orange-600 cursor-pointer print:hidden"
          >
            <Printer className="w-3.5 h-3.5" /> Print this page
          </button>
        </div>
      </div>

      {/* Critical Zero Liability Warning Card */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4 mb-8 shadow-xs">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-full shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-extrabold text-amber-950 text-base">Important Zero Liability Disclaimer</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            SaralBuy is exclusively a B2B matching and reverse-bidding exchange platform. We do not participate in, control, verify, or assume any liability for the transactions, payments, material inspections, or delivery negotiations between buyers and suppliers.
          </p>
          <p className="text-xs text-amber-950 font-bold leading-relaxed">
            If a buyer rejects materials, or if either party defaults on payments, delivery terms, or contracts, the platform bears absolutely no liability, responsibility, or financial obligation. All trades are conducted at the sole risk of the participants.
          </p>
        </div>
      </div>

      {/* Quick jump index — acts as the table of contents, sticky on desktop
          so it stays reachable while scrolling through a long policy. */}
      <div className="mb-6 md:sticky md:top-2 md:z-10 bg-white/95 backdrop-blur-sm py-2 print:hidden">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search policies (e.g. cookies, refunds, verification)..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {POLICIES.map(p => (
            <button
              key={p.id}
              onClick={() => setOpenItem(p.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                openItem === p.id
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-600'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Full policy list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 md:px-8">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 py-10 text-center">No policies match &ldquo;{query}&rdquo;.</p>
        ) : (
          <Accordion type="single" collapsible value={openItem} onValueChange={v => v && setOpenItem(v)}>
            {filtered.map(policy => {
              const Icon = policy.icon;
              return (
                <AccordionItem key={policy.id} value={policy.id} className="py-2">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start gap-3 text-left">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-900">{policy.title}</div>
                        <div className="text-xs text-slate-500 font-normal mt-0.5">{policy.summary}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-11 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {readingTime(policy.paragraphs)} min read &middot; Last updated {LAST_UPDATED}
                      </div>
                      {policy.paragraphs.map((para, i) => (
                        <p key={i} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                          <ChevronRight className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                          <span>{para}</span>
                        </p>
                      ))}
                      {policy.related?.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-slate-100 print:hidden">
                          <div className="text-xs font-bold text-slate-500 mb-2">Related documents</div>
                          <div className="flex flex-wrap gap-2">
                            {policy.related.map(rid => {
                              const rp = POLICIES.find(p => p.id === rid);
                              if (!rp) return null;
                              return (
                                <button
                                  key={rid}
                                  onClick={() => { setQuery(''); setOpenItem(rid); }}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:border-orange-400 hover:text-orange-600 cursor-pointer"
                                >
                                  {rp.title}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 mt-8 print:hidden">
        <Link to="/trust-center" className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
          <ArrowLeft className="w-4 h-4" /> Back to Trust Center
        </Link>
        <p className="text-xs text-slate-400 text-center">
          These policies are reviewed and updated as the platform evolves. For questions about any policy, contact us through the support channel in the app.
        </p>
      </div>
    </div>
  );
}
