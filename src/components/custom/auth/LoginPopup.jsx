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
        <DialogContent>
          <form onSubmit={handleSendOTP} className=" p-3 max-w-md inline-block space-y-5 ">
            <div className="h-16 flex justify-center">
              <img src={QuotexLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
              <DialogTitle className=" text-gray-800 text-3xl font-extrabold ">
                Login here
              </DialogTitle>
              <DialogTitle className=" text-sm text-gray-600">
                {' '}
                Enter your Phone Number to Sign In / Sign Up Your Account
              </DialogTitle>
            </div>
            <div className="space-y-5 w-full">
              <Input
                className="w-full py-5"
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
                  I accept the <a href="/terms" className="text-orange-600 underline">Terms</a> & <a href="/privacy" className="text-orange-600 underline">Privacy Policy</a>. I acknowledge that Quotex is a connection platform and is not liable for transactions, material quality, or GST compliance between buyers and suppliers.
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading || mobileNumber.length < 10 || !accepted}
                className="w-full rounded-sm py-5  text-white font-bold cursor-pointer "
              >
                {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Send OTP'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginPopup;
