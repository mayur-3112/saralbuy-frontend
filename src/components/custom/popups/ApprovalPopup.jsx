import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';

const ApprovalPopup = ({ open, setOpen, dealId, budget, partnerName, onAction, loading }) => {
  const [agreed, setAgreed] = React.useState(false);

  const handleAction = action => {
    if (action === 'accept' && !agreed) {
      return;
    }
    if (onAction) {
      onAction(dealId, action);
    }
    setAgreed(false);
  };

  React.useEffect(() => {
    if (!open) setAgreed(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:w-4xs">
        <div className="p-3 max-w-md inline-block space-y-5">
          <div className="space-y-2 grid">
            <DialogTitle className="text-gray-800 text-3xl font-extrabold text-center">
              Approved Deal
            </DialogTitle>
            <DialogDescription className="text-md text-gray-600 text-center">
              <span className="font-semibold">{partnerName}</span> has requested to close the deal
              at <span className="font-bold text-orange-600">₹{budget}</span>.
            </DialogDescription>
            <DialogDescription className="text-sm text-gray-500 text-center">
              Do you want to complete this deal or reject the request?
            </DialogDescription>
            <div className="flex items-start gap-2.5 pt-3 text-left">
              <input
                type="checkbox"
                id="approval-popup-agreed"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer shrink-0"
              />
              <label htmlFor="approval-popup-agreed" className="text-xs text-slate-500 cursor-pointer leading-normal">
                I agree that Quotex holds Zero Liability if the materials are rejected upon delivery, or if payment disputes arise.
              </label>
            </div>
          </div>
          <div className="space-y-5 w-full">
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded font-semibold disabled:opacity-50"
                onClick={() => handleAction('reject')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Reject Deal'}
              </Button>
              <Button
                className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                onClick={() => handleAction('accept')}
                disabled={loading || !agreed}
              >
                {loading ? 'Processing...' : 'Complete Deal'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalPopup;
