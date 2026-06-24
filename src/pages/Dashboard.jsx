import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/useFetch';
import bidService from '@/services/bid.service';
import { dateFormatter } from '@/utils/dateFormatter';
import React, { useEffect, useState } from 'react';
import { useUserState } from '@/redux/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import LandingPage from '@/components/custom/landing/LandingPage';
import OnboardingTour from '@/components/custom/dashboard/OnboardingTour';
import BidListing from './profile/BidListing';
import Requirements from './profile/Requirements';
import {
  Gavel,
  FileText,
  Briefcase,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  PieChart,
  BarChart4,
  Search
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useUserState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('quotes');
  const [bids, setBids] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const {
    fn: getLatestThreeBidsFn,
    data: getLatestBidandDrafts,
    loading: bidResponseLoading,
  } = useFetch(bidService.getThreeLatestBids);

  useEffect(() => {
    getLatestThreeBidsFn();
  }, []);

  useEffect(() => {
    if (getLatestBidandDrafts) {
      // bids
      const formattedBids = getLatestBidandDrafts?.bids.map(bid => ({
        _id: bid._id,
        productId: bid?.productId?._id,
        date: dateFormatter(bid.createdAt),
        category: bid.productId?.categoryId?.categoryName || 'N/A',
        title: bid.productId?.title || 'Untitled',
        deliveryDate: dateFormatter(bid.earliestDeliveryDate),
        totalBids: bid?.productId?.totalBidCount || 0,
        image: bid.productId?.image || '/no-image.webp',
      }));
      setBids(formattedBids);

      // drafts
      const formattedDrafts = getLatestBidandDrafts?.drafts.map(draft => ({
        _id: draft._id,
        date: dateFormatter(draft.createdAt),
        category: draft?.categoryId?.categoryName || 'N/A',
        title: draft.title,
        deliveryDate: dateFormatter(draft.earliestDeliveryDate),
        totalBids: draft?.totalBidCount || 0,
        image: draft?.image || '/no-image.webp',
      }));
      setDrafts(formattedDrafts);
    }
  }, [getLatestBidandDrafts]);

  if (!user) {
    return <LandingPage />;
  }

  return (
    <main className="relative min-h-screen bg-slate-50 pb-16">
      <OnboardingTour />
      <div className="w-full max-w-7xl mx-auto px-4">
        
        {/* Welcome Header */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Welcome back, {user?.firstName || 'Partner'}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Your partner workspace — manage quotes, sourcing needs, and explore new leads.
            </p>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          {/* Quotes Submitted */}
          <div 
            onClick={() => setActiveTab('quotes')}
            className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #fff9f3 100%)' }}
          >
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
              <Gavel className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Quotes Sent</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{bids.length}</p>
            </div>
          </div>

          {/* My Sourcing Needs */}
          <div 
            onClick={() => setActiveTab('requirements')}
            className="group bg-white border border-slate-200 hover:border-blue-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #f0f7ff 100%)' }}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">My Sourcing</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{drafts.length}</p>
            </div>
          </div>

          {/* Explore Leads */}
          <div 
            onClick={() => navigate('/product-listing')}
            className="group bg-white border border-slate-200 hover:border-emerald-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #f0fdf4 100%)' }}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Explore Leads</p>
              <p className="text-sm font-black text-emerald-600 mt-0.5">Browse →</p>
            </div>
          </div>

          {/* Messages */}
          <div 
            onClick={() => navigate('/chat')}
            className="group bg-white border border-slate-200 hover:border-purple-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #faf5ff 100%)' }}
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Messages</p>
              <p className="text-sm font-black text-purple-600 mt-0.5">Open Chat</p>
            </div>
          </div>

          {/* Deals Closed (Sales Tracker) */}
          <div 
            onClick={() => setActiveTab('quotes')}
            className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 cursor-pointer relative overflow-hidden hidden lg:flex"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #ecfdf5 100%)' }}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Win Rate</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">32%</p>
            </div>
          </div>

          {/* Est Margin (Profit Tracker) */}
          <div 
            onClick={() => window.open('/supplier-tools', '_blank')}
            className="group bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 cursor-pointer relative overflow-hidden hidden lg:flex"
            style={{ background: 'linear-gradient(135deg, #ffffff 80%, #fffbeb 100%)' }}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
              <BarChart4 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Est. Profit</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">₹42k</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={() => navigate('/requirement')}
            className="group flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/15 active:scale-[0.98] text-white font-bold text-sm px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Post New Sourcing Requirement
          </button>
          <button
            onClick={() => navigate('/product-listing')}
            className="group flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 hover:text-orange-700 font-bold text-sm px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            Explore Active RFQs & Leads
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Physical Tabs Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 mb-6 bg-white rounded-xl p-2 gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span className="hidden sm:inline">My Submitted Quotes</span>
            <span className="sm:hidden">My Quotes</span>
            {' '}({bids.length})
          </button>
          
          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">My Sourcing Needs & Drafts</span>
            <span className="sm:hidden">My Sourcing</span>
            {' '}({drafts.length})
          </button>
        </div>

        {/* Tab Content Panels */}
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
};

export default Dashboard;
