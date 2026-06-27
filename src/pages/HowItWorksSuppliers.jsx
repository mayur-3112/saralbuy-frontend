import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/redux/hooks/useUser';
import {
  ArrowRight,
  Search,
  Gavel,
  MessagesSquare,
  Receipt,
  ClipboardList,
  BadgeCheck,
  Send,
  TrendingUp,
  Target,
  BarChart3,
  Globe,
  CheckCircle2,
  HelpCircle,
  Zap,
  IndianRupee,
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'Browse Live Sourcing Leads',
    desc: 'Explore active bulk material requests posted by verified contractors and builders. Each RFQ card shows the buyer, category, items needed, bid deadline, and delivery date — so you can decide instantly.',
    details: [
      'Filter leads by material category (cement, steel, electrical, tiles, etc.)',
      'See all key details at a glance: buyer, items, deadline, and delivery date',
      'Structured RFQ cards with labeled fields — no guessing what each detail means',
      'New leads posted daily — never run out of opportunities',
    ],
  },
  {
    num: '02',
    icon: Gavel,
    title: 'Submit Your Best Quote',
    desc: 'Found a requirement that matches your inventory? Open the RFQ, review the full specifications, and submit a competitive quote with your best price, delivery date, and terms.',
    details: [
      'Quote in under 30 seconds — enter price, delivery date, and notes',
      'Attach product catalogs, test certificates, or sample images',
      'Stand out by offering better delivery terms or brand alternatives',
      'Track all your submitted quotes from your dashboard',
    ],
  },
  {
    num: '03',
    icon: MessagesSquare,
    title: 'Negotiate & Build Relationships',
    desc: 'When a buyer is interested, engage them in direct real-time chat. Clarify specs, discuss credit terms, offer volume discounts, and build lasting supply partnerships.',
    details: [
      'Direct messaging with decision-makers — no brokers in between',
      'Share product images, specifications, and counter-proposals',
      'Discuss credit periods, advance payments, and delivery logistics',
      'Build repeat business relationships with satisfied buyers',
    ],
  },
  {
    num: '04',
    icon: Receipt,
    title: 'Win the Order & Get Paid Directly',
    desc: 'When the buyer accepts your quote, you receive a purchase order. Deliver the materials and get paid directly. No platform commission during early access.',
    details: [
      'No platform fees during early access — keep 100% of every rupee you earn',
      'Payment goes directly from buyer to you',
      'Build your supplier rating with every successful delivery',
      'Higher ratings = more visibility = more leads in the future',
    ],
  },
];

const BENEFITS = [
  { icon: ClipboardList, title: 'Qualified, Genuine Leads', desc: 'Every sourcing request comes from a real project with genuine purchase intent and defined budgets. No window-shoppers.' },
  { icon: IndianRupee, title: 'Zero Commission (Early Access)', desc: 'Quotex is currently free for all suppliers during our early access period. No subscription fees, no transaction cuts, no hidden charges.' },
  { icon: Send, title: 'Direct Buyer Access', desc: 'Chat directly with contractors and project managers who make the buying decisions. No middlemen, agents, or gatekeepers.' },
  { icon: TrendingUp, title: 'Grow Your Customer Base', desc: 'Reach new contractors and builders across all of Karnataka that you would never discover through your existing network.' },
  { icon: Target, title: 'Targeted Leads', desc: 'Filter requirements by your product category, delivery location, and budget range. Only see leads relevant to your business.' },
  { icon: BarChart3, title: 'Build Your Reputation', desc: 'Every successful deal builds your supplier rating. Higher-rated suppliers get more visibility and are preferred by buyers.' },
];

const FAQS = [
  { q: 'Is Quotex free for suppliers?', a: 'Yes, Quotex is currently free for all suppliers during our early access period. There are no subscription fees, no listing charges, and no commissions. We will introduce pricing tiers in the future with plenty of advance notice.' },
  { q: 'What kind of buyers are on Quotex?', a: 'Verified contractors, project builders, civil engineers, and procurement managers handling real construction and infrastructure projects across Karnataka.' },
  { q: 'How do I get notified about new leads?', a: 'You receive real-time notifications whenever a new sourcing requirement matching your product category is posted. You can also browse all active leads anytime.' },
  { q: 'Can I quote on any requirement?', a: 'Yes. As long as you can supply the materials requested, you can submit your quote on any active requirement on the platform.' },
  { q: 'What if the buyer wants to negotiate?', a: 'That is encouraged. Buyers can initiate chat with you to discuss pricing, delivery terms, brand alternatives, credit periods, and more. Negotiation is a normal part of B2B trading.' },
  { q: 'How do I get paid?', a: 'Payment is handled directly between you and the buyer. Quotex does not process payments or take any cut. Once the buyer accepts your quote, you agree on payment terms and settle directly.' },
];

export default function HowItWorksSuppliers() {
  const { user } = useUserState();
  const navigate = useNavigate();

  const triggerAuth = () => {
    localStorage.setItem('auth_default_role', 'seller');
    window.dispatchEvent(new Event('session-expired'));
  };

  const handleCTA = () => {
    if (user) navigate('/product-listing');
    else triggerAuth();
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/15 border-b border-slate-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial from-blue-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-radial from-emerald-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full mb-6">
            🏭 For Suppliers & Distributors
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Win Direct Orders from<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> Verified Contractors & Builders</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Browse live sourcing requests from real project sites with clear, structured RFQ cards. Submit your best quotes directly, negotiate terms, and win orders — free during early access.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCTA}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/15 active:scale-95 text-white font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200"
            >
              Browse Active Leads Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => navigate('/how-it-works/buyers')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm px-4 py-3 cursor-pointer transition-colors"
            >
              Are you a buyer instead? →
            </button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Step-by-step</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How to Win Orders on Quotex
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
            From browsing your first lead to receiving payment — here's exactly how it works for suppliers.
          </p>
        </div>

        <div className="space-y-12">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;
            const colors = ['blue', 'emerald', 'purple', 'orange'];
            const color = colors[idx % colors.length];
            const gradients = {
              blue: 'from-blue-50 to-sky-50',
              emerald: 'from-emerald-50 to-teal-50',
              purple: 'from-purple-50 to-violet-50',
              orange: 'from-orange-50 to-amber-50',
            };
            const borders = {
              blue: 'border-blue-200 group-hover:border-blue-400',
              emerald: 'border-emerald-200 group-hover:border-emerald-400',
              purple: 'border-purple-200 group-hover:border-purple-400',
              orange: 'border-orange-200 group-hover:border-orange-400',
            };
            const iconBgs = {
              blue: 'bg-blue-100 text-blue-600',
              emerald: 'bg-emerald-100 text-emerald-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            };
            const numColors = {
              blue: 'text-blue-500/15',
              emerald: 'text-emerald-500/15',
              purple: 'text-purple-500/15',
              orange: 'text-orange-500/15',
            };

            return (
              <div
                key={idx}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-8 group`}
              >
                {/* Number + Icon Card */}
                <div className="md:w-1/3 flex-shrink-0">
                  <div className={`bg-gradient-to-br ${gradients[color]} border ${borders[color]} rounded-2xl p-8 text-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5`}>
                    <span className={`text-6xl font-black ${numColors[color]} block mb-2`}>{step.num}</span>
                    <div className={`w-14 h-14 rounded-xl ${iconBgs[color]} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Why Quotex</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Suppliers Choose Quotex
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Common Questions from Suppliers
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-slate-200 hover:border-blue-200 rounded-xl overflow-hidden transition-colors duration-200"
            >
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer select-none list-none">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-sm font-bold text-slate-800 flex-1">{faq.q}</span>
                <Zap className="w-4 h-4 text-slate-300 group-open:text-blue-500 transition-colors shrink-0" />
              </summary>
              <div className="px-6 pb-5 pt-0 ml-7">
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
            Ready to Win More Orders?
          </h2>
          <p className="text-blue-100 text-base mb-8 max-w-xl mx-auto">
            Hundreds of verified contractors are posting bulk material requirements right now. Browse active leads and submit your first quote today.
          </p>
          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            Browse Active Leads — Free During Early Access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

    </div>
  );
}
