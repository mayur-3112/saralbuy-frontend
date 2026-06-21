import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/useFetch';
import bidService from '@/services/bid.service';
import { dateFormatter } from '@/utils/dateFormatter';
import React, { useEffect, useState } from 'react';
import { useUserState } from '@/redux/hooks/useUser';
import LandingPage from '@/components/custom/landing/LandingPage';
import OnboardingTour from '@/components/custom/dashboard/OnboardingTour';
import BidListing from './profile/BidListing';
import Requirements from './profile/Requirements';
import { Gavel, FileText } from 'lucide-react';

const ItemSkeleton = () => (
  <div className="flex flex-col space-y-5">
    <div className="space-y-2 flex justify-between items">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-5 w-1/4" />
    </div>
    <Skeleton className="h-full w-full rounded-xl" />
  </div>
);

const Dashboard = () => {
  const { user } = useUserState();
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
        <div className="pt-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Partner Workspace
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Manage quotes, requirements, and handle negotiations.
            </p>
          </div>
        </div>

        {/* Physical Tabs Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 mb-8 bg-white rounded-xl p-2 gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 font-bold text-xs rounded-lg transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <Gavel className="w-4 h-4" />
            My Submitted Quotes ({bids.length})
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
            My Sourcing Needs & Drafts ({drafts.length})
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
