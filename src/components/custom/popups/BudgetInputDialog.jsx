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

const PAYMENT_TERMS = [
  { value: '', label: 'Payment terms (optional)' },
  { value: 'advance', label: 'Advance' },
  { value: 'partial_advance', label: 'Partial Advance' },
  { value: 'on_delivery', label: 'On Delivery' },
  { value: 'credit', label: 'Credit (X days)' },
];
const FREIGHT_TERMS = [
  { value: '', label: 'Freight terms (optional)' },
  { value: 'ex_works', label: 'Ex-Works' },
  { value: 'fob', label: 'FOB' },
  { value: 'delivered', label: 'Delivered (DAP / DDP)' },
];

const BudgetInputDialog = ({ open, setOpen, onConfirm, loading }) => {
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [freightTerms, setFreightTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);

  const reset = () => {
    setAmount('');
    setQuantity('');
    setDeliveryDate('');
    setPaymentTerms('');
    setFreightTerms('');
    setNotes('');
    setAgreed(false);
  };

  const handleConfirm = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid final price');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the Deal Closure Policy');
      return;
    }
    const agreedTerms = {
      finalPrice: numAmount,
      quantity: quantity ? Number(quantity) : undefined,
      deliveryDate: deliveryDate || undefined,
      paymentTerms,
      freightTerms,
      notes: notes.trim(),
    };
    onConfirm(numAmount, agreedTerms);
    reset();
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const selectCls =
    'w-full h-9 rounded-md border border-slate-200 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30';

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-3 items-center">
            <div className="bg-orange-100 rounded-full p-1">
              <CircleAlert className="text-yellow-500" />
            </div>
            Close Deal — Confirm Agreed Terms
          </AlertDialogTitle>
          <AlertDialogDescription>
            These terms are logged and shared with the other party for approval before the deal is finalised.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Final Price (₹)*</label>
            <Input
              type="number"
              placeholder="Agreed final price"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Quantity</label>
              <Input
                type="number"
                placeholder="Qty"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Delivery Date</label>
              <Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Payment Terms</label>
              <select className={selectCls} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
                {PAYMENT_TERMS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Freight Terms</label>
              <select className={selectCls} value={freightTerms} onChange={e => setFreightTerms(e.target.value)}>
                {FREIGHT_TERMS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any other agreed conditions..."
              rows={2}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="budget-dialog-agreed"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer shrink-0"
            />
            <label htmlFor="budget-dialog-agreed" className="text-xs text-slate-500 cursor-pointer leading-normal">
              I agree to the SaralBuy Deal Closure Policy (the platform holds Zero Liability for any material disputes, quality issues, or payment/delivery defaults).
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
