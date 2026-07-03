import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

import 'keen-slider/keen-slider.min.css';

import { SkeletonTable } from '@/const/CustomSkeletons';
import TableListing from '@/components/custom/TableListing';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import requirementService from '@/services/requirement.service';
import { useFetch } from '@/hooks/useFetch';
import { dateFormatter } from '@/utils/dateFormatter';
import { mergeName } from '@/utils/mergerName';
import { fallBackName } from '@/utils/fallBackName';
import { Badge } from '@/components/ui/badge';
import { currencyConvertor } from '@/utils/currencyConvertor';
import { toast } from 'sonner';

const DealSurveyModal = ({ isOpen, onClose, dealId }) => {
  const [form, setForm] = useState({
    wasDealClosed: null,
    finalAmount: '',
    rating: 0,
    experience: '',
    wouldRecommend: null,
    feedback: '',
    issuesFaced: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.wasDealClosed === null) {
      toast.error('Please select if the deal was closed or not');
      return;
    }
    if (form.wasDealClosed && !form.finalAmount) {
      toast.error('Please enter the final deal amount');
      return;
    }
    if (!form.rating) {
      toast.error('Please rate your experience');
      return;
    }
    setSubmitting(true);
    try {
      await requirementService.submitDealSurvey({
        dealId,
        ...form,
        finalAmount: form.finalAmount ? Number(form.finalAmount) : undefined,
      });
      toast.success('Thank you for your feedback!');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-800">Deal Feedback Survey</h3>
          <p className="text-sm text-gray-500 mt-1">Help us improve by sharing your experience</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Was deal closed? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Was the deal actually closed? *</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, wasDealClosed: true }))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${form.wasDealClosed === true ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                ✅ Yes
              </button>
              <button type="button" onClick={() => setForm(f => ({ ...f, wasDealClosed: false }))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${form.wasDealClosed === false ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                ❌ No
              </button>
            </div>
          </div>

          {/* Final Amount */}
          {form.wasDealClosed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Deal Amount (₹) *</label>
              <input type="number" placeholder="e.g. 250000" value={form.finalAmount}
                onChange={e => setForm(f => ({ ...f, finalAmount: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none" />
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setForm(f => ({ ...f, rating: star }))}
                  className={`text-2xl transition-transform hover:scale-110 ${star <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </button>
              ))}
              {form.rating > 0 && <span className="text-sm text-gray-500 ml-2 self-center">{form.rating}/5</span>}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How was the overall experience?</label>
            <div className="grid grid-cols-2 gap-2">
              {['excellent', 'good', 'average', 'poor'].map(exp => (
                <button key={exp} type="button" onClick={() => setForm(f => ({ ...f, experience: exp }))}
                  className={`px-3 py-2 rounded-lg border text-sm capitalize ${form.experience === exp ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {exp === 'excellent' ? '🌟 ' : exp === 'good' ? '👍 ' : exp === 'average' ? '😐 ' : '👎 '}{exp}
                </button>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend this buyer/supplier?</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, wouldRecommend: true }))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${form.wouldRecommend === true ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                👍 Yes
              </button>
              <button type="button" onClick={() => setForm(f => ({ ...f, wouldRecommend: false }))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium ${form.wouldRecommend === false ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                👎 No
              </button>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional feedback (optional)</label>
            <textarea rows={3} placeholder="Share any thoughts about the deal..." value={form.feedback}
              onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none" />
          </div>

          {/* Issues */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Any issues faced? (optional)</label>
            <textarea rows={2} placeholder="Describe any problems you encountered..." value={form.issuesFaced}
              onChange={e => setForm(f => ({ ...f, issuesFaced: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CloseDeal = () => {
  const navigate = useNavigate();
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyDealId, setSurveyDealId] = useState(null);

  const openSurvey = (dealId) => {
    setSurveyDealId(dealId);
    setSurveyOpen(true);
  };

  const columnsCompletedReq = [
    {
      accessorKey: 'avtar',
      header: '',
      cell: ({ row }) => {
        return (
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
            <Avatar className="w-10 h-10 ">
              <AvatarImage
                src={row.original.avatar}
                className="rounded-full w-full h-full object-cover"
              />
              <AvatarFallback className="bg-gray-200 rounded-full flex w-full h-full  items-center justify-center text-sm font-semibold">
                {fallBackName(row.original.requirement)}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'finalized_with',
      header: 'Buyer Name',
    },
    {
      accessorKey: 'requirement',
      header: 'Requirement',
    },
    {
      accessorKey: 'final_budget',
      header: 'Final Budget',
    },
    {
      accessorKey: 'dealStatus',
      header: 'Deal Status',
      cell: ({ row }) => {
        const diff = row.original?.dealStatus?.toLowerCase() === 'rejected';
        if (!row.original?.dealStatus) {
          return (
            <Badge className="bg-transparent text-black rounded-full px-2 w-20 text-md">N/A</Badge>
          );
        } else if (diff) {
          return <Badge className="bg-red-100 text-red-500 rounded-full px-2 ">Rejected</Badge>;
        } else {
          return (
            <Badge className="bg-green-100 text-green-500 rounded-full capitalize px-3 ">
              {row.original?.dealStatus}
            </Badge>
          );
        }
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              className="text-sm cursor-pointer text-gray-600 underline"
              variant={'link'}
              onClick={() => {
                navigate('/product-overview?productId=' + row.original?.productId);
              }}
            >
              View
            </Button>
            <Button
              className="text-sm cursor-pointer text-blue-600"
              variant={'link'}
              onClick={() => openSurvey(row.original?._id)}
            >
              Feedback
            </Button>
          </div>
        );
      },
    },
  ];

  const columnsApproveBids = [
    {
      accessorKey: 'avtar',
      header: '',
      cell: ({ row }) => {
        return (
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={row.original.avatar}
                alt="@shadcn"
                className="rounded-full w-full h-full object-cover"
              />
              <AvatarFallback className="bg-gray-200 rounded-full flex w-full h-full  items-center justify-center text-sm font-semibold">
                {fallBackName(row.original.product)}
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
      accessorKey: 'seller',
      header: 'Seller Name',
    },
    {
      accessorKey: 'product',
      header: 'Product',
    },
    {
      accessorKey: 'final_price',
      header: 'Final Price',
    },
    {
      accessorKey: 'dealStatus',
      header: 'Deal Status',
      cell: ({ row }) => {
        const diff = row.original?.dealStatus?.toLowerCase() === 'rejected';
        if (!row.original?.dealStatus) {
          return (
            <Badge className="bg-transparent text-black rounded-full px-2 w-20 text-md">N/A</Badge>
          );
        } else if (diff) {
          return <Badge className="bg-red-100 text-red-500 rounded-full px-2 w-20">Rejected</Badge>;
        } else {
          return (
            <Badge className="bg-green-100 text-green-500 rounded-full capitalize px-3 w-20">
              {row.original?.dealStatus}
            </Badge>
          );
        }
      },
    },

    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              className="text-sm cursor-pointer text-gray-600 underline"
              variant={'link'}
              onClick={() => {
                navigate('/product-overview?productId=' + row.original?.productId);
              }}
            >
              View
            </Button>
            <Button
              className="text-sm cursor-pointer text-blue-600"
              variant={'link'}
              onClick={() => openSurvey(row.original?._id)}
            >
              Feedback
            </Button>
          </div>
        );
      },
    },
  ];

  const [tab, setTab] = useState('approved_bids');
  const {
    fn: pendingApprovedFn,
    data: pendingApprovedData,
    loading: approvedLoading,
  } = useFetch(requirementService.getRequirementAward);
  const {
    fn: completedApproveFn,
    data: completedApproveData,
    loading: completedLoading,
  } = useFetch(requirementService.getDealAwarded);
  const [completeRequirements, setCompleteRequirements] = useState([]);
  const [approvedRequirements, setApprovedRequirements] = useState([]);
  useEffect(() => {
    if (tab === 'approved_bids') {
      pendingApprovedFn();
    } else {
      completedApproveFn();
    }
  }, [tab]);

  useEffect(() => {
    if (completedApproveData?.data) {
      if (completedApproveData.data.length > 0) {
        const formattedData = completedApproveData.data.map(item => ({
          _id: item._id,
          productId: item?.product?._id,
          avatar: item?.product?.image,
          date: dateFormatter(item?.createdAt),
          finalized_with: mergeName(item?.buyer),
          requirement: item?.product?.title,
          your_budget: item?.product?.minimumBudget,
          final_budget: currencyConvertor(item?.amount),
          dealStatus:
            item?.closedDealStatus === 'waiting_seller_approval' ||
            item?.closedDealStatus === 'pending'
              ? 'Waiting for seller approval'
              : item?.closedDealStatus === 'rejected'
                ? 'Rejected'
                : 'Deal Closed',
        }));
        setCompleteRequirements(formattedData);
      }
    }
    if (pendingApprovedData?.data) {
      if (pendingApprovedData.data.length > 0) {
        const formattedData = pendingApprovedData.data.map(item => ({
          _id: item._id,
          productId: item?.product?._id,
          avatar: item?.product?.image,

          date: dateFormatter(item?.closedAt),
          product: item?.product?.title,
          min_budget: item?.minBudget,
          final_price: currencyConvertor(item?.amount),
          seller: mergeName(item.seller),
          dealStatus:
            item?.closedDealStatus === 'waiting_seller_approval' ||
            item?.closedDealStatus === 'pending'
              ? 'Waiting for seller approval'
              : item?.closedDealStatus === 'rejected'
                ? 'Rejected'
                : 'Deal Closed',
        }));
        setApprovedRequirements(formattedData);
      }
    }
  }, [pendingApprovedData, completedApproveData]);

  return (
    <div className="w-full max-w-7xl mx-auto  space-y-6 ">
      <div className="grid space-y-5 w-full">
        <div className="flex justify-between items-center font-semibold w-full mb-3">
          <p className="font-bold text-xl whitespace-nowrap   tracking-tight text-gray-600">
            Closed Deals
          </p>
        </div>

        {/* tabs */}
        <Tabs
          defaultValue="approved_bids"
          className="grid space-y-2 w-full overflow-hidden"
          onValueChange={val => setTab(val)}
        >
          <TabsList className=" ">
            <TabsTrigger value="approved_bids" className={`cursor-pointer min-w-44 pr-3  `}>
              Requirements Awarded{' '}
            </TabsTrigger>
            <TabsTrigger value="completed_requirements" className={`cursor-pointer `}>
              {' '}
              <span className="hidden sm:inline-block">Deals </span> Awarded
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approved_bids" className="w-full overflow-hidden ">
            {approvedLoading ? (
              <SkeletonTable />
            ) : (
              <TableListing
                data={approvedRequirements}
                columns={columnsApproveBids}
                filters={false}
                colorPalette={'gray'}
              />
            )}
          </TabsContent>

          <TabsContent value="completed_requirements" className="w-full overflow-hidden">
            {completedLoading ? (
              <SkeletonTable />
            ) : (
              <TableListing
                data={completeRequirements}
                columns={columnsCompletedReq}
                filters={false}
                colorPalette={'gray'}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Deal Survey Modal */}
      <DealSurveyModal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        dealId={surveyDealId}
      />
    </div>
  );
};

export default CloseDeal;

