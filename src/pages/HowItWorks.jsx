import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/redux/hooks/useUser';
import {
  ArrowRight,
  FileText,
  Users,
  MessageSquare,
  Handshake,
  Search,
  Gavel,
  TrendingUp,
  ShieldCheck,
  Package,
  Truck,
  BadgeCheck,
  ClipboardList,
  Send,
  MessagesSquare,
  Receipt,
} from 'lucide-react';

const BUYER_STEPS = [
  {
    num: '01',
    icon: FileText,
    title: 'Post Your Requirement',
    desc: 'Fill in what materials your project needs — cement, TMT steel, plumbing, electrical, tiles — with quantities, specs, and delivery location. Takes under 60 seconds.',
    detail: 'Upload drawings, BOQ, or spec sheets for precise supplier matching.',
    color: 'orange',
  },
  {
    num: '02',
    icon: Users,
    title: 'Receive Competitive Quotes',
    desc: 'Our network of verified, GST-registered suppliers review your request and submit direct, competitive price quotes within hours.',
    detail: 'Compare prices, delivery terms, and credit periods side-by-side.',
    color: 'blue',
  },
  {
    num: '03',
    icon: MessageSquare,
    title: 'Negotiate Directly',
    desc: 'Chat with bidding suppliers in real-time. Discuss delivery schedules, payment terms, material specifications, or volume discounts.',
    detail: 'All negotiations are logged for transparency and accountability.',
    color: 'emerald',
  },
  {
    num: '04',
    icon: Handshake,
    title: 'Close Deal & Pay Direct',
    desc: 'Approve the best quote, issue your purchase order, and settle directly with the supplier. Zero commissions, zero middleman markups.',
    detail: 'Rate suppliers post-delivery to build trust in the network.',
    color: 'purple',
  },
];

const SUPPLIER_STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'Browse Live Sourcing Leads',
    desc: 'Explore hundreds of active bulk material requests posted by verified contractors, builders, and project managers across Karnataka.',
    detail: 'Filter leads by category, location, budget, and delivery timeline.',
    color: 'orange',
  },
  {
    num: '02',
    icon: Gavel,
    title: 'Submit Your Best Quote',
    desc: 'Select requirements that match your inventory and submit competitive quotes with your price, delivery date, and terms.',
    detail: 'Attach product catalogs, test certificates, or sample references.',
    color: 'blue',
  },
  {
    num: '03',
    icon: MessagesSquare,
    title: 'Negotiate & Build Relationships',
    desc: 'Engage buyers in direct chat. Clarify specs, offer bulk discounts, discuss credit terms, and build long-term supply relationships.',
    detail: 'Repeat business opportunities from satisfied project buyers.',
    color: 'emerald',
  },
  {
    num: '04',
    icon: Receipt,
    title: 'Win Orders & Get Paid',
    desc: 'When a buyer accepts your quote, receive the purchase order and deliver directly. Payments flow directly to you — no platform cuts.',
    detail: 'Build your supplier rating to win more leads over time.',
    color: 'purple',
  },
];

const BUYER_BENEFITS = [
  { icon: TrendingUp, title: 'Save 10-25%', desc: 'Direct factory/distributor pricing eliminates middleman markups on bulk orders.' },
  { icon: ShieldCheck, title: 'Verified Suppliers', desc: 'Every supplier is GST-registered and vetted for quality and delivery reliability.' },
  { icon: Package, title: 'All Categories', desc: 'From cement and steel to tiles, paints, plumbing, electrical — source everything in one place.' },
  { icon: Truck, title: 'Site Delivery', desc: 'Suppliers quote with delivery to your project site. No separate logistics hassle.' },
];

const SUPPLIER_BENEFITS = [
  { icon: ClipboardList, title: 'Qualified Leads', desc: 'Every requirement is from a real project with genuine purchase intent and budget.' },
  { icon: BadgeCheck, title: 'Zero Commission', desc: 'No platform fees or commissions. You keep 100% of every order you win.' },
  { icon: Send, title: 'Direct Access', desc: 'Chat directly with decision-makers — no brokers, no gatekeepers in between.' },
  { icon: TrendingUp, title: 'Grow Your Business', desc: 'Reach new contractors and builders across Karnataka that you would never find otherwise.' },
];

const colorMap = {
  orange: {
    numBg: 'bg-orange-100 text-orange-600',
    border: 'border-orange-200 hover:border-orange-400',
    accent: 'bg-orange-500',
    iconBg: 'bg-orange-50',
  },
  blue: {
    numBg: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200 hover:border-blue-400',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-50',
  },
  emerald: {
    numBg: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-200 hover:border-emerald-400',
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
  },
  purple: {
    numBg: 'bg-purple-100 text-purple-600',
    border: 'border-purple-200 hover:border-purple-400',
    accent: 'bg-purple-500',
    iconBg: 'bg-purple-50',
  },
};

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('buyers');
  const { user } = useUserState();
  const navigate = useNavigate();

  const triggerAuth = (roleType) => {
    localStorage.setItem('auth_default_role', roleType);
    window.dispatchEvent(new Event('session-expired'));
  };

  const steps = activeTab === 'buyers' ? BUYER_STEPS : SUPPLIER_STEPS;
  const benefits = activeTab === 'buyers' ? BUYER_BENEFITS : SUPPLIER_BENEFITS;

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-100/20 border-b border-orange-100/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-radial from-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            How <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">SaralBuy</span> Works
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Whether you're sourcing bulk materials for a project or supplying to contractors — SaralBuy connects you directly, with zero middlemen.
          </p>

          {/* Role Toggle Tabs */}
          <div className="mt-10 inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-6 sm:px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'buyers'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              👷 For Buyers
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-6 sm:px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'suppliers'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              🏭 For Suppliers
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Step-by-step</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {activeTab === 'buyers' ? 'Source Materials in 4 Simple Steps' : 'Win Orders in 4 Simple Steps'}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const cm = colorMap[step.color];
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`group relative bg-white border ${cm.border} rounded-2xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-350 flex flex-col overflow-hidden`}
              >
                {/* Top accent */}
                <div className={`absolute left-0 right-0 top-0 h-1 ${cm.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>

                {/* Step number + icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-10 h-10 rounded-xl ${cm.numBg} flex items-center justify-center font-black text-sm`}>
                    {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${cm.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-200 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3 flex-1">
                  {step.desc}
                </p>
                <p className="text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-3">
                  💡 {step.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50/70 border-t border-b border-slate-200/50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Why SaralBuy</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'buyers' ? 'Why Buyers Choose SaralBuy' : 'Why Suppliers Choose SaralBuy'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
          {activeTab === 'buyers' ? 'Ready to Source Smarter?' : 'Ready to Win More Orders?'}
        </h2>
        <p className="text-slate-600 text-base mb-8 max-w-xl mx-auto">
          {activeTab === 'buyers'
            ? 'Post your first requirement in under 60 seconds and start receiving competitive quotes from verified suppliers.'
            : 'Browse active sourcing leads right now and submit your first quote to start winning direct orders.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {activeTab === 'buyers' ? (
            <>
              <button
                onClick={() => {
                  if (user) navigate('/requirement');
                  else triggerAuth('buyer');
                }}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/15 active:scale-95 text-white font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200"
              >
                Post a Requirement
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate('/product-listing')}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 hover:text-orange-700 font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200"
              >
                Explore Categories
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/product-listing')}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/15 active:scale-95 text-white font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200"
              >
                Browse Active Leads
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => {
                  if (user) navigate('/dashboard');
                  else triggerAuth('seller');
                }}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 hover:text-orange-700 font-bold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all duration-200"
              >
                Register as Supplier
              </button>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
