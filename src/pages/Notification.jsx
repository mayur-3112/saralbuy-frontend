// Notification.tsx - Complete with infinite scroll (FIXED)
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ListFilter, Trash2, Handshake } from 'lucide-react';
import AlertPopup from '@/components/custom/popups/AlertPopup';
import InfiniteScroll from 'react-infinite-scroll-component';
import notificationService from '@/services/notification.service';
import { getNotifMeta } from '@/helper/notif.icons';
import { toast } from 'sonner';
import { NotificationSkeleton } from '@/const/CustomSkeletons';

const PAGE_SIZE = 10;

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const fetchNotifications = useCallback(
    async (pageNum = 1, reset = false, currentSortOrder = sortOrder) => {
      try {
        if (reset) setLoading(true);

        const response = await notificationService.getNotifications(
          pageNum,
          PAGE_SIZE,
          currentSortOrder
        );

        const newNotifications = response.notifications || [];
        const total = response.total ?? 0;
        const serverHasMore = response.hasMore ?? false;

        setTotalCount(total);

        if (reset) {
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }
        setHasMore(serverHasMore);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNotifications(1, true, sortOrder);
  }, [sortOrder]);

  // FIX 3: Pass sortOrder explicitly to avoid stale closure
  const loadMore = () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, false, sortOrder);
  };

  const handleSorting = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
    // useEffect will trigger re-fetch automatically
  };

  const handleDeleteClick = notificationId => {
    setNotificationToDelete(notificationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;

    setDeleteLoading(true);
    try {
      await notificationService.deleteNotification(notificationToDelete);
      setNotifications(prev => prev.filter(n => n._id !== notificationToDelete));
      setTotalCount(prev => prev - 1);
      toast.success('Notification deleted successfully');
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error(err.message || 'Failed to delete notification');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleView = notification => {
    console.log('View notification:', notification);
  };

  const getNotificationIcon = (type, title) => {
    const { Icon, colorClass } = getNotifMeta(type);

    if (title === 'Deal Closed') {
      return <Handshake className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
    }

    return <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />;
  };

  const getNotificationBgClass = (index, type) => {
    if (type === 'deal_accepted') return 'bg-green-100/40';
    if (type === 'deal_rejected') return 'bg-red-100/40';
    if (type === 'deal_request') return 'bg-blue-100/50';
    return index % 2 === 0 ? 'bg-orange-100/50' : 'bg-transparent';
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getDescriptionText = notification => {
    const { type, description, metadata, productId } = notification;

    if (description) return description;

    const productTitle = productId?.title || 'Product';

    switch (type) {
      case 'new_bid':
        return `New quote received on "${productTitle}"`;
      case 'deal_request':
        return `Deal request of ₹${metadata?.amount || 0} received`;
      case 'deal_accepted':
        return `Your deal of ₹${metadata?.amount || 0} has been accepted`;
      case 'deal_rejected':
        return `Your deal of ₹${metadata?.amount || 0} has been rejected`;
      case 'chat_rating':
        return `You received a ${metadata?.rating || 0} star rating`;
      default:
        return 'New notification';
    }
  };

  const message = {
    title: 'Warning',
    message: 'This action cannot be undone. This will permanently delete your notification.',
  };

  return (
    <div className="grid space-y-5">
      {loading && notifications.length === 0 && <NotificationSkeleton />}

      {error && notifications.length === 0 && (
        <div className="w-full h-[300px]  flex flex-col items-center justify-center">
          <img src="/empty-cart.webp" width="10%" />
          <p className="text-gray-500 text-sm">No Notification's Found</p>
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="w-full h-[300px]  flex flex-col items-center justify-center">
          <img src="/empty-cart.webp" width="10%" />
          <p className="text-gray-500 text-sm">No Notification's Found</p>
        </div>
      )}

      {notifications.length > 0 && (
        <>
          <div className={`flex justify-between items-center mb-3`}>
            <p className="font-bold text-xl whitespace-nowrap tracking-tight text-gray-600">
              Notifications {totalCount > 0 && `(${totalCount})`}
            </p>
            <Button
              onClick={handleSorting}
              variant={'ghost'}
              size={'icon'}
              className="w-24 flex gap-2 items-center justify-center text-sm font-medium text-gray-700 bg-transparent border-1 hover:bg-transparent cursor-pointer border-gray-700"
            >
              Date
              {/* {sortOrder === 'desc' ? '▼' : '▲'} */}
              <ListFilter className="w-5 h-5" />
            </Button>
          </div>
          <div id="notification-scroll-container" style={{ height: '70vh', overflowY: 'auto' }}>
            <InfiniteScroll
              dataLength={notifications.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<div className="text-center text-gray-500 py-4">Loading more...</div>}
              endMessage={
                <div className="text-center text-gray-400 py-4">No more notifications</div>
              }
              scrollableTarget="notification-scroll-container"
            >
              <div className="space-y-0">
                {notifications.map((notif, idx) => {
                  const { type, title, _id, createdAt, seen } = notif;
                  const bgClass = getNotificationBgClass(idx, type);
                  const Icon = getNotificationIcon(type, title);

                  return (
                    <div key={_id} className={``}>
                      <div
                        className={`p-4 grid ${bgClass} rounded-md space-y-2 border  relative group transition-all duration-200 `}
                      >
                        {/* <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => handleDeleteClick(_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}

                        <div className="grid grid-cols-3 items-center gap-5">
                          <div className="text-md font-bold text-gray-800 capitalize col-span-2 flex items-center gap-2">
                            {Icon}
                            <span className="break-words flex gap-2">
                              {title}{' '}
                              <div
                                className={`${!seen ? 'w-2 h-2 rounded-full bg-orange-400' : ''}`}
                              ></div>
                            </span>
                          </div>
                          <p className="text-sm text-orange-500 col-span-1 text-right">
                            {formatDate(createdAt)}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-5">
                          <p className="text-sm font-medium text-gray-600 line-clamp-2 col-span-2">
                            {getDescriptionText(notif)}
                          </p>
                          {/* <Button
                          variant="link"
                          className="text-sm text-gray-600 col-span-1 text-right underline cursor-pointer p-0 h-auto hover:text-gray-900"
                          onClick={() => handleView(notif)}
                        >
                          View
                        </Button> */}
                        </div>
                      </div>
                      <div className=" pt-2 mx-[0.5px]"></div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        </>
      )}

      <AlertPopup
        loading={deleteLoading}
        setOpen={setDeleteDialogOpen}
        open={deleteDialogOpen}
        message={message}
        deleteFunction={handleDeleteConfirm}
      />
    </div>
  );
};

export default Notification;
