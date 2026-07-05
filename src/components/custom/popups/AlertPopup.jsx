import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CircleAlert } from 'lucide-react';

const AlertPopup = ({ open, setOpen, message, deleteFunction, loading }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-3">
            <div className="bg-orange-100 rounded-full p-1">
              <CircleAlert className="text-yellow-500"></CircleAlert>
            </div>
            {message.title}
          </AlertDialogTitle>
          <AlertDialogDescription>{message.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={deleteFunction}
            className="cursor-pointer bc  border-primary-btn border-2 "
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertPopup;
