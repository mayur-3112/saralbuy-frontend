import React, { useState, useEffect, useRef } from 'react';
import { useUserState } from '@/redux/hooks/useUser';
import useSocket from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/socket/socketEvents';
import { fallBackName } from '@/utils/fallBackName';
import { MessageSquare, Search, Send, X, ArrowLeft, User, Circle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DiscussionChatbox() {
  const { user } = useUserState();
  const socket = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const currentUserId = user?._id;

  // Emit GET_USER_CHATS on open and setup listeners
  useEffect(() => {
    if (!socket || !currentUserId) return;

    if (isOpen) {
      socket.emit(SOCKET_EVENTS.GET_USER_CHATS);
    }

    const handleUserChats = (recentChats) => {
      setChats(recentChats || []);
    };

    socket.on(SOCKET_EVENTS.USER_CHATS, handleUserChats);
    return () => {
      socket.off(SOCKET_EVENTS.USER_CHATS, handleUserChats);
    };
  }, [socket, isOpen, currentUserId]);

  // Handle incoming messages for the active room or to refresh chat list
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleReceive = ({ roomId, message, messages: allMessages }) => {
      // If we got initial room history
      if (allMessages && selectedChat && roomId === selectedChat.roomId) {
        setMessages(
          allMessages.map(m => ({
            id: m.timestamp,
            text: m.message,
            senderId: m.senderId?.toString(),
            senderType: m.senderType,
            timestamp: m.timestamp,
          }))
        );
        return;
      }

      // If we got a live message
      if (message) {
        if (selectedChat && roomId === selectedChat.roomId) {
          setMessages(prev => [
            ...prev,
            {
              id: message.timestamp,
              text: message.message,
              senderId: message.senderId?.toString(),
              senderType: message.senderType,
              timestamp: message.timestamp,
            }
          ]);
        }
        // Refresh chats list on any message to show updated snippet and ordering
        socket.emit(SOCKET_EVENTS.GET_USER_CHATS);
      }
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceive);
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceive);
    };
  }, [socket, selectedChat, currentUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  if (!user) return null;

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    
    const userType = chat.buyerId === currentUserId ? 'buyer' : 'seller';
    
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId: chat.roomId,
      buyerId: chat.buyerId,
      sellerId: chat.sellerId,
      productId: chat.productId,
    });
    
    socket.emit(SOCKET_EVENTS.MARK_READ, {
      roomId: chat.roomId,
      readerType: userType,
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const userType = selectedChat.buyerId === currentUserId ? 'buyer' : 'seller';

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      roomId: selectedChat.roomId,
      message: messageText.trim(),
      senderType: userType,
      attachment: null,
    });

    setMessageText('');
  };

  const filteredChats = chats.filter(chat =>
    chat?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Widget */}
      {isOpen && (
        <div className="w-[360px] h-[480px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in transition-all duration-300">
          {/* Header */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between shadow-sm">
            {selectedChat ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="text-xs font-black leading-none tracking-tight">{selectedChat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] block mt-1">
                    {selectedChat.productName || 'General Enquiry'}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  Negotiations & Chat
                </h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Real-time B2B Negotiation Room</p>
              </div>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {selectedChat ? (
              /* Chat Screen */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-6 text-slate-400">
                      <div>
                        <MessageSquare className="w-8 h-8 mx-auto opacity-30 mb-2" />
                        <p className="text-xs font-bold">Start your B2B budget negotiation.</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMe = msg.senderId === currentUserId;
                      return (
                        <div
                          key={index}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-orange-600 text-white rounded-br-none'
                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`block text-[8px] text-right mt-1 font-bold ${
                                isMe ? 'text-orange-200' : 'text-slate-400'
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Form */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                  <Input
                    placeholder="Type your bid proposal..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 text-xs bg-slate-50 border-slate-200 focus:border-orange-500 rounded-xl"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-3 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </>
            ) : (
              /* Contact List Screen */
              <>
                {/* Search */}
                <div className="p-3 border-b border-slate-100 bg-white">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <Input
                      placeholder="Search partner discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {filteredChats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <MessageSquare className="w-8 h-8 opacity-25 mb-2" />
                      <p className="text-xs font-bold">No negotiation threads found</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Start discussions from a product catalog or bid</p>
                    </div>
                  ) : (
                    filteredChats.map((chat) => {
                      const unread = chat.buyerId === currentUserId ? chat.buyerUnreadCount : chat.sellerUnreadCount;
                      return (
                        <div
                          key={chat.roomId}
                          onClick={() => handleSelectChat(chat)}
                          className="p-3 flex items-center gap-3 hover:bg-slate-100/80 transition-colors cursor-pointer"
                        >
                          <Avatar className="w-9 h-9 border border-slate-200">
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback className="text-[10px] font-black bg-orange-50 text-orange-600">
                              {fallBackName(chat.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-extrabold text-slate-800 truncate">{chat.name}</h5>
                              <span className="text-[9px] text-slate-400 font-bold">
                                {chat.lastMessage?.timestamp
                                  ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate font-semibold mt-0.5">
                              {chat.productName || 'General Sourcing Enquiry'}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {chat.lastMessage?.message || 'No messages yet'}
                            </p>
                          </div>
                          {unread > 0 && (
                            <span className="w-4 h-4 bg-orange-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">
                              {unread}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-discussions-chatbox bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-350 hover:scale-105 cursor-pointer border-2 border-white/20"
        aria-label="Toggle discussions chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
