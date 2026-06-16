import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Box,
  CircleUserRound,
  Gavel,
  Handshake,
  MapPin,
  Menu,
  MessageCircle,
  MessageCircleMore,
  MessageSquareText,
  Package,
  SearchIcon,
  ShoppingCart,
  Star,
  UserRound,
  FileText,
  CheckCircle,
  XCircle,
  CuboidIcon,
  NotebookPen,
} from 'lucide-react';

import { Accordion, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Button } from '../../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet';
import { Skeleton } from '../../../components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { format } from 'date-fns';
import saralBuyLogo from '/image/Logo/navbarLogo.png';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { fallBackName } from '@/utils/fallBackName';
import { mergeName } from '@/utils/mergerName';
import productService from '@/services/product.service';
import { useFetch } from '@/hooks/useFetch';
import { useDebounce } from 'use-debounce';
import { useDispatchUser, useUserState } from '@/redux/hooks/useUser';
import { useCategory, useCategoryState } from '@/redux/hooks/useCategory';
import { getLocation } from '@/utils/locationAPI';
import { SOCKET_EVENTS } from '@/socket/socketEvents';
import socket from '@/socket/socket';
import { useChatState, useDispatchChat } from '@/redux/hooks/useChat';
import userService from '@/services/user.service';
import requirementService from '@/services/requirement.service';
import { getNotifMeta } from '@/helper/notif.icons';
import { toast } from 'sonner';

const menu = [
  {
    title: 'Settings',
    url: '/account',
    icon: <CircleUserRound className="w-5 h-5" />,
  },
  {
    title: 'Cart',
    url: '/account/cart',
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    title: 'Messages',
    url: '/chat',
    icon: <MessageCircleMore className="w-5 h-5" />,
  },
  {
    title: 'Quotes Submitted',
    url: '/account/bid',
    icon: <CuboidIcon className="w-5 h-5" />,
  },
  {
    title: 'Requirements (Posted / Draft)',
    url: '/account/requirements',
    icon: <NotebookPen className="w-5 h-5" />,
  },
  {
    title: 'Closed Deal',
    url: '/account/deal',
    icon: <Handshake className="w-5 h-5" />,
  },
  {
    title: 'Notifications',
    url: '/account/notification',
    icon: <Bell className="w-5 h-5" />,
  },
];

const renderMobileMenuItem = (item, setOpenSheet, navigate) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b border-gray-100">
        <AccordionTrigger className="py-3 text-sm sm:text-base font-medium hover:no-underline">
          {item.title}
        </AccordionTrigger>
      </AccordionItem>
    );
  }

  const handleNavigate = url => {
    navigate(url);
    setOpenSheet(false);
  };

  return (
    <button
      key={item.title}
      onClick={() => handleNavigate(item.url)}
      className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
    >
      <span className="shrink-0">{item.icon}</span>
      <span>{item.title}</span>
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const HomeNavbar = () => {
  const { user } = useUserState();
  const { updateUserState } = useDispatchUser(); // update state
  const { recentChats } = useChatState();
  const { updateSetRecentChats, updateLastMessage, updateUserStatus } = useDispatchChat();
  const [notifications, setNotifications] = useState([]);
  const unseenCount = notifications.filter(n => !n.seen).length;
  const { fn, data } = useFetch(productService.getSeachProduct);

  const dispatchCategory = useCategory();
  const { categories } = useCategoryState();
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('all');

  const [currentLocation, setCurrentLocation] = useState(() => {
    return localStorage.getItem('saralbuy_location') || user?.currentLocation || '';
  });

  useEffect(() => {
    dispatchCategory();
  }, []);

  const unreadChatsCount = recentChats.reduce((acc, chat) => {
    const isBuyer = chat.buyerId === user?._id;
    const isSeller = chat.sellerId === user?._id;
    const count = isBuyer ? chat.buyerUnreadCount : isSeller ? chat.sellerUnreadCount : 0;
    return acc + (count > 0 ? 1 : 0);
  }, 0);
  const navigate = useNavigate();
  // Search state (UI-only; wire up your debounce + API call here)
  const [text, setSearchText] = React.useState('');
  const [products, setProducts] = useState([]);
  const [value, { isPending, flush }] = useDebounce(text, 500);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Popover open state
  const [showMessageDropdown, setShowMessageDropdown] = React.useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = React.useState(false);
  const [openSheet, setOpenSheet] = React.useState(false);
  const { fn: updateUserFn, data: updateUserRes } = useFetch(userService.updateProfile);
  const {
    fn: getRequirementIdFn,
    data: getRequirementIdRes,
    setData: setRequirementIdRes,
  } = useFetch(requirementService.getRequirementId);
  const productsRef = useRef(null);

  // ── Handlers (stubs — replace with real navigation / actions) ───────────
  const handleRaiseARequirement = () => {
    navigate('/requirement');
    setOpenSheet(false);
  };
  const handleProfileClick = () => {
    navigate('/account');
  };
  const handleCartClick = () => {
    navigate('/account/cart');
  };
  const handleMessageClick = chat => {
    setShowMessageDropdown(false);
    const isBuyer = chat.buyerId === user?._id;
    navigate('/chat', {
      state: {
        buyerId: chat.buyerId,
        sellerId: chat.sellerId,
        productName: chat.productName,
        partnerName: chat.name,
        partnerAvatar: chat.avatar,
        roomId: chat.roomId,
        isBuyer,
      },
    });
  };
  const handleNotificationClick = async notif => {
    setShowNotificationDropdown(false);
    // Mark as read
    socket.emit(SOCKET_EVENTS.NOTIFICATION_MARK_READ, { notifId: notif._id });
    setNotifications(prev => prev.map(n => (n._id === notif._id ? { ...n, seen: true } : n)));

    // Navigate to the relevant chat room if roomId exists
    if (notif.roomId) {
      const chat = recentChats.find(c => c.roomId === notif.roomId);
      if (chat) {
        const isBuyer = chat.buyerId === user?._id;
        navigate('/chat', {
          state: {
            buyerId: chat.buyerId,
            sellerId: chat.sellerId,
            productName: chat.productName,
            roomId: chat.roomId,
            isBuyer,
          },
        });
      }
    } else {
      // navigate to requirement section
      if (!notif?.metadata?.productId) return;
      await getRequirementIdFn(notif.metadata.productId);
    }
  };

  useEffect(() => {
    if (getRequirementIdRes) {
      navigate('/account/requirements-overview/' + getRequirementIdRes, {});
      setRequirementIdRes(null);
    }
  }, [getRequirementIdRes]);

  const handleSearchSelect = p => {
    setShowDropdown(false);
    setProducts([]);
    setSearchText('');
    flush();
    navigate(
      `/product-listing?_id=${encodeURIComponent(p._id)}&title=${encodeURIComponent(p.title)}`
    );
  };
  const handleSearchKeyPress = e => {
    if (e.key === 'Enter' && text.trim()) {
      setShowDropdown(false);
      const categoryParam = selectedSearchCategory !== 'all' ? `&category=${selectedSearchCategory}` : '';
      const locationParam = currentLocation ? `&location=${encodeURIComponent(currentLocation)}` : '';
      navigate(`/product-listing?title=${encodeURIComponent(text)}${categoryParam}${locationParam}&key=enter`);
      setSearchText('');
    }
  };

  async function getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const location = await getLocation(longitude, latitude);
          updateUserFn({ currentLocation: location });
          setCurrentLocation(location);
          // await updateProfile({ currentLocation: location })
        },
        err => console.log(err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  const handleLocationChange = e => {
    const val = e.target.value;
    setCurrentLocation(val);
    localStorage.setItem('saralbuy_location', val);
  };

  const handleLocationKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('saralbuy_location');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    } else if (user) {
      if (!user.currentLocation) {
        getGeoLocation();
      } else {
        setCurrentLocation(user.currentLocation);
      }
    }
  }, [user]);

  // ── Shared search dropdown JSX ───────────────────────────────────────────
  const SearchDropdown = ({ id }) =>
    showDropdown ? (
      <div
        id={id}
        ref={productsRef}
        className="absolute right-0 w-full top-full mt-2 z-[99] max-h-[300px] overflow-y-auto bg-white rounded-lg shadow-lg p-2 space-y-2"
      >
        {isSearchLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md w-full" />
          ))
        ) : products?.length > 0 ? (
          products.map(p => (
            <Card
              key={p._id}
              className="p-2 rounded-xl shadow-md bg-white cursor-pointer hover:bg-gray-50"
              onClick={() => handleSearchSelect(p)}
            >
              <div className="flex gap-4">
                <img
                  className="w-14 h-14 object-contain rounded-lg mix-blend-darken"
                  src={p.image || '/no-image.webp'}
                  alt={p.title}
                />
                <div className="flex-1">
                  <p className="text-md font-semibold text-orange-600">{p.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500 p-2 text-center">No results found.</p>
        )}
      </div>
    ) : null;

  const handleInputValue = async e => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleKeyPress = e => {
    const key = e.key.toLowerCase();
    if (key === 'enter' && value.trim() !== '') {
      setShowDropdown(false);
      setProducts([]);
      const categoryParam = selectedSearchCategory !== 'all' ? `&category=${selectedSearchCategory}` : '';
      const locationParam = currentLocation ? `&location=${encodeURIComponent(currentLocation)}` : '';
      navigate(`/product-listing?title=${encodeURIComponent(value)}${categoryParam}${locationParam}&key=enter`);
      setSearchText('');
      flush();
    }
  };

  // useEffect(() => {
  //   if (value.trim().length > 1) {
  //     fn(value);
  //     setShowDropdown(true);
  //   } else {
  //     setProducts([]);
  //     setShowDropdown(false);
  //   }
  // }, [value]);
  useEffect(() => {
    if (value.trim().length > 1) {
      setIsSearchLoading(true);
      setProducts([]);
      setShowDropdown(true);
      fn(value, selectedSearchCategory);
    } else {
      setProducts([]);
      setIsSearchLoading(false);
      setShowDropdown(false);
    }
  }, [value, selectedSearchCategory]);

  // useEffect(() => {
  //   setProducts(data);
  // }, [data]);

  useEffect(() => {
    if (data !== undefined) {
      setProducts(data);
      setIsSearchLoading(false);
    }
  }, [data]);
  useEffect(() => {
    function handleOutsideClick(event) {
      if (showDropdown && productsRef.current) {
        if (!productsRef.current.contains(event.target)) {
          setShowDropdown(false);
          setSearchText('');
          setProducts([]);
        }
      }
    }

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown, productsRef]);

  // useEffect(() => {
  //   if (!user?._id) return;

  //   const fetchChats = () => {
  //     socket.emit(SOCKET_EVENTS.GET_USER_CHATS);
  //   };

  //   socket.on(SOCKET_EVENTS.USER_CHATS, chats => {
  //     updateSetRecentChats(chats);
  //   });

  //   // ✅ On unread update — refresh the full chat list so new convos appear
  //   socket.on(SOCKET_EVENTS.UNREAD_UPDATE, ({ roomId, field, lastMessage }) => {
  //     // First try to update existing entry
  //     updateLastMessage({ roomId, unreadField: field, lastMessage });
  //     // Then re-fetch to catch brand new conversations not yet in list
  //     fetchChats();
  //   });

  //   if (!socket.connected) {
  //     socket.connect();
  //     // Tell server this user is online AFTER connection confirmed
  //     socket.emit(SOCKET_EVENTS.ONLINE_USER);
  //     socket.on(SOCKET_EVENTS.CONNECT, () => {
  //       console.log('Connected:', socket.id);
  //       fetchChats();
  //     });
  //   } else {
  //     console.log('Already connected:', socket.id);
  //     fetchChats();
  //     socket.emit(SOCKET_EVENTS.ONLINE_USER);
  //   }

  //   socket.emit(SOCKET_EVENTS.GET_NOTIFICATIONS);
  //   socket.on(SOCKET_EVENTS.NOTIFICATIONS, notifs => {
  //     setNotifications(notifs);
  //   });
  //   socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
  //   socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, notif => {
  //     // setNotifications(prev => [notif, ...prev]);
  //     setNotifications(prev => {
  //       if (prev.some(n => n._id === notif._id)) return prev;
  //       return [notif, ...prev];
  //     });
  //   });

  //   // for Online/Offline
  //   socket.on(SOCKET_EVENTS.USER_STATUS, ({ userId, isOnline }) => {
  //     updateUserStatus({ userId, isOnline });
  //   });

  //   return () => {
  //     socket.off(SOCKET_EVENTS.CONNECT);
  //     socket.off(SOCKET_EVENTS.DISCONNECT);
  //     socket.off(SOCKET_EVENTS.USER_CHATS);
  //     socket.off(SOCKET_EVENTS.UNREAD_UPDATE);
  //     socket.off(SOCKET_EVENTS.USER_STATUS);
  //     socket.off(SOCKET_EVENTS.NOTIFICATIONS);
  //     socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
  //     socket.disconnect();
  //   };
  // }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchChats = () => {
      socket.emit(SOCKET_EVENTS.GET_USER_CHATS);
    };

    // ✅ off before on — every single one
    socket.off(SOCKET_EVENTS.USER_CHATS);
    socket.on(SOCKET_EVENTS.USER_CHATS, chats => {
      updateSetRecentChats(chats);
    });

    socket.off(SOCKET_EVENTS.UNREAD_UPDATE);
    socket.on(SOCKET_EVENTS.UNREAD_UPDATE, ({ roomId, field, lastMessage }) => {
      updateLastMessage({ roomId, unreadField: field, lastMessage });
      fetchChats();
    });

    socket.off(SOCKET_EVENTS.USER_STATUS);
    socket.on(SOCKET_EVENTS.USER_STATUS, ({ userId, isOnline }) => {
      updateUserStatus({ userId, isOnline });
    });

    socket.off(SOCKET_EVENTS.NOTIFICATIONS);
    socket.on(SOCKET_EVENTS.NOTIFICATIONS, notifs => {
      setNotifications(notifs);
    });

    socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, notif => {
      // Trigger a toast alert
      toast.success(notif.title || 'New Notification', {
        description: notif.description || 'You have a new update.',
        duration: 5000,
      });
      setNotifications(prev => {
        if (prev.some(n => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
    });

    if (!socket.connected) {
      socket.connect();
      socket.emit(SOCKET_EVENTS.ONLINE_USER);
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.on(SOCKET_EVENTS.CONNECT, () => {
        console.log('Connected:', socket.id);
        fetchChats();
        socket.emit(SOCKET_EVENTS.GET_NOTIFICATIONS);
      });
    } else {
      console.log('Already connected:', socket.id);
      fetchChats();
      socket.emit(SOCKET_EVENTS.ONLINE_USER);
      socket.emit(SOCKET_EVENTS.GET_NOTIFICATIONS);
    }

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.USER_CHATS);
      socket.off(SOCKET_EVENTS.UNREAD_UPDATE);
      socket.off(SOCKET_EVENTS.USER_STATUS);
      socket.off(SOCKET_EVENTS.NOTIFICATIONS);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
      socket.disconnect();
    };
  }, [user?._id]);
  return (
    <section className="bg-gray-100">
      <div className="mb-2 relative z-9 max-w-7xl mx-auto">
        <div className="p-3 sticky top-0">
          {/* ── Desktop Nav ─────────────────────────────────────────────── */}
          <nav className="hidden justify-evenly lg:flex items-center gap-5">
            {/* Logo + Location */}
            <div className="flex items-center gap-6">
              <Link to={'/'} className="flex items-center gap-2">
                <img
                  src={saralBuyLogo}
                  className="max-h-20 mix-blend-darken  dark:invert"
                  alt={'company logo'}
                />
              </Link>

              <div className="flex items-center relative group">
                <MapPin 
                  onClick={getGeoLocation}
                  className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  title="Detect my location"
                />
                <Input
                  placeholder="Location..."
                  className="border-b-[1.5px] bg-transparent pl-8 pr-2 text-sm border-x-0 border-t-0 shadow-none rounded-none border-b-black focus-visible:ring-0 focus:outline-0 focus:shadow-none"
                  value={currentLocation}
                  onChange={handleLocationChange}
                  onKeyDown={handleLocationKeyDown}
                />
                {/* <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu> */}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-1/2 flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 overflow-hidden">
              <select
                value={selectedSearchCategory}
                onChange={e => setSelectedSearchCategory(e.target.value)}
                className="bg-gray-50 border-r border-gray-300 text-gray-700 text-xs px-3 py-2 focus:outline-none cursor-pointer h-[38px] max-w-[150px] truncate shrink-0"
              >
                <option value="all">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <Input
                type="text"
                onInput={handleInputValue}
                value={text}
                onKeyPress={handleKeyPress}
                placeholder="Looking For..."
                className="pl-3 py-2 shadow-none rounded-none w-full border-none focus-visible:ring-0 h-[38px]"
              />
              <SearchIcon className="absolute right-2.5 top-2.5 h-4 w-4 pointer-events-none opacity-50" />

              {/* Search Dropdown */}
              {showDropdown && (
                <div
                  ref={productsRef}
                  className="absolute right-0  w-full top-full mt-2 z-[99] max-h-[300px]  overflow-y-auto bg-white rounded-lg shadow-lg p-2 space-y-2"
                >
                  {isSearchLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-md w-full" />
                    ))
                  ) : products?.length > 0 ? (
                    products.map(p => (
                      <Card
                        key={p._id}
                        className="p-2 rounded-xl shadow-md bg-white cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setShowDropdown(false);
                          setProducts([]);
                          setSearchText('');
                          flush();
                          navigate(
                            `/product-listing?_id=${encodeURIComponent(p._id)}&title=${encodeURIComponent(p.title)}`
                          );
                        }}
                      >
                        <div className="flex gap-4">
                          <img
                            className="w-14 h-14 object-contain rounded-lg mix-blend-darken"
                            src={p.image || '/no-image.webp'}
                            alt={p.title}
                          />

                          <div className="flex-1">
                            <p className="text-md font-semibold text-orange-600 ">{p.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-2 text-center">No results found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Icons Row */}
            <div className="flex gap-5 items-center space-x-1">
              {/* Messages Popover */}
              {user && (
                <Popover open={showMessageDropdown} onOpenChange={setShowMessageDropdown}>
                  <PopoverTrigger asChild>
                    <div className="cursor-pointer relative bg-transparent border-0 shadow-none">
                      <MessageSquareText className="w-5 h-5 text-gray-600" />
                      {unreadChatsCount > 0 && (
                        <Badge
                          className="h-5 min-w-5 text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center absolute -top-2 -right-2 shadow-md bg-red-100 text-red-500"
                          variant="destructive"
                        >
                          {unreadChatsCount}
                        </Badge>
                      )}
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="mt-2 w-80 p-0 rounded-xl shadow-lg border border-gray-200 bg-white">
                    {recentChats.filter(c => c.lastMessage).length === 0 ? (
                      <p className="text-sm text-center text-gray-500 py-4">
                        No active conversations
                      </p>
                    ) : (
                      <>
                        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                          {recentChats
                            .filter(c => c.lastMessage)
                            .sort((a, b) => {
                              const tA = a.lastMessage?.timestamp
                                ? new Date(a.lastMessage.timestamp).getTime()
                                : 0;
                              const tB = b.lastMessage?.timestamp
                                ? new Date(b.lastMessage.timestamp).getTime()
                                : 0;
                              return tB - tA;
                            })
                            .slice(0, 5)
                            .map((chat, idx) => {
                              const isBuyer = chat.buyerId === user?._id;
                              const isSeller = chat.sellerId === user?._id;
                              const unreadCount = isBuyer
                                ? chat.buyerUnreadCount
                                : isSeller
                                  ? chat.sellerUnreadCount
                                  : 0;
                              const isUnread = unreadCount > 0;

                              return (
                                <div
                                  key={idx}
                                  onClick={() => handleMessageClick(chat)}
                                  className={`flex w-full items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                                    isUnread
                                      ? 'bg-orange-50 hover:bg-orange-100'
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  {/* Avatar */}
                                  <div className="bg-orange-500 p-2 rounded-full text-white flex items-center justify-center flex-shrink-0 relative">
                                    <MessageCircle className="w-4 h-4" />
                                    {isUnread && (
                                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                                      </span>
                                    )}
                                    {/* Online dot placeholder — replace with real isUserOnline(id) */}
                                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white" />
                                    </span>
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm mb-1 flex justify-between">
                                      <span>{chat.name || (isBuyer ? 'Seller' : 'Buyer')}</span>
                                      {isUnread && (
                                        <span className="text-xs bg-red-100 text-red-600 px-1.5 rounded-full">
                                          {unreadCount}
                                        </span>
                                      )}
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                      <p
                                        className={`text-sm flex-1 min-w-0 truncate ${isUnread ? 'font-medium text-gray-800' : 'text-gray-600'}`}
                                      >
                                        {chat.lastMessage?.message || 'Attachment'}
                                      </p>
                                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                        {chat.lastMessage?.timestamp
                                          ? format(
                                              new Date(chat.lastMessage.timestamp),
                                              'hh:mm a'
                                            ).toLowerCase()
                                          : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        {recentChats.filter(c => c.lastMessage).length > 5 && (
                          <div className="border-t border-gray-200 p-2 ">
                            <button
                              onClick={() => {
                                setShowMessageDropdown(false);
                                navigate('/chat');
                              }}
                              className="w-full text-center text-sm font-medium cursor-pointer  text-orange-600 hover:text-orange-700 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              View All Chats
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </PopoverContent>
                </Popover>
              )}

              {/* Notifications Popover */}
              <Popover
                open={showNotificationDropdown}
                onOpenChange={open => {
                  setShowNotificationDropdown(open);
                  if (!open && notifications.some(n => !n.seen)) {
                    socket.emit(SOCKET_EVENTS.NOTIFICATION_MARK_ALL_READ);
                    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <div className="cursor-pointer relative bg-transparent border-0 shadow-none">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unseenCount > 0 && (
                      <Badge
                        className="h-5 min-w-5 text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center absolute -top-2 -right-2 shadow-md bg-red-100 text-red-500"
                        variant="destructive"
                      >
                        {unseenCount}
                      </Badge>
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent className="mt-2 w-80 p-0 rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-center text-gray-500 py-4">No notifications</p>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.slice(0, 5).map(notif => {
                          const { Icon, colorClass } = getNotifMeta(notif.type);
                          return (
                            <div
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`flex items-center gap-3 p-3 hover:bg-orange-50 cursor-pointer border-b last:border-b-0 ${
                                !notif.seen ? 'bg-orange-50/50' : ''
                              }`}
                            >
                              <div
                                className={`${colorClass} p-2 rounded-full text-white flex-shrink-0`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{notif.title}</p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {notif.description}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1 block">
                                  {notif.createdAt
                                    ? format(new Date(notif.createdAt), 'hh:mm a').toLowerCase()
                                    : ''}
                                </span>
                              </div>
                              {!notif.seen && (
                                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {notifications.length > 5 && (
                        <div className="border-t border-gray-200 p-2 bg-gray-50 ">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-100 h-8 cursor-pointer"
                            onClick={() => {
                              setShowNotificationDropdown(false);
                              navigate('/account/notification');
                            }}
                          >
                            View All Notifications
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </PopoverContent>
              </Popover>

              {/* Cart */}
              <div
                className="cursor-pointer bg-transparent border-0 shadow-none"
                onClick={handleCartClick}
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            {/* Post a Requirement */}
            <Button
              onClick={handleRaiseARequirement}
              variant="link"
              size="lg"
              className="border  shadow-orange-500 border-orange-600 text-orange-600 rounded-[5px] transition-all duration-300 ease-in-out underline hover:bg-orange-500 hover:text-white cursor-pointer"
            >
              Post a requirement
            </Button>

            {/* User Greeting + Profile Button */}
            {user && (
              <span className="text-sm font-medium text-gray-700">Hello, {user?.firstName || 'Guest'}!</span>
            )}
            <Button onClick={handleProfileClick} size="icon" className="cursor-pointer bc overflow-hidden rounded-full p-0 flex items-center justify-center">
              {!user ? (
                <UserRound className="w-5 h-5" />
              ) : user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : !user?.firstName && !user?.lastNme ? (
                <UserRound className="w-5 h-5" />
              ) : (
                fallBackName(mergeName(user))
              )}
            </Button>
          </nav>

          {/* ── Mobile Nav ──────────────────────────────────────────────── */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={'/'}>
                <img
                  src={saralBuyLogo}
                  className="max-h-12 mix-blend-darken  dark:invert"
                  alt={'company logo'}
                />
              </Link>
              {/* Mobile Search */}
              <div className="relative w-1/2 flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 overflow-hidden">
                <select
                  value={selectedSearchCategory}
                  onChange={e => setSelectedSearchCategory(e.target.value)}
                  className="bg-gray-50 border-r border-gray-300 text-gray-700 text-[10px] px-1.5 py-2 focus:outline-none cursor-pointer h-[32px] max-w-[80px] truncate shrink-0"
                >
                  <option value="all">All</option>
                  {categories?.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  value={text}
                  onChange={e => {
                    setSearchText(e.target.value);
                    setShowDropdown(e.target.value.trim().length > 1);
                  }}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Looking For..."
                  className="pl-2 pr-6 py-1 shadow-none rounded-none w-full border-none focus-visible:ring-0 h-[32px] text-xs"
                />
                <SearchIcon className="absolute right-2 top-2 h-3.5 w-3.5 pointer-events-none opacity-50" />
                <SearchDropdown id="mobile-search-dropdown" />
              </div>

              {/* Sheet Trigger */}
              <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 rounded-md">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 overflow-y-auto">
                  {/* Header */}
                  <SheetHeader className="border-b bg-white px-4 py-4 sticky top-0 z-10">
                    <SheetTitle className="w-full space-y-3">
                      {user && (
                        <p className="text-sm font-medium text-gray-700">Hello, {user?.firstName || 'Guest'}!</p>
                      )}
                      <div className="flex items-center relative w-full">
                        <MapPin 
                          onClick={getGeoLocation}
                          className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                          title="Detect my location"
                        />

                        <Input
                          placeholder="Location..."
                          className="w-full bg-gray-50 pl-9 text-sm border border-gray-200 shadow-none focus-visible:ring-0"
                          value={currentLocation}
                          onChange={handleLocationChange}
                          onKeyDown={handleLocationKeyDown}
                        />
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Menu Items */}
                  <div className="flex flex-col px-2">
                    <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                      {menu.map(item => (
                        <React.Fragment key={item.title}>
                          {renderMobileMenuItem(item, setOpenSheet, navigate)}
                        </React.Fragment>
                      ))}
                    </Accordion>
                  </div>

                  {/* Footer */}
                  <SheetFooter className="px-4 pb-5 pt-2 mt-auto">
                    <Button
                      onClick={handleRaiseARequirement}
                      className="w-full h-11 text-sm font-medium border border-orange-600 bg-orange-600 text-white rounded-md transition-all duration-300 hover:bg-orange-500 hover:text-white"
                    >
                      Post a Requirement
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeNavbar;
