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
import saralBuyLogo from '/image/Logo/saralBuyLogo.png';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { fallBackName } from '@/utils/fallBackName';
import { mergeName } from '@/utils/mergerName';
import productService from '@/services/product.service';
import { useFetch } from '@/hooks/useFetch';
import { useDebounce } from 'use-debounce';
import { useDispatchUser, useUserState } from '@/redux/hooks/useUser';
import { getLocation } from '@/utils/locationAPI';
import { SOCKET_EVENTS } from '@/socket/socketEvents';
import socket from '@/socket/socket';
import { useChatState, useDispatchChat } from '@/redux/hooks/useChat';
import userService from '@/services/user.service';
const menu = [
  {
    title: 'Account',
    url: '/account',
    icon: <CircleUserRound className="w-5 h-5" />,
  },
  {
    title: 'Messages',
    url: '/chat',
    icon: <MessageCircleMore className="w-5 h-5" />,
  },
  {
    title: 'Notifications',
    url: '/account/notification',
    icon: <Bell className="w-5 h-5" />,
  },
  {
    title: 'Cart',
    url: '/account/cart',
    icon: <ShoppingCart className="w-5 h-5" />,
  },
];

const MOCK_NOTIFICATIONS = [
  {
    _id: 'n1',
    type: 'bid',
    title: 'New bid received',
    description: 'Ramesh placed a bid of ₹2,500 on your product.',
    seen: false,
    timestamp: new Date().toISOString(),
  },
  {
    _id: 'n2',
    type: 'deal_accepted',
    title: 'Deal accepted!',
    description: 'Your deal for Mobile Phone has been accepted.',
    seen: false,
    timestamp: new Date().toISOString(),
  },
  {
    _id: 'n3',
    type: 'deal_rejected',
    title: 'Deal rejected',
    description: 'Seller rejected your deal request for Laptop.',
    seen: false,
    timestamp: new Date().toISOString(),
  },
  {
    _id: 'n4',
    type: 'deal_request',
    title: 'New deal request',
    description: 'Priya Sharma sent you a deal request.',
    seen: false,
    timestamp: new Date().toISOString(),
  },
  {
    _id: 'n5',
    type: 'product',
    title: 'Product match found',
    description: 'A product matching your requirement was listed.',
    seen: true,
    timestamp: new Date().toISOString(),
  },
  {
    _id: 'n6',
    type: 'chat_rating',
    title: 'Rating received',
    description: 'Ajay rated your conversation 5 stars.',
    seen: true,
    timestamp: new Date().toISOString(),
  },
];

// ─── Helper: notification icon resolver ──────────────────────────────────────

function getNotifMeta(type) {
  switch (type) {
    case 'bid':
      return { Icon: Gavel, colorClass: 'bg-orange-500' };
    case 'chat_rating':
      return { Icon: Star, colorClass: 'bg-yellow-500' };
    case 'deal_accepted':
      return { Icon: CheckCircle, colorClass: 'bg-green-500' };
    case 'deal_rejected':
      return { Icon: XCircle, colorClass: 'bg-red-500' };
    case 'deal_request':
      return { Icon: FileText, colorClass: 'bg-blue-500' };
    case 'product':
      return { Icon: Box, colorClass: 'bg-orange-500' };
    default:
      return { Icon: Bell, colorClass: 'bg-gray-500' };
  }
}

// ─── Mobile menu item renderer ────────────────────────────────────────────────

const renderMobileMenuItem = item => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
      </AccordionItem>
    );
  }
  return (
    <Link
      key={item.title}
      to={item.url}
      className="text-md font-semibold text-gray-700 flex items-center gap-2 py-2"
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const HomeNavbar = () => {
  const { user } = useUserState();
  const { updateUserState} = useDispatchUser() // update state
  const { recentChats } = useChatState();
  const { updateSetRecentChats, updateLastMessage, updateUserStatus } = useDispatchChat();
  const notifications = MOCK_NOTIFICATIONS;
  const unseenCount = notifications.filter(n => !n.seen).length;
  const { fn, data } = useFetch(productService.getSeachProduct);
  const [currentLocation, setCurrentLocation] = useState(user?.currentLocation ?? '');
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
  const {fn:updateUserFn,data:updateUserRes} = useFetch(userService.updateProfile)
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
    /* navigate("/account/cart") */
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
  const handleNotificationClick = _notif => {
    setShowNotificationDropdown(false); /* navigate */
  };
  const handleSearchSelect = _product => {
    setShowDropdown(false);
    setSearchText('');
    /* navigate(`/product-listing?_id=${p._id}&title=${p.title}`) */
  };
  const handleSearchKeyPress = e => {
    if (e.key === 'Enter' && text.trim()) {
      setShowDropdown(false);
      setSearchText('');
      /* navigate(`/product-listing?title=${encodeURIComponent(text)}&key=enter`) */
    }
  };

  async function getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const location = await getLocation(longitude, latitude);
          updateUserFn({currentLocation:location})
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

  useEffect(() => {
    if (!user?.currentLocation  && user) {
      getGeoLocation();
    } else {
      setCurrentLocation(user?.currentLocation);
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
        ) : products.length > 0 ? (
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
      setSearchText('');
      flush();
      navigate(`/product-listing?title=${encodeURIComponent(value)}&key=enter`);
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
      fn(value);
    } else {
      setProducts([]);
      setIsSearchLoading(false);
      setShowDropdown(false);
    }
  }, [value]);

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
          setText('');
          setProducts([]);
        }
      }
    }

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown, productsRef]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchChats = () => {
      socket.emit(SOCKET_EVENTS.GET_USER_CHATS);
    };

    socket.on(SOCKET_EVENTS.USER_CHATS, chats => {
      updateSetRecentChats(chats);
    });

    // ✅ On unread update — refresh the full chat list so new convos appear
    socket.on(SOCKET_EVENTS.UNREAD_UPDATE, ({ roomId, field, lastMessage }) => {
      // First try to update existing entry
      updateLastMessage({ roomId, unreadField: field, lastMessage });
      // Then re-fetch to catch brand new conversations not yet in list
      fetchChats();
    });

    if (!socket.connected) {
      socket.connect();
      // Tell server this user is online AFTER connection confirmed
      socket.emit(SOCKET_EVENTS.ONLINE_USER);
      socket.on(SOCKET_EVENTS.CONNECT, () => {
        console.log('Connected:', socket.id);
        fetchChats();
      });
    } else {
      console.log('Already connected:', socket.id);
      fetchChats();
      socket.emit(SOCKET_EVENTS.ONLINE_USER);
    }

    // for Online/Offline
    socket.on(SOCKET_EVENTS.USER_STATUS, ({ userId, isOnline }) => {
      updateUserStatus({ userId, isOnline });
    });

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.USER_CHATS);
      socket.off(SOCKET_EVENTS.UNREAD_UPDATE);
      socket.off(SOCKET_EVENTS.USER_STATUS);
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

              <div className="flex items-center relative ">
                <MapPin className="w-4 h-4  text-orange-500 rounded-full  absolute top-1/2 left-3  -translate-1/2"></MapPin>
                <Input
                  readOnly
                  placeholder="Location..."
                  className="border-b-[1.5px] bg-transparent pl-6 text-sm border-x-0 border-t-0 shadow-none rounded-none  border-b-black focus-visible:ring-0 focus:outline-0 focus:shadow-none "
                  defaultValue={currentLocation}
                />
                {/* <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu> */}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-1/2">
              <Input
                type="text"
                onInput={handleInputValue}
                value={text}
                onKeyPress={handleKeyPress}
                placeholder="Looking For..."
                className="pl-2 shadow-none rounded-sm w-full float-end focus-visible:ring-0 border border-gray-300  focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
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
                          <div className="border-t border-gray-200 p-2">
                            <button
                              onClick={() => {
                                setShowMessageDropdown(false); /* navigate('/chat') */
                              }}
                              className="w-full text-center text-sm font-medium text-orange-600 hover:text-orange-700 py-2 rounded-lg hover:bg-orange-50 transition-colors"
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
                  // on close: call markAsSeen(unseenIds) here
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
                                  {notif.timestamp
                                    ? format(new Date(notif.timestamp), 'hh:mm a').toLowerCase()
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
                        <div className="border-t border-gray-200 p-2 bg-gray-50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-100 h-8"
                            onClick={() => {
                              setShowNotificationDropdown(
                                false
                              ); /* navigate('/account/notification') */
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

            {/* Profile Button */}
            <Button onClick={handleProfileClick} size="icon" className="cursor-pointer bc">
              {!user ? (
                <UserRound className="w-5 h-5" />
              ) : user && !user?.firstName && !user?.lastNme ? (
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
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-orange-500 tracking-tight">
                  Saral<span className="text-gray-700">Buy</span>
                </span>
              </Link>

              {/* Mobile Search */}
              <div className="relative w-1/2">
                <Input
                  type="text"
                  value={text}
                  onChange={e => {
                    setSearchText(e.target.value);
                    setShowDropdown(e.target.value.trim().length > 1);
                  }}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Looking For..."
                  className="pl-2 shadow-none rounded-sm w-full focus-visible:ring-0 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
                <SearchIcon className="absolute right-2.5 top-2.5 h-4 w-4 pointer-events-none opacity-50" />
                <SearchDropdown id="mobile-search-dropdown" />
              </div>

              {/* Sheet Trigger */}
              <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center relative">
                        <MapPin className="w-4 h-4 text-orange-500 rounded-full absolute top-1/2 left-3 -translate-y-1/2" />
                        <Input
                          readOnly
                          placeholder="Location..."
                          className="border-b-[1.5px] max-w-[85%] bg-transparent pl-6 text-sm border-x-0 border-t-0 shadow-none rounded-none border-b-black focus-visible:ring-0 focus:outline-0 focus:shadow-none"
                          defaultValue={currentLocation}
                        />
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-1 flex-col gap-3 px-4 mt-4">
                    <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                      {/* Switch between menu / accountMenu based on your router location */}
                      {menu.map(item => (
                        <React.Fragment key={item.title}>
                          {renderMobileMenuItem(item)}
                        </React.Fragment>
                      ))}
                    </Accordion>
                  </div>

                  <SheetFooter className="mt-4">
                    <Button
                      onClick={handleRaiseARequirement}
                      variant="link"
                      size="lg"
                      className="border  shadow-orange-500 border-orange-600 text-orange-600 rounded-[5px] transition-all duration-300 ease-in-out underline hover:bg-orange-500 hover:text-white cursor-pointer"
                    >
                      Post a requirement
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
