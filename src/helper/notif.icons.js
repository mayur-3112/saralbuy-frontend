import { Bell, CheckCircle, FileText, Gavel, Star, XCircle } from 'lucide-react';

export function getNotifMeta(type) {
  switch (type) {
    case 'new_bid':
      return { Icon: Gavel, colorClass: 'bg-blue-500' };
    case 'bid':
      return { Icon: Gavel, colorClass: 'bg-blue-500' };
    case 'chat_rating':
      return { Icon: Star, colorClass: 'bg-yellow-500' };
    case 'deal_accepted':
      return { Icon: CheckCircle, colorClass: 'bg-green-500' };
    case 'deal_rejected':
      return { Icon: XCircle, colorClass: 'bg-red-500' };
    case 'deal_request':
      return { Icon: FileText, colorClass: 'bg-blue-500' };
    default:
      return { Icon: Bell, colorClass: 'bg-gray-500' };
  }
}
