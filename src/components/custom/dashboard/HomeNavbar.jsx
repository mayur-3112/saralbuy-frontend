import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Box,
  CircleUserRound,
  Compass,
  Gavel,
  Handshake,
  HelpCircle,
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
  Calculator,
  LayoutDashboard,
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
import SaralBuyLogo from '/image/Logo/navbarLogo.png';
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
    title: 'My Dashboard',
    url: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'Explore',
    url: '/product-listing',
    icon: <Compass className="w-5 h-5" />,
  },
  {
    title: 'How It Works',
    url: '/how-it-works',
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    title: 'Supplier Tools',
    url: '/supplier-tools',
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    title: 'Buyer Tools',
    url: '/buyer-tools',
    icon: <Compass className="w-5 h-5" />,
  },
  {
    title: 'Settings',
    url: '/account',
    icon: <CircleUserRound className="w-5 h-5" />,
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
      className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
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
    return localStorage.getItem('SaralBuy_location') || user?.currentLocation || '';
  });

  // Filter out legacy categories
  const legacyNames = [
    'Building Materials',
    'Electrical & Lights',
    'Plumbing & Sanitary',
    'Paints & Waterproofing'
  ];
  const filteredCategories = categories?.filter(cat => !legacyNames.includes(cat.categoryName));

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
    localStorage.setItem('SaralBuy_location', val);
  };

  const handleLocationKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('SaralBuy_location');
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
                  <p className="text-md font-semibold text-blue-600">{p.title}</p>
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
    <section className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3">
        <div>
          {/* ── Desktop Nav ─────────────────────────────────────────────── */}
          <nav className="hidden justify-between lg:flex items-center gap-2 xl:gap-4 w-full">
            {/* Logo + Navigation Links */}
            <div className="flex items-center gap-3 xl:gap-5 shrink-0">
              {/* Desktop Burger Menu Trigger */}
              <div className="hidden lg:flex items-center ml-2">
                <Button variant="outline" size="icon" className="shrink-0 rounded-md border-0 bg-transparent hover:bg-slate-100" onClick={() => setOpenSheet(true)}>
                  <Menu className="size-6 text-slate-700" />
                </Button>
              </div>

              <Link to={'/'} className="flex items-center">
                <img
                  src={SaralBuyLogo}
                  className="h-12 md:h-16 w-auto object-contain mix-blend-darken dark:invert transform scale-150 ml-4 mr-2"
                  alt={'company logo'}
                />
              </Link>

              </div>

            {/* Unified Search & Location Pill - Hidden on landing page for redundancy */}
            {window.location.pathname === '/' ? (
              <div className="flex-1" />
            ) : (
              <div className="flex-1 max-w-3xl flex items-center bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-blue-300 transition-all duration-300 overflow-visible mx-4">
              {/* Location */}
              <div className="flex items-center relative group shrink-0 w-36 lg:w-48 border-r border-slate-200 hover:bg-slate-50 rounded-l-full transition-colors">
                <MapPin 
                  onClick={getGeoLocation}
                  className="w-4 h-4 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                  title="Detect my location"
                />
                <Input
                  placeholder="Location..."
                  className="bg-transparent pl-10 pr-2 text-sm border-0 shadow-none focus-visible:ring-0 h-[42px] w-full truncate cursor-pointer rounded-l-full"
                  value={currentLocation}
                  onChange={handleLocationChange}
                  onKeyDown={handleLocationKeyDown}
                />
              </div>

              {/* Category Dropdown */}
              <select
                value={selectedSearchCategory}
                onChange={e => setSelectedSearchCategory(e.target.value)}
                className="bg-transparent border-r border-slate-200 text-slate-600 text-sm px-3 hover:bg-slate-50 focus:outline-none cursor-pointer h-[42px] max-w-[140px] truncate shrink-0 transition-colors"
              >
                <option value="all">All Categories</option>
                {filteredCategories?.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative flex-1 flex items-center h-[42px] group">
                <Input
                  type="text"
                  onInput={handleInputValue}
                  value={text}
                  onKeyPress={handleKeyPress}
                  placeholder="Looking For..."
                  className="pl-3 pr-10 shadow-none border-0 focus-visible:ring-0 h-full w-full bg-transparent rounded-r-full"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm shadow-blue-500/30">
                  <SearchIcon className="h-4 w-4 text-white" />
                </div>

                {/* Search Dropdown */}
                {showDropdown && (
                  <div
                    ref={productsRef}
                    className="absolute left-0 right-0 top-full mt-3 z-[99] max-h-[350px] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-2"
                  >
                    {isSearchLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl w-full" />
                      ))
                    ) : products?.length > 0 ? (
                      products.map(p => (
                        <Card
                          key={p._id}
                          className="p-3 rounded-xl border border-slate-100 shadow-sm bg-white cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all"
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
                          <div className="flex gap-4 items-center">
                            <img
                              className="w-12 h-12 object-contain rounded-lg mix-blend-darken bg-slate-50 p-1"
                              src={p.image || '/no-image.webp'}
                              alt={p.title}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 p-4 text-center">No results found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 xl:gap-5 shrink-0">
              {/* Icons Row */}
              <div className="flex gap-3 items-center space-x-1">
              {/* Messages Popover */}
              {user && (
                <Popover open={showMessageDropdown} onOpenChange={setShowMessageDropdown}>
                  <PopoverTrigger asChild>
                    <div className="cursor-pointer relative p-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
                      <MessageSquareText className="w-5 h-5 text-slate-700" />
                      {unreadChatsCount > 0 && (
                        <Badge
                          className="h-[18px] min-w-[18px] text-[10px] font-bold rounded-full px-1 py-0 flex items-center justify-center absolute -top-1 -right-1 shadow-sm bg-gradient-to-r from-red-500 to-rose-500 text-white border border-white"
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
                                      ? 'bg-blue-50 hover:bg-blue-100'
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  {/* Avatar */}
                                  <div className="bg-blue-500 p-2 rounded-full text-white flex items-center justify-center flex-shrink-0 relative">
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
                              className="w-full text-center text-sm font-medium cursor-pointer  text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-colors"
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
                  <div className="cursor-pointer relative p-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Bell className="w-5 h-5 text-slate-700" />
                    {unseenCount > 0 && (
                      <Badge
                        className="h-[18px] min-w-[18px] text-[10px] font-bold rounded-full px-1 py-0 flex items-center justify-center absolute -top-1 -right-1 shadow-sm bg-gradient-to-r from-red-500 to-rose-500 text-white border border-white"
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
                              className={`flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 ${
                                !notif.seen ? 'bg-blue-50/50' : ''
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
                                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
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
                            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8 cursor-pointer"
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

            </div>

            {/* Post a Requirement */}
            <Button
              onClick={() => {
                navigate('/requirement');
                setOpenSheet(false);
              }}
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-rose-500 hover:from-blue-600 hover:to-rose-600 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 text-white font-bold px-6 py-2 rounded-full transition-all duration-300 cursor-pointer text-sm border-0 group ring-2 ring-white/50 ring-offset-1 ring-offset-blue-50"
            >
              Post Requirements
              <span className="ml-1 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 group-hover:translate-x-1 transition-all duration-300">→</span>
            </Button>

            {/* My Account Button */}
            <Button 
              onClick={handleProfileClick} 
              variant="outline" 
              className="hidden lg:flex items-center gap-2 font-bold text-slate-700 border border-slate-200/60 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-sm bg-white/80 active:scale-95"
            >
              <UserRound className="w-4 h-4" />
              My Account
            </Button>
          </div>
          </nav>

          {/* ── Mobile Nav ──────────────────────────────────────────────── */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between gap-2">
              
              {/* Hamburger and Logo Group */}
              <div className="flex items-center">
                {/* Sheet Trigger */}
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 rounded-md border-0 bg-transparent hover:bg-slate-100 -ml-2">
                      <Menu className="size-6 text-slate-700" />
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
                            className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
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

                      {/* Log out for Mobile */}
                      {user ? (
                        <button
                          className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => {
                            updateUserState(null);
                            socket.disconnect();
                            localStorage.removeItem('token');
                            toast.success('Logged out successfully');
                            setOpenSheet(false);
                            navigate('/');
                          }}
                        >
                          Log out
                        </button>
                      ) : (
                        <button
                          className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
                          onClick={() => {
                            setOpenSheet(false);
                            window.dispatchEvent(new Event('session-expired'));
                          }}
                        >
                          Login / Register
                        </button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link to={'/'} className="ml-1">
                  <img
                    src={SaralBuyLogo}
                    className="max-h-12 mix-blend-darken  dark:invert"
                    alt={'company logo'}
                  />
                </Link>
              </div>

              {/* Mobile Search */}
              <div className="relative w-[55%] flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 overflow-hidden">
                <select
                  value={selectedSearchCategory}
                  onChange={e => setSelectedSearchCategory(e.target.value)}
                  className="bg-gray-50 border-r border-gray-300 text-gray-700 text-[10px] px-1.5 py-2 focus:outline-none cursor-pointer h-[32px] max-w-[80px] truncate shrink-0"
                >
                  <option value="all">All</option>
                  {filteredCategories?.map(cat => (
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeNavbar;
