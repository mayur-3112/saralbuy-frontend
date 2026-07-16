import React, { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RequirementSlider from './profile/RequirementSlider';
import { RequirementCardSkeleton } from '@/const/CustomSkeletons';
import ProductListingCard from '@/components/custom/listing/ProductListingCard';
import productService from '@/services/product.service';
import TooltipComp from '@/lib/TooltipComp';
import { MoveRight, SquarePen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import requirementService from '@/services/requirement.service';

const ScrollablePagination = ({
  state,
  target,
  limit,
  tab = '',
  setState,
  setSelectedTileId,
  setOpen,
}) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialized = useRef(false);
  const isFetching = useRef(false);
  const navigate = useNavigate();
  const fetchData = async (page, limit) => {
    if (target === 'requirements') {
      return await requirementService.getMyRequirements(page, limit);
    } else if (target === 'drafts') {
      return await productService.getDrafts(page, limit);
    }
  };

  // useEffect(() => {
  //   if (state?.data?.length > 0 && !isInitialized.current) {
  //     setProducts(state.data);
  //     setState((prev:any)=>{
  //       return {...prev, data:state.data}
  //     })
  //     setPage(state.page);
  //     setHasMore(state.page < state.totalPages);
  //     isInitialized.current = true;
  //   } else if (state?.data?.length === 0 && state?.totalPages === 0 && !isInitialized.current) {
  //     setProducts([]);
  //     setHasMore(false);
  //     isInitialized.current = true;
  //   }
  // }, [state]);

  useEffect(() => {
    if (!Array.isArray(state?.data)) return;

    setProducts(state.data);

    if (!isInitialized.current) {
      setPage(state.page);
      setHasMore(state.page < state.totalPages);
      isInitialized.current = true;
    }
  }, [state.data]);

  useEffect(() => {
    return () => {
      isInitialized.current = false;
      isFetching.current = false;
    };
  }, [target]);

  const fetchMoreData = async () => {
    if (!hasMore || isFetching.current) return;

    isFetching.current = true;

    try {
      const nextPage = page + 1;
      let res = await fetchData(nextPage, limit);

      if (res?.data && res.data.length > 0) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newItems = res.data.filter(item => !existingIds.has(item._id));
          const updatedProducts = [...prev, ...newItems];
          setState(prev => {
            return {
              ...prev,
              data: updatedProducts,
              page: nextPage,
              totalPages: res.totalPages,
            };
          });
          return updatedProducts;
        });
        setPage(nextPage);
        setHasMore(nextPage < res.totalPages);
      } else {
        console.log('No more data available');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching next page:', err);
      setHasMore(false);
    } finally {
      isFetching.current = false;
    }
  };
  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={new Array(3).fill(0).map((_, idx) => (
        <RequirementCardSkeleton key={idx} />
      ))}
      //   endMessage={
      //     products.length > 0 ? (
      //       <p className="text-center text-gray-500 py-4">
      //         No more requirements to load
      //       </p>
      //     ) : null
      //   }
      className="grid grid-cols-1 gap-4"
    >
      {products?.map((item, idx) => (
        <div key={item._id || idx} className="w-full relative">
          {target === 'drafts' && (
            <div
              className="absolute top-2 right-2 z-10 bg-orange-100 text-orange-500 rounded-sm p-1 cursor-pointer"
              onClick={() => {
                console.log(item);
                setOpen?.(true);
                setSelectedTileId?.(item._id);
              }}
            >
              <TooltipComp
                hoverChildren={<X className="h-4 w-4" />}
                contentChildren={<p>Delete Draft</p>}
              ></TooltipComp>
            </div>
          )}
          
          <ProductListingCard
            product={item}
            actionLabel={target === 'drafts' ? 'Edit Draft' : 'View RFQ'}
            onActionClick={() => {
              if (target === 'drafts') {
                // Draft items ARE product docs → item._id is the product id.
                navigate('/update-draft/' + item._id);
              } else {
                // View RFQ always opens the universal Product Overview page first
                // (same page a supplier lands on) — from there the "Total Quote" /
                // sticky CTA routes the owner on to the action page (quotes,
                // shortlist, chat) via ProductOverview's own isMe branching.
                const prod = item?.productId || item?.product || item;
                const pid = prod?._id || item._id;
                navigate('/product-overview?productId=' + pid);
              }
            }}
            showOwnerActions={target === 'requirements'}
            onEdit={() => {
              const prod = item?.productId || item?.product || item;
              const pid = prod?._id || item._id;
              navigate('/update-product/' + pid);
            }}
            onDelete={() => {
              // Deletion targets the PRODUCT (backend deleteProduct also removes the
              // linked requirement). For requirement rows that's item.product._id;
              // for drafts the row IS the product so item._id is correct.
              const prod = item?.productId || item?.product || item;
              const pid = prod?._id || item._id;
              setSelectedTileId?.(pid);
              setOpen?.(true);
            }}
          />
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default ScrollablePagination;
