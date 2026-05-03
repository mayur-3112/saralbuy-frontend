import Banner from '@/components/custom/dashboard/Banner';
import DyanmicHomeCard from '@/components/custom/dashboard/DynamicHomeCard';
import Requirement from '@/components/custom/dashboard/Requirement';
import RequirementSlide from '@/components/custom/dashboard/RequirementSlide';
import SwiperSlider from '@/components/custom/dashboard/SwiperSlider';
import TrendingCategory from '@/components/custom/dashboard/TrendingCategory';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/useFetch';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import bidService from '@/services/bid.service';
import productService from '@/services/product.service';
import { dateFormatter } from '@/utils/dateFormatter';
import React, { useEffect, useState } from 'react';

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

  return (
    <main className="relative min-h-screen ">
      <div className="w-full max-w-7xl mx-auto px-4">
        <Banner />
        {/* bid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-3">
          {bidResponseLoading ? (
            <ItemSkeleton />
          ) : bids.length > 0 ? (
            <SwiperSlider key={'bid'} title="Your Quote" target="bids" color="gray" data={bids} />
          ) : (
            <SwiperSlider title="Your Quote" target="bids" color="gray" data={[]} />
          )}
          {bidResponseLoading ? (
            <ItemSkeleton />
          ) : drafts.length > 0 ? (
            <SwiperSlider
              key={'draft'}
              title="Your Drafts"
              target="drafts"
              color="orange"
              data={drafts}
            />
          ) : (
            <SwiperSlider title="Your Drafts" target="draft" color="orange" data={[]} />
          )}
        </div>
      </div>
      {/* requirement  */}
      <div className="mt-10">
        <RequirementSlide />
      </div>
      {/* trending Section */}
      <div className="mt-10 relative mx-auto px-4 w-full pt-10">
        <TrendingCategory categories={trendingRes} />
        <img
          src="All In One Market Place that Fits You.png"
          className="absolute -top-5 mt-7 left-0 w-full"
        ></img>
      </div>

      {/* requirement  */}
      {/* <div > */}
      {/* <Requirement title="Electronics" color="orange" /> */}
      {/* </div> */}
      {/* dyanmic data */}
      {data &&
        data.map((item, idx) => (
          <DyanmicHomeCard key={idx + 1} bg={idx === 0 ? 'gray' : ''} item={item} />
        ))}
    </main>
  );
};

export default Dashboard;
