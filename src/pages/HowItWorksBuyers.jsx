import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/redux/hooks/useUser';
import {
  ArrowRight,
  FileText,
  Users,
  MessageSquare,
  Handshake,
  TrendingUp,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Zap,
  HelpCircle,
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: FileText,
    title: 'Post Your Material Requirement',
    desc: 'Describe what your project needs — cement, TMT steel, tiles, plumbing, electrical, paints — with quantities, specifications, and delivery location.',
    details: [
      'Upload drawings, BOQ sheets, or spec documents for precise matching',
      'Set your preferred delivery date and payment terms',
      'Choose from 8+ material categories covering all construction needs',
      'Takes under 60 seconds to post',
    ],
  },
  {
    num: '02',
    icon: Users,
    title: 'Verified Suppliers Send You Quotes',
    desc: 'Our network of GST-registered, vetted suppliers review your requirement and submit direct, competitive price quotes — usually within hours.',
    details: [
      'Every supplier is verified for GST registration and track record',
      'Receive multiple quotes to compare pricing, brands, and terms',
      'See supplier ratings from past transactions',
      'No need to call dealers or visit shops — quotes come to you',
    ],
  },
  {
    num: '03',
    icon: MessageSquare,
    title: 'Negotiate & Compare in Real-Time',
    desc: 'Chat directly with bidding suppliers. Discuss delivery schedules, credit terms, material specifications, brand preferences, or bulk discounts.',
    details: [
      'Real-time messaging with read receipts',
      'Share images, documents, and counter-offers',
      'All conversations are logged for accountability',
      'Compare quotes side-by-side before deciding',
    ],
  },
  {
    num: '04',
    icon: Handshake,
    title: 'Close the Deal & Pay Direct',
    desc: 'Accept the best quote, issue your purchase order, and pay the supplier directly. Zero commissions, zero hidden fees, zero middlemen.',
    details: [
      'No platform commission — SaralBuy charges 0% on every transaction',
      'Payment flows directly between you and the supplier',
      'Rate suppliers post-delivery to help the community',
      'Reorder from trusted suppliers with one click',
    ],
  },
];

const BENEFITS = [
  { icon: TrendingUp, title: 'Save 10-25% on Materials', desc: 'Direct factory/distributor pricing eliminates layers of middleman markups that inflate your project costs.' },
  { icon: ShieldCheck, title: 'Only Verified Suppliers', desc: 'Every supplier on SaralBuy is GST-registered and vetted. No anonymous dealers, no fly-by-night operators.' },
  { icon: Package, title: 'All Categories, One Platform', desc: 'Source cement, steel, tiles, electrical, plumbing, paints, hardware, safety gear, and tools — all from one place.' },
  { icon: Truck, title: 'Delivery to Your Site', desc: 'Suppliers quote with site delivery included. No need to arrange separate logistics or unloading.' },
  { icon: Clock, title: 'Save Hours of Effort', desc: 'Stop calling 20 dealers for rates. Post once, get multiple quotes, compare, and close — all from your phone.' },
  { icon: IndianRupee, title: 'Zero Fees Forever', desc: 'SaralBuy is free for buyers. No subscription, no transaction fees, no hidden charges. Period.' },
];

const FAQS = [
  { q: 'Is SaralBuy free for buyers?', a: 'Yes, 100% free. No subscription fees, no transaction commissions, no hidden charges. Buyers never pay SaralBuy anything.' },
  { q: 'How do I know suppliers are genuine?', a: 'Every supplier is verified for GST registration and business legitimacy before they can quote on the platform. You can also see ratings from past transactions.' },
  { q: 'What materials can I source?', a: 'All construction and project materials — cement, TMT steel, bricks, tiles, granite, plumbing, electrical, paints, plywood, hardware, safety equipment, industrial tools, and more.' },
  { q: 'How fast do I get quotes?', a: 'Most requirements receive their first quote within 2-4 hours. Complex or niche requirements may take up to 24 hours.' },
  { q: 'Can I negotiate with suppliers?', a: 'Absolutely. You can chat directly with any supplier who quotes, discuss pricing, terms, delivery dates, and close the deal on your terms.' },
  { q: 'Do I pay SaralBuy or the supplier?', a: 'You pay the supplier directly. SaralBuy never touches your money. We simply connect you with the right suppliers.' },
];

export default function HowItWorksBuyers() {
  const { user } = useUserState();
  const navigate = useNavigate();

  const triggerAuth = () => {
    localStorage.setItem('auth_default_role', 'buyer');
    window.dispatchEvent(new Event('session-expired'));
  };

  const handleCTA = () => {
    if (user) navigate('/requirement');
    else triggerAuth();
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-100/20 border-b border-orange-100/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-radial from-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-radial from-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest rounded-full mb-6">
            👷 For Buyers & Contractors
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Source Bulk Materials at<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"> Wholesale Prices, Directly</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Stop calling 20 dealers for rates. Post your material requirement once, get multiple competitive quotes from verified suppliers, negotiate in real-time, and close deals — all from one platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCTA}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/15 active:scale-95 text-white font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200"
            >
              Post Your First Requirement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => navigate('/how-it-works/suppliers')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-500 hover:text-orange-600 font-semibold text-sm px-4 py-3 cursor-pointer transition-colors"
            >
              Are you a supplier instead? →
            </button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Step-by-step</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How to Source Materials on SaralBuy
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
            From posting your first requirement to closing the deal — here's exactly how it works.
          </p>
        </div>

        <div className="space-y-12">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-8 group`}
              >
                {/* Number + Icon Card */}
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 group-hover:border-orange-400 rounded-2xl p-8 text-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
                    <span className="text-6xl font-black text-orange-500/15 block mb-2">{step.num}</span>
                    <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.desc}</p>
                  <ul className="space-y-2.5">
                    {step.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-slate-50/70 border-t border-b border-slate-200/50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Why SaralBuy</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Thousands of Contractors Trust SaralBuy
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Common Questions from Buyers
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl overflow-hidden transition-colors duration-200"
            >
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer select-none list-none">
                <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-sm font-bold text-slate-800 flex-1">{faq.q}</span>
                <Zap className="w-4 h-4 text-slate-300 group-open:text-orange-500 transition-colors shrink-0" />
              </summary>
              <div className="px-6 pb-5 pt-0 ml-7">
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
            Ready to Source Smarter?
          </h2>
          <p className="text-orange-100 text-base mb-8 max-w-xl mx-auto">
            Join thousands of contractors and builders who save time and money sourcing materials on SaralBuy. Post your first requirement in under 60 seconds.
          </p>
          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-orange-700 font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            Post a Requirement — It's Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

    </div>
  );
}
