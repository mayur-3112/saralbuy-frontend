import React, { useEffect, useRef } from 'react';
import SaralBuyLogo from '/image/Logo/saralBuyLogo.png';
import { useFetch } from '@/hooks/useFetch';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import authService from '@/services/auth.service';
import { DialogTitle } from '@radix-ui/react-dialog';
// import { getUserProfile } from "@/zustand/userProfile";
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatchUser, useUserState } from '@/redux/hooks/useUser';

const OtpPopup = ({ open, setOpen, number, sessionId, setSessionId }) => {
  const { fn, data, loading } = useFetch(authService.verifyOtp);
  const [value, setValue] = React.useState('');
  const { dispatchUser } = useDispatchUser();
  const countDown = 60;
  const [sentTimer, setResentTimer] = React.useState(countDown);
  const getProfile = useUserState();
  const navigate = useNavigate();
  const timer = useRef(null);
  const { fn: sendOtp, data: sendOtpResponse } = useFetch(authService.sendOtp);
  const handleVerify = async e => {
    e.preventDefault();
    if (import.meta.env.MODE === 'development') {
      sessionId = '647e8e8d6b7f4d9b8e8d6b7f4';
    } else {
      if (!sessionId) return toast.error('sessionId is missing');
    }
    await fn(number, value, sessionId);
  };

  useEffect(() => {
    if (data) {
      dispatchUser();
      setOpen(false);
      window.location.reload();
    }
  }, [data]);

  useEffect(() => {
    if (sentTimer === 0) {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      return;
    }

    timer.current = setInterval(() => {
      setResentTimer(prev => prev - 1);
    }, 1000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [sentTimer]);

  async function callTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }
    setResentTimer(countDown);
  }

  useEffect(() => {
    if (sendOtpResponse) {
      toast.success('OTP Resent successfully');
      setSessionId?.(sendOtpResponse?.sessionId);
    }
  }, [sendOtpResponse]);

  useEffect(() => {
    if (getProfile.user) {
      const { firstName, lastName, email } = getProfile.user;
      if (!firstName && !lastName && !email) {
        navigate('/account');
      }
    }
  }, [getProfile.user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full rounded-[24px] overflow-hidden border-slate-100 shadow-2xl p-0">
        <div className="p-8 w-full inline-block space-y-6 bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500" />
          <div className="h-12 flex justify-center mb-4">
            <img src={SaralBuyLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-gray-800 text-2xl font-extrabold tracking-tight">
              OTP Verification
            </DialogTitle>
            <p className="text-sm text-slate-500 font-medium">
              Enter the OTP code sent on your number <span className="text-orange-600 font-bold">{number?.toString().slice(0, 4)}******</span>
            </p>
          {import.meta.env.MODE === 'development' && (
            <p className="text-xs text-amber-700 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
              [DEV MODE] Check the toast notification or terminal console for the OTP code.
            </p>
          )}
        </div>

        <form
          onSubmit={handleVerify}
          className="flex justify-center items-center flex-col space-y-5"
        >
          <InputOTP maxLength={6} value={value} onChange={value => setValue(value)}>
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 rounded-xl shadow-sm text-xl font-bold h-14 w-12 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <div className="grid gap-3 w-full">
            <button
              type="button"
              disabled={sentTimer > 0}
              onClick={() => {
                callTimer();
                sendOtp(number);
              }}
              className={`text-sm text-right w-full underline 
    ${sentTimer > 0 ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-orange-700'}`}
            >
              Resend OTP {sentTimer > 0 ? `(${sentTimer}s)` : ''}
            </button>

            <Button
              type="submit"
              disabled={loading || value.length !== 6}
              className="w-full rounded-xl py-7 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-[17px] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 mt-2"
            >
              {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpPopup;
