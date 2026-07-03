import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { BadgeCheck, Clock, XCircle, ShieldCheck, Upload, FileText, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import userService from '@/services/user.service';
import { useFetch } from '@/hooks/useFetch';

/**
 * Business Verification section for the supplier's Account Settings page.
 *
 * Design principles:
 *   1. GSTIN alone is enough to submit — docs are optional, PAN is optional.
 *      Suppliers with just a GSTIN can start immediately.
 *   2. Status is the top of the section — a supplier should know instantly
 *      whether they're verified, pending, or need to try again.
 *   3. Verified users can't re-submit — the badge is stable, we don't want
 *      them accidentally putting themselves back in the queue.
 *   4. Rejection notes are shown prominently so they know what to fix.
 */

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function StatusBanner({ status, notes, submittedAt, decidedAt }) {
  if (status === 'verified') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
        <BadgeCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        <div>
          <p className="font-black text-emerald-800 text-sm">You're a Verified Supplier</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Buyers see a green "Verified" badge next to your quotes. This builds trust and helps you win more deals.
          </p>
        </div>
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
        <Clock className="w-6 h-6 text-amber-600 shrink-0" />
        <div>
          <p className="font-black text-amber-800 text-sm">Under review</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Our team is reviewing your submission. Most decisions are made within one business day.
          </p>
        </div>
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <p className="font-black text-rose-800 text-sm">Verification was declined</p>
            {notes && <p className="text-xs text-rose-700 mt-0.5">Reason: {notes}</p>}
            <p className="text-xs text-rose-600 mt-1">You can submit again with corrected details below.</p>
          </div>
        </div>
      </div>
    );
  }
  // unverified / never submitted — no banner, just the form
  return null;
}

export default function BusinessVerification() {
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstinDoc, setGstinDoc] = useState(null);
  const [panDoc, setPanDoc] = useState(null);
  const gstinDocRef = useRef(null);
  const panDocRef = useRef(null);

  const { fn: fetchStatusFn, data: statusData, loading: statusLoading } = useFetch(
    userService.getVerificationStatus
  );
  const { fn: submitFn, loading: submitting } = useFetch(userService.submitVerification);

  useEffect(() => {
    fetchStatusFn();
  }, []);

  useEffect(() => {
    if (statusData) {
      // pre-fill on re-submission after rejection
      if (statusData.gstin) setGstin(statusData.gstin);
      if (statusData.pan) setPan(statusData.pan);
      if (statusData.businessName) setBusinessName(statusData.businessName);
    }
  }, [statusData]);

  const status = statusData?.verificationStatus || 'unverified';
  const isLocked = status === 'verified' || status === 'pending';

  const handleFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Document must be under 5MB');
      return;
    }
    setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gstinTrim = gstin.trim().toUpperCase();
    const panTrim = pan.trim().toUpperCase();

    if (!gstinTrim && !panTrim) {
      toast.error('Enter your GSTIN or PAN to submit for verification');
      return;
    }
    if (gstinTrim && !GSTIN_REGEX.test(gstinTrim)) {
      toast.error('GSTIN format looks wrong. Example: 29ABCDE1234F1Z5');
      return;
    }
    if (panTrim && !PAN_REGEX.test(panTrim)) {
      toast.error('PAN format looks wrong. Example: ABCDE1234F');
      return;
    }

    const fd = new FormData();
    if (gstinTrim) fd.append('gstin', gstinTrim);
    if (panTrim) fd.append('pan', panTrim);
    if (businessName.trim()) fd.append('businessName', businessName.trim());
    if (gstinDoc) fd.append('gstinDocument', gstinDoc);
    if (panDoc) fd.append('panDocument', panDoc);

    const result = await submitFn(fd);
    if (result) {
      toast.success('Submitted — our team will review within one business day');
      fetchStatusFn();
      setGstinDoc(null);
      setPanDoc(null);
      if (gstinDocRef.current) gstinDocRef.current.value = '';
      if (panDocRef.current) panDocRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 md:p-8 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">Business Verification</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Verified suppliers get a green trust badge next to their quotes — buyers strongly prefer them.
          </p>
        </div>
      </div>

      {statusLoading && !statusData ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading verification status…
        </div>
      ) : (
        <>
          <StatusBanner
            status={status}
            notes={statusData?.verificationNotes}
            submittedAt={statusData?.verificationSubmittedAt}
            decidedAt={statusData?.verificationDecidedAt}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="v-gstin" className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                  GSTIN
                </Label>
                <Input
                  id="v-gstin"
                  placeholder="29ABCDE1234F1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  disabled={isLocked}
                  maxLength={15}
                  className="mt-1 font-mono uppercase"
                />
                <p className="text-[11px] text-slate-500 mt-1">15 characters. GSTIN alone is enough to submit.</p>
              </div>
              <div>
                <Label htmlFor="v-pan" className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                  PAN <span className="text-slate-400 font-medium normal-case">(optional)</span>
                </Label>
                <Input
                  id="v-pan"
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  disabled={isLocked}
                  maxLength={10}
                  className="mt-1 font-mono uppercase"
                />
                <p className="text-[11px] text-slate-500 mt-1">10 characters. Optional if you have a GSTIN.</p>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="v-business" className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                  Registered Business Name <span className="text-slate-400 font-medium normal-case">(optional)</span>
                </Label>
                <Input
                  id="v-business"
                  placeholder="As it appears on your GST certificate"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={isLocked}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocSlot
                label="GST Certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                file={gstinDoc}
                onFile={(e) => handleFile(e, setGstinDoc)}
                onClear={() => { setGstinDoc(null); if (gstinDocRef.current) gstinDocRef.current.value = ''; }}
                inputRef={gstinDocRef}
                disabled={isLocked}
              />
              <DocSlot
                label="PAN Card"
                accept=".pdf,.jpg,.jpeg,.png"
                file={panDoc}
                onFile={(e) => handleFile(e, setPanDoc)}
                onClear={() => { setPanDoc(null); if (panDocRef.current) panDocRef.current.value = ''; }}
                inputRef={panDocRef}
                disabled={isLocked}
              />
            </div>

            {!isLocked && (
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</>
                ) : (
                  status === 'rejected' ? 'Re-submit for Verification' : 'Submit for Verification'
                )}
              </Button>
            )}
          </form>
        </>
      )}
    </Card>
  );
}

function DocSlot({ label, accept, file, onFile, onClear, inputRef, disabled }) {
  return (
    <div>
      <Label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
        {label} <span className="text-slate-400 font-medium normal-case">(optional)</span>
      </Label>
      {file ? (
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-800 truncate flex-1">{file.name}</span>
          {!disabled && (
            <button type="button" onClick={onClear} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <label
          className={`mt-1 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300 hover:bg-blue-50/40'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload PDF / image (max 5MB)
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            onChange={onFile}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
