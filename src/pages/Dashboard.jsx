import DyanmicHomeCard from '@/components/custom/dashboard/DynamicHomeCard';
import Requirement from '@/components/custom/dashboard/Requirement';
import SwiperSlider from '@/components/custom/dashboard/SwiperSlider';
import TrendingCategory from '@/components/custom/dashboard/TrendingCategory';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/useFetch';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import bidService from '@/services/bid.service';
import productService from '@/services/product.service';
import { dateFormatter } from '@/utils/dateFormatter';
import React, { useEffect, useState } from 'react';
import { useUserState } from '@/redux/hooks/useUser';
import LandingPage from '@/components/custom/landing/LandingPage';
import SourcingWorkspace from '@/components/custom/dashboard/SourcingWorkspace';
import OnboardingTour from '@/components/custom/dashboard/OnboardingTour';


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
  const [bids, setBids] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const { fn, data } = useFetch(productService.getHomeCards);
  const { fn: trendingFn, data: trendingRes } = useFetch(productService.getTrendingCategory);
  const {
    fn: getLatestThreeBidsFn,
    data: getLatestBidandDrafts,
    loading: bidResponseLoading,
  } = useFetch(bidService.getThreeLatestBids);

  useEffect(() => {
    getLatestThreeBidsFn();
    trendingFn();
    fn();
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

      //  drafts
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
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome, {user?.firstName || 'Partner'}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Your procurement dashboard
            </p>
          </div>
        </div>

        {/* Serious B2B Sourcing Board with Interactive Filters */}
        <SourcingWorkspace 
          user={user} 
          userBidsCount={bids.length} 
          userDraftsCount={drafts.length} 
        />

        {/* Sliders for Bids and Drafts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 gap-6">
          {bidResponseLoading ? (
            <ItemSkeleton />
          ) : bids.length > 0 ? (
            <SwiperSlider key={'bid'} title="Your Bids/Quotes" target="bids" color="gray" data={bids} />
          ) : (
            <SwiperSlider title="Your Bids/Quotes" target="bids" color="gray" data={[]} />
          )}
          {bidResponseLoading ? (
            <ItemSkeleton />
          ) : drafts.length > 0 ? (
            <SwiperSlider
              key={'draft'}
              title="Your Draft Requirements"
              target="drafts"
              color="orange"
              data={drafts}
            />
          ) : (
            <SwiperSlider title="Your Draft Requirements" target="draft" color="orange" data={[]} />
          )}
        </div>

        {/* Category browsing grid */}
        {trendingRes && (
          <div className="mt-12 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <TrendingCategory categories={trendingRes} />
          </div>
        )}

        {/* Dynamic content cards */}
        <div className="mt-8">
          {data &&
            data.map((item, idx) => (
              <DyanmicHomeCard key={idx + 1} bg={idx === 0 ? 'gray' : ''} item={item} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
