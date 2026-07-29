import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, Scale, ServerCog, Cookie, Gavel, Accessibility, Eye,
  ArrowRight, CheckCircle2, Clock,
} from 'lucide-react';

// Trust Center — the central hub for privacy, security, compliance, and
// legal information. Every card below links to a real, existing policy or
// page; every trust indicator is something the platform actually does
// today (verified against this session's security work), not a claimed
// certification. Do not add SOC 2 / ISO 27001 / "DPDP Certified" badges
// here unless SaralBuy has actually obtained them — see the "working
// toward" section for the honest, unfinished half of the picture instead.
const TOPICS = [
  {
    title: 'Privacy',
    icon: Lock,
    description: 'What we collect, why, and who we share it with.',
    to: '/privacy?policy=privacy-policy',
  },
  {
    title: 'Security',
    icon: ShieldCheck,
    description: 'Rate limiting, access controls, and how KYC documents are protected.',
    to: '/terms?policy=information-security-policy',
  },
  {
    title: 'Compliance & Legal',
    icon: Scale,
    description: 'All 16 policies governing the platform, in one browsable place.',
    to: '/terms',
  },
  {
    title: 'Data Protection',
    icon: ServerCog,
    description: 'How long we keep data, and how to request deletion.',
    to: '/privacy?policy=data-retention-policy',
  },
  {
    title: 'Cookies',
    icon: Cookie,
    description: 'The two strictly-necessary cookies we use — nothing else.',
    to: '/privacy?policy=cookie-policy',
  },
  {
    title: 'Grievance Redressal',
    icon: Gavel,
    description: 'How to raise a complaint or exercise your data rights.',
    to: '/terms?policy=grievance-redressal-policy',
  },
];

const TRUST_INDICATORS = [
  { label: 'Encrypted Connections', icon: Lock },
  { label: 'Secure Authentication', icon: ShieldCheck },
  { label: 'Privacy-Focused by Design', icon: Eye },
  { label: 'Verified Suppliers (GSTIN/PAN submission)', icon: CheckCircle2 },
];

// Honest, in-progress items — not hidden, not overclaimed. Mirrors the
// open items tracked in Roadmap.md so this page never says something the
// codebase doesn't back up.
const IN_PROGRESS = [
  'Publishing a named Grievance Officer and a committed response-time standard',
  'Granular, purpose-specific consent capture at signup (separating login consent from KYC-data consent)',
  'A formal data-retention schedule for account and marketplace data',
  'Independent verification of submitted GSTIN/PAN against government registries',
];

export default function TrustCenter() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 mb-3">
            Trust Center
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] max-w-2xl">
            How SaralBuy protects your data and runs the marketplace.
          </h1>
          <p className="text-slate-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            One place for privacy, security, compliance, and legal information &mdash;
            written plainly, and updated as the platform evolves.
          </p>
        </div>
      </section>

      {/* Topic grid */}
      <section className="py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-black text-slate-900 mb-6">Explore by topic</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map(topic => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.title}
                  to={topic.to}
                  className="group p-5 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:bg-orange-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-black text-slate-900 flex items-center gap-1">
                    {topic.title}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{topic.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-10 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-black text-slate-900 mb-6">What we actually do</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_INDICATORS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-2.5 p-4 rounded-xl bg-white border border-slate-200">
                  <Icon className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-700 leading-snug">{item.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            We do not claim any third-party security or compliance certification (such as SOC 2, ISO 27001, or a formal DPDP certification) that SaralBuy has not actually obtained.
          </p>
        </div>
      </section>

      {/* Honest roadmap */}
      <section className="py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-black text-slate-900">What we&apos;re working toward</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 max-w-2xl">
            Security and privacy are an ongoing process, not a one-time checklist. Here&apos;s what&apos;s
            genuinely in progress, stated plainly rather than left unmentioned.
          </p>
          <ul className="space-y-3">
            {IN_PROGRESS.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer nav */}
      <section className="py-10 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
          <Link to="/terms" className="text-slate-600 hover:text-orange-600">All Legal Documents</Link>
          <Link to="/sitemap" className="text-slate-600 hover:text-orange-600">Sitemap</Link>
          <Link to="/accessibility" className="text-slate-600 hover:text-orange-600 flex items-center gap-1">
            <Accessibility className="w-4 h-4" /> Accessibility Statement
          </Link>
          <Link to="/contact-us" className="text-slate-600 hover:text-orange-600">Contact Support</Link>
        </div>
      </section>
    </div>
  );
}
