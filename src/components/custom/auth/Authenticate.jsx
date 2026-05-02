import React, { useState } from 'react';
import LoginPopup from './LoginPopup';
import OtpPopup from './OTPPopup';

const Authentication = ({ open, setOpen }) => {
  const [otpPopup, setOtpPopup] = useState(false);
  const [number, setNumber] = useState('');
  const [sessionId, setSessionId] = useState('');

  return (
    <>
      {open && (
        <LoginPopup
          open={open}
          setOpen={setOpen}
          setNumber={setNumber}
          setOtpPopup={setOtpPopup}
          setSessionId={setSessionId}
        />
      )}

      {otpPopup && (
        <OtpPopup
          open={otpPopup}
          setOpen={setOtpPopup}
          number={number}
          sessionId={sessionId}
          setSessionId={setSessionId}
        />
      )}
    </>
  );
};

export default Authentication;
