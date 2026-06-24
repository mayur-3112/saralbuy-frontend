import React, { useEffect, useState } from 'react';
import QuotexLogo from '/image/Logo/saralBuyLogo.png';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useFetch } from '@/hooks/useFetch';
import authService from '@/services/auth.service';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { isValidNumber } from '@/utils/validsFuntions';
import { Input } from '@/components/ui/input';

const LoginPopup = ({ open, setOpen, setNumber, setOtpPopup, setSessionId }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [accepted, setAccepted] = useState(false);

  const [error, setError] = useState('');
  const { fn, data, loading } = useFetch(authService.sendOtp);
  const handleNumberChange = event => {
    const value = event.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
      setError('');
    }
  };

  const [role, setRole] = useState('buyer');

  const handleSendOTP = async e => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      toast.error('Enter a valid 10 digit mobile number');
      return;
    }
    if (!isValidNumber(mobileNumber)) {
      toast.error('Invalid Number');
      return;
    }
    await fn(mobileNumber);
  };
  useEffect(() => {
    if (data) {
      if (typeof data === 'string') {
        toast.success(`OTP (Dev Mode): ${data}`, { duration: 10000 });
      } else {
        toast.success('OTP sent successfully');
      }
      setNumber?.(mobileNumber);
      setOpen(false);
      setOtpPopup?.(true);
      setSessionId?.(data?.sessionId);
    }
  }, [data]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleSendOTP} className="p-3 w-full inline-block space-y-6">
            <div className="h-12 flex justify-center mb-2">
              <img src={QuotexLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>

            {/* Role Segregation Tabs */}
            <div className="flex bg-slate-100 rounded-lg p-1 w-full relative">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex-1 py-2 text-sm font-semibold transition-all duration-200 z-10 rounded-md ${role === 'buyer' ? 'text-orange-600 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                I am a Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('supplier')}
                className={`flex-1 py-2 text-sm font-semibold transition-all duration-200 z-10 rounded-md ${role === 'supplier' ? 'text-orange-600 bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                I am a Supplier
              </button>
            </div>

            <div className="space-y-2 text-center">
              <DialogTitle className="text-gray-800 text-2xl font-extrabold">
                {role === 'buyer' ? 'Post & Compare Quotes' : 'Find Verified Leads'}
              </DialogTitle>
              <DialogTitle className="text-sm text-gray-500 font-medium">
                {role === 'buyer' 
                  ? 'Sign in to post requirements and compare competitive quotes instantly.'
                  : 'Sign in to access verified leads and submit competitive quotes.'}
              </DialogTitle>
            </div>

            <div className="space-y-5 w-full">
              <Input
                className="w-full py-6 bg-slate-50/50"
                type="text"
                placeholder="Enter your Mobile Number"
                value={mobileNumber}
                onChange={handleNumberChange}
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <input 
                  type="checkbox" 
                  id="terms-checkbox" 
                  className="mt-0.5 shrink-0" 
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <label htmlFor="terms-checkbox" className="leading-tight">
                  I accept the <a href="/terms" className="text-orange-600 underline hover:text-orange-700">Terms</a> & <a href="/privacy" className="text-orange-600 underline hover:text-orange-700">Privacy Policy</a>. 
                  {role === 'supplier' 
                    ? ' I acknowledge that Quotex is a connection platform and is not liable for transactions, material quality, or GST compliance.' 
                    : ' I acknowledge Quotex does not guarantee supplier fulfillment or material quality.'}
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || mobileNumber.length < 10 || !accepted}
                  className="w-full rounded-md py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer transition-colors"
                >
                  {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                </Button>
                
                {/* E2E Trust Signal */}
                <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-slate-400 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  End-to-End Encrypted Messaging
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginPopup;
