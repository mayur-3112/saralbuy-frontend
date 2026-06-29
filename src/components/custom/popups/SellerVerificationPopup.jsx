import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { useUserState } from '@/redux/hooks/useUser';

const SellerVerificationPopup = ({
  open,
  setOpen,
  setValue,
  value,
  handleCreteBid,
  createBidLoading,
  setBusinessDets,
  businessDets,
  isGstRequired,
}) => {
  const { user } = useUserState();

  React.useEffect(() => {
    if (isGstRequired && open) {
      setValue?.('business');
    }
  }, [isGstRequired, open, setValue]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:w-4xs">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCreteBid();
            }}
            className="p-2 max-w-md inline-block space-y-5 "
          >
            <div className="space-y-2">
              <DialogHeader className=" text-black text-3xl font-extrabold ">
                Seller Verification
              </DialogHeader>
              <DialogTitle className=" text-sm text-gray-600">
                {isGstRequired ? (
                  <span className="text-orange-600 font-semibold flex items-center gap-1">
                    ⚠️ This RFQ requires a GST invoice. You must quote as a Business.
                  </span>
                ) : (
                  'Placing Quote as an Individual or Business Owner?'
                )}
              </DialogTitle>
            </div>
            <div className="space-y-3">
              <Select onValueChange={value => setValue?.(value)} value={value} disabled={isGstRequired}>
                <SelectTrigger
                  id="userType"
                  className="w-full py-5 rounded-md border border-gray-300"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual" disabled={isGstRequired} className="dropdown-hover py-2">
                    Individual {isGstRequired && '(Disabled - GST Required)'}
                  </SelectItem>
                  <SelectItem value="business" className="dropdown-hover py-2">
                    Business Owner
                  </SelectItem>
                </SelectContent>
              </Select>
              {value === 'business' && (
                <div className="grid space-y-2 mt-4">
                  <Input
                    value={businessDets.company_name}
                    onChange={e => {
                      setBusinessDets({ ...businessDets, company_name: e.target.value });
                    }}
                    className="w-full py-5 rounded-md border border-gray-300"
                    name="company_name"
                    placeholder="Company Name"
                  />
                  <Input
                    value={businessDets.gst_num}
                    onChange={e => {
                      setBusinessDets({ ...businessDets, gst_num: e.target.value });
                    }}
                    className="w-full py-5 rounded-md border border-gray-300 uppercase"
                    name="gst_num"
                    placeholder="GSTIN Number"
                  />
                </div>
              )}

              <Button
                disabled={!value || createBidLoading}
                type="submit"
                className="w-full rounded-sm py-5  text-white font-bold cursor-pointer bg-orange-600 hover:bg-orange-700"
              >
                {createBidLoading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Place Quote'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerVerificationPopup;
