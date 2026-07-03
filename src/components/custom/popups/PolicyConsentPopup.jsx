import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Check } from 'lucide-react';

export default function PolicyConsentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted policies
    const isAccepted = localStorage.getItem('SaralBuy_policy_accepted');
    if (!isAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('SaralBuy_policy_accepted', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-xl select-none z-[9999]"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <DialogTitle className="text-xl font-black text-slate-900 text-center">
            Accept Platform Terms & Policies
          </DialogTitle>

          <DialogDescription className="text-xs text-slate-500 text-center leading-relaxed">
            Welcome to SaralBuy! By continuing to use this B2B exchange, you acknowledge and agree that SaralBuy is solely a reverse-bidding procurement platform.
          </DialogDescription>

          {/* Core Zero Liability Disclaimer */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-left">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              ⚠️ Zero Platform Liability Policy
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              We hold no responsibility or liability for defaults on payment, delivery delays, quality disputes, or if a buyer rejects material upon delivery. All contracts are directly between the buyer and the supplier.
            </p>
          </div>

          {/* Links */}
          <div className="text-[11px] text-slate-400 text-center">
            Read the full{' '}
            <a 
              href="/terms" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline text-blue-600 hover:text-blue-700 font-bold"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a 
              href="/privacy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline text-blue-600 hover:text-blue-700 font-bold"
            >
              Privacy Policy
            </a>.
          </div>

          <Button
            onClick={handleAccept}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-blue-600/10"
          >
            <Check className="w-4 h-4" />
            I Accept and Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
