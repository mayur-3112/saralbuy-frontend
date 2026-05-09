import React, { useEffect, useState } from 'react';
import saralBuyLogo from '/image/Logo/saralBuyLogo.png';

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

  const [error, setError] = useState('');
  const { fn, data } = useFetch(authService.sendOtp);
  let loading = false;
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
      toast.success('OTP sent successfully');
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
              <img src={saralBuyLogo} alt="Logo" className="w-full h-full object-contain" />
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
              <Button
                type="submit"
                disabled={loading || mobileNumber.length < 10}
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
