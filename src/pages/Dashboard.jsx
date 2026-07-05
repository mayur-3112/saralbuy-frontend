import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import bidService from '@/services/bid.service';
import { dateFormatter } from '@/utils/dateFormatter';
import { useUserState } from '@/redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import LandingPage from '@/components/custom/landing/LandingPage';
import OnboardingTour from '@/components/custom/dashboard/OnboardingTour';
import BidListing from './profile/BidListing';
import Requirements from './profile/Requirements';
import {
  Gavel,
  FileText,
  Plus,
  ArrowRight,
  Search,
  Rocket,
  Inbox,
  Compass,
  CheckCircle2,
} from 'lucide-react';

/**
 * Dashboard — the authenticated home for a supplier/buyer.
 *
 * Old version: 6 rainbow KPI cards (each with a different gradient) fighting
 * for attention, with the SAME counts duplicated in the tabs below. No
 * narrative. Every metric said "Est. Profit ₹42k" or similar hardcoded lies.
 *
 * New version: one contextual "Next up" card that adapts to state (first
 * visit → "Post your first RFQ"; pending quotes → "You have N quotes to
 * review"; caught up → "Explore leads"). Below it, two quick actions.
 * Below that, the same tabs (Quotes / Sourcing) — kept because they work.
 *
 * No hardcoded metrics. No fake numbers. Everything you see is either an
 * action or a real count.
 */

function NextUpCard({ state, navigate, quotesCount, sourcingCount, isSupplier }) {
  const card = (() => {
    if (isSupplier) {
      if (state === 'first_visit') {
        return {
          eyebrow: 'Welcome to SaralBuy',
          title: 'Find active sourcing leads',
          body: 'Browse live bulk requirements posted by verified contractors and buyers. Submit your quotes to start winning deals.',
          cta: { label: 'Explore live RFQs', onClick: () => navigate('/product-listing'), icon: Compass },
          alt: { label: 'Or post a requirement instead', onClick: () => navigate('/requirement') },
          icon: Rocket,
        };
      }
    }

    if (state === 'first_visit') {
      return {
        eyebrow: 'Welcome to SaralBuy',
        title: 'Post your first requirement',
        body: 'Tell us what you need — quantity, brand, delivery timeline. Verified suppliers in that category will start quoting.',
        cta: { label: 'Post a requirement', onClick: () => navigate('/requirement'), icon: Plus },
        alt: { label: 'Or browse leads first', onClick: () => navigate('/product-listing') },
        icon: Rocket,
      };
    }
    if (state === 'has_quotes') {
      return {
        eyebrow: 'Quotes waiting',
        title: `You have ${quotesCount} recent ${quotesCount === 1 ? 'quote' : 'quotes'}`,
        body: 'Review each quote, chat with the supplier if you have questions, and shortlist your favourites before deciding.',
        cta: { label: 'Review quotes', onClick: () => {}, icon: Inbox, jumpTo: 'quotes' },
        icon: Inbox,
      };
    }
    if (state === 'has_sourcing') {
      return {
        eyebrow: 'Active sourcing',
        title: `You have ${sourcingCount} open ${sourcingCount === 1 ? 'requirement' : 'requirements'}`,
        body: 'Suppliers are looking at them. Check for incoming quotes, or post another to keep momentum.',
        cta: { label: 'View my sourcing', onClick: () => {}, icon: FileText, jumpTo: 'requirements' },
        alt: { label: 'Post another', onClick: () => navigate('/requirement') },
        icon: FileText,
      };
    }
    // caught_up
    return {
      eyebrow: 'All caught up',
      title: 'Nothing pending. Nice work.',
      body: isSupplier 
        ? 'Submit quotes for new requirements, or check status on your submitted quotes.'
        : 'Post another requirement or browse fresh leads posted by other buyers.',
      cta: { label: 'Explore live RFQs', onClick: () => navigate('/product-listing'), icon: Compass },
      alt: isSupplier ? null : { label: 'Post a requirement', onClick: () => navigate('/requirement') },
      icon: CheckCircle2,
    };
  })();

  return { card };
}

export default function Dashboard() {
  const { user } = useUserState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('quotes');
  const [bids, setBids] = useState([]);
  const [drafts, setDrafts] = useState([]);

  const {
    fn: getLatestFn,
    data: latest,
    loading: loading,
  } = useFetch(bidService.getThreeLatestBids);

  useEffect(() => { getLatestFn(); }, []);

  useEffect(() => {
    if (!latest) return;
    setBids((latest.bids || []).map(bid => ({
      _id: bid._id,
      productId: bid?.productId?._id,
      date: dateFormatter(bid.createdAt),
      category: bid.productId?.categoryId?.categoryName || 'N/A',
      title: bid.productId?.title || 'Untitled',
      deliveryDate: dateFormatter(bid.earliestDeliveryDate),
      totalBids: bid?.productId?.totalBidCount || 0,
      image: bid.productId?.image || '/no-image.webp',
    })));
    setDrafts((latest.drafts || []).map(draft => ({
      _id: draft._id,
      date: dateFormatter(draft.createdAt),
      category: draft?.categoryId?.categoryName || 'N/A',
      title: draft.title,
      deliveryDate: dateFormatter(draft.earliestDeliveryDate),
      totalBids: draft?.totalBidCount || 0,
      image: draft?.image || '/no-image.webp',
    })));
  }, [latest]);

  if (!user) return <LandingPage />;

  // Decide which "Next up" state to render — pure state machine, no invented data.
  const state = (() => {
    if (loading) return 'loading';
    if (bids.length === 0 && drafts.length === 0) return 'first_visit';
    if (bids.length > 0) return 'has_quotes';
    if (drafts.length > 0) return 'has_sourcing';
    return 'caught_up';
  })();

  const isSupplier = user?.role === 'supplier' || user?.verificationStatus !== 'unverified';
  const { card } = NextUpCard({ state, navigate, quotesCount: bids.length, sourcingCount: drafts.length, isSupplier });
  const CardIcon = card.icon;

  return (
    <main className="relative min-h-screen bg-orange-50/30 pb-16">
      <OnboardingTour />
      <div className="w-full max-w-7xl mx-auto px-4">

        {/* Welcome header — warm and specific */}
        <div className="pt-8 pb-6">
          <div className="text-sm font-bold text-slate-600 mb-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {user?.firstName ? `Namaste, ${user.firstName}` : 'Welcome back'}
          </h1>
        </div>

        {/* Next-up primary card — the ONE thing to do next */}
        {state !== 'loading' && (
          <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(59, 130, 246,0.25), transparent 70%)' }} />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                <CardIcon className="w-8 h-8 text-orange-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-orange-300 mb-1.5">
                  {card.eyebrow}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">{card.title}</h2>
                <p className="text-base text-slate-300 mt-3 max-w-2xl leading-relaxed">{card.body}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (card.cta.jumpTo) setActiveTab(card.cta.jumpTo);
                    else card.cta.onClick();
                  }}
                  className="sb-big-tap inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-black text-base px-6 py-3.5 rounded-lg transition-all"
                >
                  <card.cta.icon className="w-5 h-5" />
                  {card.cta.label}
                </button>
                {card.alt && (
                  <button
                    onClick={card.alt.onClick}
                    className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    {card.alt.label} →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick actions — big and obvious, icon+label */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => navigate('/requirement')}
            className="sb-big-tap group flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 hover:shadow-md font-bold text-base px-5 py-4 rounded-xl transition-all"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            Post a requirement
          </button>
          <button
            onClick={() => navigate('/product-listing')}
            className="sb-big-tap group flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 hover:shadow-md font-bold text-base px-5 py-4 rounded-xl transition-all"
          >
            <Search className="w-5 h-5" />
            Browse live RFQs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tabs — bigger text, bigger tap targets */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-xl p-2 gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold text-sm rounded-lg transition-all ${
              activeTab === 'quotes'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-4 h-4" />
            Active Quotes
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              activeTab === 'quotes' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
            }`}>{bids.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold text-sm rounded-lg transition-all ${
              activeTab === 'requirements'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Open Requirements
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              activeTab === 'requirements' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
            }`}>{drafts.length}</span>
          </button>
        </div>

        {/* Tab body */}
        <div className="space-y-6">
          {activeTab === 'quotes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
              <BidListing />
            </div>
          )}
          {activeTab === 'requirements' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
              <Requirements />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
