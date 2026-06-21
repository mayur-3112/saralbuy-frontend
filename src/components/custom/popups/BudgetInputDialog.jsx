import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const BudgetInputDialog = ({ open, setOpen, onConfirm, loading }) => {
  const [amount, setAmount] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the Deal Closure Policy');
      return;
    }
    onConfirm(numAmount);
    setAmount('');
    setAgreed(false);
  };

  const handleCancel = () => {
    setAmount('');
    setAgreed(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-3">
            <div className="bg-orange-100 rounded-full p-1">
              <CircleAlert className="text-yellow-500" />
            </div>
            Close Deal
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter the agreed budget amount to close the deal
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-4">
          <Input
            type="number"
            placeholder="Enter budget amount"
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
            }}
            min="0"
            step="0.01"
          />
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="budget-dialog-agreed"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer shrink-0"
            />
            <label htmlFor="budget-dialog-agreed" className="text-xs text-slate-500 cursor-pointer leading-normal">
              I agree to the Quotex Deal Closure Policy (the platform holds Zero Liability for any material disputes, quality issues, or payment/delivery defaults).
            </label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading || !agreed}
            onClick={handleConfirm}
            className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? 'Closing...' : 'Confirm & Close Deal'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BudgetInputDialog;
