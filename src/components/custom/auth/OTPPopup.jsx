import React, { useEffect, useRef, useState } from 'react';
import SaralBuyLogo from '/image/Logo/saralBuyLogo.png';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import authService from '@/services/auth.service';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatchUser, useUserState } from '@/redux/hooks/useUser';

/**
 * OTP verification popup — direct call flow, no useFetch wrapping.
 *
 * The old version wrapped verifyOtp in useFetch, then a useEffect fired
 * `dispatchUser()` (unawaited async) IMMEDIATELY followed by
 * `window.location.reload()`. Any error inside dispatchUser surfaced as a
 * mystery toast right before reload masked it — the source of the elusive
 * "next is not a function" message that blocked every user login.
 *
 * Rewritten as a straight try/catch flow: verify -> dispatch profile ->
 * reload. Every failure gets its own honest message. Reload only fires on
 * verified auth.
 */
const OtpPopup = ({ open, setOpen, number, sessionId, setSessionId }) => {
  const [value, setValue] = useState('');
  const [verifying, setVerifying] = useState(false);
  const { dispatchUser } = useDispatchUser();
  const countDown = 60;
  const [sentTimer, setResentTimer] = useState(countDown);
  const getProfile = useUserState();
  const navigate = useNavigate();
  const timer = useRef(null);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async e => {
    e.preventDefault();
    if (verifying) return;

    if (!value || value.length !== 6) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    if (import.meta.env.MODE !== 'development' && !sessionId) {
      toast.error('Session expired. Please request a new OTP.');
      return;
    }

    const effectiveSessionId =
      import.meta.env.MODE === 'development' ? '647e8e8d6b7f4d9b8e8d6b7f4' : sessionId;

    setVerifying(true);
    try {
      // Step 1 — verify the OTP. Backend sets the authToken cookie on success.
      await authService.verifyOtp(number, value, effectiveSessionId);

      // Step 2 — hydrate the user profile into the redux store. If this
      // fails, we still keep the cookie and let the reload retry it —
      // we don't want a redux hiccup to block the login.
      try {
        await dispatchUser();
      } catch (profileErr) {
        console.warn('Profile hydration failed after OTP verify:', profileErr);
      }

      // Step 3 — close popup and reload so every hook picks up fresh auth.
      setOpen(false);
      window.location.reload();
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        'Verification failed. Please try again.';
      toast.error(backendMsg);
      setVerifying(false);
    }
  };

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

  const handleResend = async () => {
    if (resendLoading || sentTimer > 0) return;
    setResendLoading(true);
    try {
      const res = await authService.sendOtp(number);
      if (res?.sessionId) setSessionId?.(res.sessionId);
      toast.success('OTP resent');
      if (timer.current) clearInterval(timer.current);
      setResentTimer(countDown);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Could not resend OTP';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

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
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-pink-500 to-indigo-500" />
          <div className="h-12 flex justify-center mb-4">
            <img src={SaralBuyLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-gray-800 text-2xl font-extrabold tracking-tight">
              OTP Verification
            </DialogTitle>
            <p className="text-sm text-slate-500 font-medium">
              Enter the OTP code sent on your number <span className="text-blue-600 font-bold">{number?.toString().slice(0, 4)}******</span>
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
                  className="bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-xl shadow-sm text-xl font-bold h-14 w-12 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <div className="grid gap-3 w-full">
            <button
              type="button"
              disabled={sentTimer > 0 || resendLoading}
              onClick={handleResend}
              className={`text-sm text-right w-full underline
    ${sentTimer > 0 || resendLoading ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-blue-700'}`}
            >
              {resendLoading ? 'Sending…' : `Resend OTP ${sentTimer > 0 ? `(${sentTimer}s)` : ''}`}
            </button>

            <Button
              type="submit"
              disabled={verifying || value.length !== 6}
              className="w-full rounded-xl py-7 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-[17px] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 mt-2"
            >
              {verifying ? <Spinner className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpPopup;
