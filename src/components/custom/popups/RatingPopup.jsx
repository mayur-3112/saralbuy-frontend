import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Rating } from 'react-simple-star-rating';

const RatingPopup = ({ open, setOpen, chatId, onSubmit, loading }) => {
  const [selectedRating, setSelectedRating] = React.useState(0);

  React.useEffect(() => {
    console.log('RatingPopup: chatId prop:', chatId);
  }, [chatId]);

  const ratingChanged = newRating => {
    setSelectedRating(newRating);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Submit clicked, selectedRating:', selectedRating, 'chatId:', chatId);
    if (selectedRating !== null && onSubmit) {
      onSubmit(chatId, selectedRating);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-4xs">
        <form className="p-3 max-w-md inline-block space-y-5 " onSubmit={handleSubmit}>
          <div className="space-y-2 grid">
            <DialogTitle className="text-gray-800 text-3xl font-extrabold text-center">
              Rating
            </DialogTitle>
            <DialogTitle className="text-2xl text-gray-700 text-center">{`How many stars would you give the user?`}</DialogTitle>
            <DialogDescription className="text-md text-gray-600 text-center">
              Please rate your experience with this user. Your feedback helps us maintain a safe and
              trustworthy community for everyone.
            </DialogDescription>
          </div>
          <div className="space-y-5 w-full">
            <div className="flex justify-center items-center">
              <Rating
                onClick={ratingChanged}
                initialValue={selectedRating}
                size={40}
                allowFraction={false}
                SVGclassName="inline-block"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
                disabled={loading || selectedRating === 0}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingPopup;
