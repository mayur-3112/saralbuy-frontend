import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Truck, Check, ShieldCheck, MessageSquare, Send, FileText, Award } from 'lucide-react';

/**
 * HowItWorks — the single "how does this actually work?" page.
 *
 * Old shape: 3 separate pages (HowItWorks, HowItWorksBuyers,
 * HowItWorksSuppliers — 63, 267, 298 lines) with heavy content overlap
 * and a typo "How SaralBuy by SaralBuy Works". Consolidated to ONE page
 * with a buyer/supplier tab toggle. Deep-linking still works via
 * `?role=supplier` (routes/redirects handled in Routes.jsx).
 */

const BUYER_STEPS = [
  {
    icon: Send,
    title: 'Post your requirement',
    body: "Category, material, quantity, delivery date, payment mode. Under two minutes for a single item. If you have a BOQ or Excel list, drop it in — we handle multiple items in one post.",
  },
  {
    icon: ShieldCheck,
    title: 'Verified suppliers see it',
    body: "Only suppliers we've vetted in that category get notified. Your name, phone, and full address stay hidden — they see the requirement and an approximate area.",
  },
  {
    icon: FileText,
    title: 'Structured quotes arrive',
    body: "Not WhatsApp back-and-forth. Each quote lists price, brand, delivery window, payment terms, transport basis. You can compare like-for-like across all quotes on one screen.",
  },
  {
    icon: MessageSquare,
    title: 'Chat, then choose',
    body: "Message any supplier from their quote card. Negotiate, ask questions, request photos. When you're ready, hit Proceed — that's the moment your contact details go to that one supplier. Deal moves off-platform for delivery and payment.",
  },
];

const SUPPLIER_STEPS = [
  {
    icon: Building2,
    title: 'Sign up and set your categories',
    body: "Phone OTP, one form. Pick the categories you deal in — cement, tiles, plumbing, whatever. You'll only be notified about requirements in those categories.",
  },
  {
    icon: Award,
    title: 'Get the Verified badge',
    body: "Submit your GSTIN (and optionally PAN + docs). Our team reviews within one business day. Once verified, buyers see a green Verified badge next to your quotes — a strong signal that wins deals.",
  },
  {
    icon: FileText,
    title: 'Quote in one form',
    body: "Every RFQ has a Quote Now button. Fill price, brand offered, delivery time, GST, transport terms, and (optionally) upload your quote PDF or datasheet. Submit once, done.",
  },
  {
    icon: MessageSquare,
    title: 'Chat and close',
    body: "Buyers can message you from your quote card. When one picks you, you both get each other's contact details and finalise the deal directly. Payment happens between you — SaralBuy doesn't stand between you and the money.",
  },
];

export default function HowItWorks() {
  // Support ?role=supplier deep-link from the sub-page redirects
  const initialRole = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).get('role') === 'supplier'
    ? 'supplier' : 'buyer';
  const [role, setRole] = useState(initialRole);
  const steps = role === 'buyer' ? BUYER_STEPS : SUPPLIER_STEPS;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-14 sm:py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 mb-3">
            How it works
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Four steps. That&apos;s the whole thing.
          </h1>
          <p className="text-slate-300 mt-4 text-sm sm:text-base max-w-2xl">
            SaralBuy replaces the WhatsApp chaos with a structured flow. Same problem, different
            outcome. Pick your side below.
          </p>

          {/* Role toggle */}
          <div className="mt-6 inline-flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setRole('buyer')}
              className={`px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 transition-colors ${
                role === 'buyer' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              For buyers
            </button>
            <button
              onClick={() => setRole('supplier')}
              className={`px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 transition-colors ${
                role === 'supplier' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              For suppliers
            </button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-slate-400 transition-colors">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="w-4 h-4 text-orange-600" />
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantees / privacy notes */}
      <section className="bg-slate-50 border-t border-slate-200 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
            The fine print, upfront
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <Guarantee title="Anonymous by default">
              Buyer contact details are only shared with the specific supplier the buyer chooses.
              Not before.
            </Guarantee>
            <Guarantee title="No commissions on early access">
              We don&apos;t take a cut of your deals. Payment happens directly between buyer and supplier.
            </Guarantee>
            <Guarantee title="Every supplier is reviewed">
              Verification is manual for now — our team checks GSTIN and business docs before the
              green badge appears.
            </Guarantee>
            <Guarantee title="Small team, real reply">
              Product feedback goes to a human, not a ticket queue. We read every message and reply
              within one business day.
            </Guarantee>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {role === 'buyer' ? 'Ready to post your first requirement?' : 'Ready to win your first quote?'}
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Under 90 seconds. No card, no credits, no catch.
          </p>
          <Link
            to={role === 'buyer' ? '/requirement' : '/product-listing'}
            className="mt-6 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm px-6 py-3.5 rounded-xl transition-colors"
          >
            {role === 'buyer' ? 'Post a requirement' : 'Browse live RFQs'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Guarantee({ title, children }) {
  return (
    <div className="flex gap-3">
      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" strokeWidth={3} />
      <div>
        <div className="font-black text-slate-900 text-sm">{title}</div>
        <p className="text-slate-600 text-sm mt-1 leading-snug">{children}</p>
      </div>
    </div>
  );
}
