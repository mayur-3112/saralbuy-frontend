import React from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const PlaceRequirementPopup = ({
  open,
  setOpen,
  createProductFn,
  bidDuration,
  setBidDuration,
  loading,
  buttonType,
}) => {
  async function handleSubmit(e) {
    e.preventDefault();
    const value = Number(e.currentTarget?.bidDuration.value);
    if (!value || value <= 0) {
      toast.error('Quote duration must be greater than 0');
      return;
    }

    setBidDuration(value);
    setOpen(false);
    await createProductFn(false, value);
  }

  function handleChange(e) {
    const value = e.currentTarget.value.replace(/\D/g, '');
    if (value > 30) {
      toast.warning('Quote duration must be less than or equal to 30');
      return;
    }
    setBidDuration(Number(value));
  }
  function handleKeyDown(e) {
    if (e.key.toLowerCase() === '.') {
      e.preventDefault();
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 470px */}
      <DialogContent className="sm:w-4xs">
        <DialogHeader>
          <DialogTitle className="text-black text-3xl font-extrabold">
            Place Requirement
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            How Long Should Your Requirement Remain Active?{' '}
            <small className="italic">(in Days)</small>
          </DialogDescription>
        </DialogHeader>
        <form className="py-2 max-w-md inline-block mb-0" onSubmit={e => handleSubmit(e)}>
          <div className="space-y-4 w-full">
            <Input
              type="number"
              name="bidDuration"
              placeholder="Ex. 15"
              onKeyDown={handleKeyDown}
              value={bidDuration || undefined}
              className="w-full py-5 rounded-md border border-gray-300"
              onChange={handleChange}
            />
            <Button
              disabled={(bidDuration && bidDuration <= 0) || loading}
              type="submit"
              className="w-full rounded-sm py-5  text-white font-bold cursor-pointer"
            >
              {loading && !buttonType ? (
                <Spinner className="w-5 h-5 animate-spin" />
              ) : (
                'Place Requirement '
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceRequirementPopup;
