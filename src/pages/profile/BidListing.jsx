import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dateFormatter } from '@/utils/dateFormatter';
// import { fallBackName } from '@/helper/fallBackName';
import { useFetch } from '@/hooks/useFetch';
import bidService from '@/services/bid.service';
import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkeletonTable } from '@/const/CustomSkeletons';
import TableListing from '@/components/custom/TableListing';
import { useDebounce } from 'use-debounce';
import AlertPopup from '@/components/custom/popups/AlertPopup';
import TooltipComp from '@/lib/TooltipComp';
import { toast } from 'sonner';
import { fallBackName } from '@/utils/fallBackName';
import { mergeName } from '@/utils/mergerName';
import { currencyConvertor } from '@/utils/currencyConvertor';

const BidListing = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentBidId, setCurrentBidId] = useState('');
  const message = {
    title: 'Delete Quote',
    message: 'This action cannot be undone. This quote will be permanently deleted.',
  };
  const navigate = useNavigate();
  const {
    fn: fetchBidsFn,
    data: fetchBidsResponse,
    loading: bidLoading,
  } = useFetch(bidService.getAllBids);
  const {
    fn: deleteBidFn,
    data: deletBidResponse,
    loading: deleteBidloading,
  } = useFetch(bidService.deleteBid);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [value, { isPending }] = useDebounce(search, 600);
  const [activeTab, setActiveTab] = useState('pending');
  const columns = [
    {
      accessorKey: 'avtar',
      header: '',
      cell: ({ row }) => {
        return (
          <div className=" ">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={row.original.avatar}
                alt="product image"
                className="rounded-full w-full h-full object-cover"
              />
              <AvatarFallback className="bg-gray-200 rounded-full flex w-full h-full  items-center justify-center text-sm font-semibold">
                {/* {fallBackName(row.original?.product)} */}
                <img src="/no-image.webp"></img>
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return <span className="whitespace-nowrap text-sm">{row.getValue('date')}</span>;
      },
    },

    {
      accessorKey: 'buyer',
      header: 'Buyer',
    },
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => {
        return (
          <span className="block max-w-45 truncate text-sm" title={row.getValue('product')}>
            {row.getValue('product')}
          </span>
        );
      },
    },
    // {
    //     accessorKey: "min_budget",
    //     header: "Min. Budget",
    // },
    {
      accessorKey: 'your_budget',
      header: 'Quoted Price',
    },

    {
      accessorKey: 'delivery',
      header: 'Delivery',
      cell: ({ row }) => {
        return <span className="whitespace-nowrap text-sm">{row.getValue('delivery')}</span>;
      },
    },

    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original?.status?.toLowerCase();
        
        if (status === 'accepted') {
          return <Badge className="bg-green-100 text-green-600 rounded-full px-3 w-28 text-center flex justify-center">Accepted</Badge>;
        }
        if (status === 'rejected') {
          return <Badge className="bg-red-100 text-red-500 rounded-full px-3 w-28 text-center flex justify-center">Rejected</Badge>;
        }
        if (status === 'shortlisted') {
          return <Badge className="bg-orange-100 text-orange-600 rounded-full px-3 w-28 text-center flex justify-center">Shortlisted</Badge>;
        }
        return <Badge className="bg-gray-100 text-gray-600 rounded-full px-3 w-28 text-center flex justify-center">Pending</Badge>;
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              className="text-sm cursor-pointer text-orange-600 hover:text-orange-800 bg-orange-50/50 hover:bg-orange-100 h-8 px-3 rounded-md"
              variant={'ghost'}
              onClick={() => {
                navigate('/bid-overview/' + row.original?._id);
              }}
            >
              View
            </Button>
            <Button
              className="text-sm cursor-pointer text-red-500 hover:text-red-700 bg-red-50/50 hover:bg-red-100 h-8 w-8 p-0 rounded-md"
              variant={'ghost'}
              onClick={() => {
                if (deleteBidloading) return;
                setCurrentBidId(row.original?._id);
                setOpen(true);
              }}
              title="Delete Quote"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    fetchBidsFn(limit, page, value);
  }, [limit, page, value]);

  useEffect(() => {
    if (fetchBidsResponse) {
      const { bids, total: totalCount, limit: pageLimit } = fetchBidsResponse;
      const formattedData = bids.map(item => {
        let mainProductId = item.product?.product?._id || item.product?._id;
        let mainProductBuyerId = item.product?.product?.userId || item.product?.userId;
        const createdAt = new Date(item.createdAt).getTime();
        const durationDays = Number(item.product?.bidActiveDuration);
        const expiryTime = createdAt + durationDays * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const diff = expiryTime - now;
        return {
          _id: item._id,
          date: dateFormatter(item.createdAt),
          buyer: mergeName(item.buyer),
          avatar: item?.product?.image,
          product: item.product.title,
          productId: mainProductId,
          productBuyerId: mainProductBuyerId,
          delivery:
            dateFormatter(
              item.earliestDeliveryDate || item.product?.paymentAndDelivery?.ex_deliveryDate
            ) || 'N/A',
          location: item.product?.paymentAndDelivery?.organizationAddress || 'N/A',
          min_budget: item?.product?.minimumBudget,
          your_budget: currencyConvertor(item?.budgetQuation),
          status: item?.quoteStatus || 'pending',
        };
      });

      setData(formattedData);
      setTotal(totalCount);
      setLimit(pageLimit);
    }
  }, [fetchBidsResponse]);

  async function handleDeleteBid(id) {
    // if (!currentBidId) return;
    await deleteBidFn(id);
  }

  useEffect(() => {
    if (deletBidResponse) {
      toast.success('Bid deleted successfully');
      //  remove the bid from the list
      const updatedData = data.filter(item => item._id !== currentBidId);
      setData(updatedData);
      setCurrentBidId(null);
    }
  }, [deletBidResponse]);

  const filteredData = data.filter(item => {
    if (activeTab === 'pending') {
      return item.status === 'pending' || item.status === 'shortlisted';
    }
    return item.status === activeTab;
  });

  return (
    <>
      <AlertPopup
        loading={deleteBidloading}
        setOpen={setOpen}
        open={open}
        message={message}
        deleteFunction={() => {
          handleDeleteBid(currentBidId);
        }}
      />
      {bidLoading && !fetchBidsResponse ? (
        <SkeletonTable />
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('pending')}
              className={activeTab === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-slate-600 hover:bg-slate-50'}
            >
              Pending
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('accepted')}
              className={activeTab === 'accepted' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-slate-600 hover:bg-slate-50'}
            >
              Accepted
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('rejected')}
              className={activeTab === 'rejected' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-slate-600 hover:bg-slate-50'}
            >
              Rejected
            </Button>
          </div>
          <TableListing
            data={filteredData}
            columns={columns}
            filters={true}
            title="Quotes Submitted"
            colorPalette="gray"
            page={page}
            setPage={setPage}
            total={total}
            limit={limit}
            setSearch={setSearch}
            search={search}
            isPending={bidLoading}
            placeholer="Search Product..."
          />
        </div>
      )}
    </>
  );
};

export default BidListing;
