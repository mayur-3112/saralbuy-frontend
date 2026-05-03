import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Menu, Paperclip, Star } from 'lucide-react';
// import RatingPopup from '@/components/Popup/RatingPopup';
// import ApprovalPopup from '@/components/Popup/ApprovalPopup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { fallBackName } from '@/utils/fallBackName';
import useSocket from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/socket/socketEvents';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
// import BudgetInputDialog from '@/Components/BudgetPopup';

// ─────────────────────────────────────────────
// ContactsList — sidebar list of recent chats
// ─────────────────────────────────────────────
const ContactsList = ({ onSelectContact, contacts = [], selectedContactId, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts
    .filter(c => c && c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return timeB - timeA;
    });

  return (
    <div className="h-full flex flex-col bg-chat-sidebar border-r-0 border-chat-border">
      {/* Header + Search */}
      <div className="p-4 border-b border-chat-border">
        <h2 className="text-lg font-semibold mb-2 text-gray-600">Messaging</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search in dashboard..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-chat-border"
          />
        </div>
      </div>

      {/* Contact Items */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No Contact Found</p>
          </div>
        ) : (
          filteredContacts.map(contact => {
            const unreadCount =
              contact.buyerId === currentUserId
                ? contact.buyerUnreadCount || 0
                : contact.sellerUnreadCount || 0;

            const isSelected = contact.roomId === selectedContactId;
            // TODO: replace with your online-status logic
            const isOnline = contact.isOnline || false;

            return (
              <div
                key={contact.roomId}
                onClick={() => {
                  if (!isSelected) onSelectContact(contact);
                }}
                className={`px-2 py-1 border-chat-border hover:bg-chat-message-bg cursor-pointer transition-colors ${
                  isSelected ? 'bg-orange-50' : ''
                }`}
              >
                <div
                  className={`flex items-start space-x-3 bg-white p-3 rounded-md ${
                    isSelected ? 'border-2 border-orange-500' : ''
                  }`}
                >
                  {/* Avatar with online dot */}
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{fallBackName(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                        isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>

                  {/* Name, last message, timestamp, rating, unread */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-600 truncate">{contact.name}</h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground ml-2">
                          {contact.lastMessage?.timestamp
                            ? new Date(contact.lastMessage.timestamp).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : ''}
                        </span>
                        {contact.chatrating > 0 && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                            <span className="text-xs font-medium">{contact.chatrating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[13px] text-muted-foreground font-medium truncate mt-1">
                        {contact.lastMessage?.message || 'No messages yet'}
                      </p>
                      {!isSelected && unreadCount > 0 && (
                        <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ChatArea — main chat window
// ─────────────────────────────────────────────
const ChatArea = ({
  selectedContact,
  userType, // 'buyer' | 'seller'
  currentUserId,
  messages = [],
  setMessages,

  // Deal state (manage in parent or pass as props)
  isClosingDeal,
  isDealClosed,
  isDealRejected,
  waitingSellerApproval,
  isSeller,
  isBuyer,
  finalBudget,
  closedDealId,

  // Popup state
  showRatingPopup,
  setShowRatingPopup,
  ratingLoading,
  lastClosedChatId,
  showApprovalPopup,
  setShowApprovalPopup,
  approvalLoading,

  // Callbacks — wire up your logic here
  onSendMessage, // (messageText, attachment) => void
  onCloseDeal, // () => void
  onSubmitRating, // (chatId, rating) => void
  onDealApproval, // (dealId, 'accept' | 'reject') => void

  isOnline,
}) => {
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [messageText, setMessageText] = useState('');

  // Attachment local UI state
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAttachment, setUploadedAttachment] = useState(null);

  // Budget dialog
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);

  // ── File handling ──────────────────────────
  const handleFileSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit');
      return;
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/tiff',
      'image/bmp',
      'image/avif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      alert('Invalid file type. Only images and documents are allowed.');
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => setAttachmentPreview(ev.target?.result);
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }

    // TODO: call your upload service here
    // Example:
    // setIsUploading(true);
    // uploadFile(file).then(data => { setUploadedAttachment(data); setIsUploading(false); });
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setAttachmentPreview(null);
    setUploadedAttachment(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Send message ───────────────────────────
  const handleSendMessage = () => {
    if (!messageText.trim() && !uploadedAttachment) return;
    onSendMessage?.(messageText, uploadedAttachment || null);
    setMessageText('');
    clearAttachment();
  };

  // ── Close deal ─────────────────────────────
  const handleCloseDealClick = () => {
    // Show budget dialog; parent handles actual close logic via onCloseDeal
    setShowBudgetDialog(true);
  };

  const handleBudgetConfirm = amount => {
    setShowBudgetDialog(false);
    onCloseDeal?.(amount);
  };

  // ── Date separator helper ──────────────────
  const getDateLabel = timestamp => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const toDateOnly = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    if (toDateOnly(messageDate) === toDateOnly(today)) return 'Today';
    if (toDateOnly(messageDate) === toDateOnly(yesterday)) return 'Yesterday';
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  // ── Self-chat guard ────────────────────────
  const actualBuyerId = selectedContact?.buyerId;
  const actualSellerId = selectedContact?.sellerId;
  const isSelfChat =
    (currentUserId === actualBuyerId && currentUserId === actualSellerId) ||
    actualBuyerId === actualSellerId;

  // ── Close-deal button label & style ───────
  const closeDealLabel = (() => {
    if (isClosingDeal) return 'Closing...';
    if (waitingSellerApproval && isSeller) return 'Closed deal request';
    if (waitingSellerApproval && isBuyer) return 'Deal in Progress';
    if (isDealRejected) return 'Deal Rejected';
    if (isDealClosed) return 'Deal Closed';
    return 'Close Deal';
  })();

  const closeDealVariant =
    waitingSellerApproval && isSeller ? 'default' : isDealRejected ? 'destructive' : 'outline';

  const closeDealClass = (() => {
    if ((waitingSellerApproval && isSeller) || (waitingSellerApproval && isBuyer))
      return 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600';
    if (isDealRejected)
      return 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100 cursor-not-allowed';
    return 'text-orange-600 hover:text-orange-600 bg-transparent cursor-pointer hover:bg-transparent border-orange-600';
  })();

  const isCloseDealDisabled =
    isClosingDeal ||
    (isDealClosed && !(waitingSellerApproval && isSeller)) ||
    messages.length === 0 ||
    isDealRejected;

  // ── Empty state ────────────────────────────
  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm">Choose a contact from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Budget dialog */}
      {/* <BudgetInputDialog
        open={showBudgetDialog}
        setOpen={setShowBudgetDialog}
        onConfirm={handleBudgetConfirm}
        loading={isClosingDeal}
      /> */}

      <div className="flex-1 flex flex-col border-1 rounded-md w-full min-h-0">
        {/* ── Chat Header ── */}
        <div className="border-b border-chat-border bg-background">
          {/* Product name bar */}
          <div className="flex justify-between items-center bg-gray-100 p-2">
            <p className="text-sm text-muted-foreground font-semibold">
              Product Name: {selectedContact.productName || 'Product Discussion'}
            </p>
          </div>

          {/* Avatar / name / online / close-deal button */}
          <div className="flex items-center space-x-3 p-3 bg-orange-50">
            <div className="flex justify-between items-center w-full">
              <div className="relative flex items-center gap-3 justify-between w-full">
                {/* Left: avatar + name + online status */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-700">{selectedContact.name}</h3>
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}
                      />
                      <span
                        className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: close-deal button (visible to buyer, or when deal is closed/rejected) */}
                {(userType === 'buyer' || isDealClosed || isDealRejected) && (
                  <Button
                    variant={closeDealVariant}
                    size="sm"
                    className={`${closeDealClass} w-24 sm:w-auto px-4 text-sm font-medium`}
                    onClick={
                      waitingSellerApproval && isSeller
                        ? () => setShowApprovalPopup(true)
                        : handleCloseDealClick
                    }
                    disabled={isCloseDealDisabled}
                  >
                    {closeDealLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Messages Area ── */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 chat-messages-container"
        >
          {isSelfChat ? (
            <div className="text-center text-red-500 font-semibold">
              Cannot send messages to yourself. Buyer and seller must be different users.
            </div>
          ) : (
            messages.map((message, index) => {
              const isMine = message.senderId === currentUserId && message.senderType === userType;

              const showDateSeparator =
                index === 0 ||
                (message.timestamp &&
                  messages[index - 1]?.timestamp &&
                  new Date(message.timestamp).toDateString() !==
                    new Date(messages[index - 1].timestamp).toDateString());

              return (
                <React.Fragment key={message.id}>
                  {/* Date separator */}
                  {showDateSeparator && (message.timestamp || message.time) && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {message.timestamp
                          ? getDateLabel(message.timestamp)
                          : getDateLabel(new Date())}
                      </div>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2 ${
                        isMine
                          ? 'bg-gray-500 text-white rounded-tl-lg rounded-bl-lg rounded-br-lg'
                          : 'bg-gray-600 text-white rounded-tr-lg rounded-bl-lg rounded-br-lg'
                      }`}
                    >
                      {/* Attachment */}
                      {message.attachment?.url && message.attachment?.type && (
                        <div className="mb-2">
                          {message.attachment.type === 'image' ? (
                            <img
                              src={message.attachment.url}
                              alt={message.attachment.fileName}
                              className="max-w-full h-auto rounded-md cursor-pointer w-32"
                              onClick={() => window.open(message.attachment.url, '_blank')}
                            />
                          ) : (
                            <a
                              href={message.attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span className="text-sm">{message.attachment.fileName}</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Text */}
                      {message.text && <p className="text-sm">{message.text}</p>}
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.timestamp
                        ? new Date(message.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : message.time
                          ? new Date(`1970-01-01T${message.time}`).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : ''}
                    </span>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* ── Message Input ── */}
        <div className="p-4 border-t border-chat-border bg-background">
          {/* Attachment preview */}
          {(selectedFile || uploadedAttachment) && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {attachmentPreview ? (
                    <img
                      src={attachmentPreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Paperclip className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{selectedFile?.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : ''}
                    </p>
                    {isUploading && <p className="text-xs text-orange-500">Uploading...</p>}
                    {uploadedAttachment && !isUploading && (
                      <p className="text-xs text-green-500">Ready to send</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAttachment}
                  disabled={isUploading}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center space-x-5">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !isUploading && handleSendMessage()}
                className="h-12 px-5 bg-white rounded-full text-sm placeholder:text-muted-foreground tracking-wide focus-visible:ring-1 focus-visible:ring-orange-500 border border-gray-300"
                disabled={isSelfChat || isUploading}
              />
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.ppt,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Paperclip button */}
            <div
              className={`p-2 rounded-full border-2 border-gray-500 ${
                isSelfChat || isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-gray-100'
              }`}
              onClick={() => !isSelfChat && !isUploading && fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4 text-gray-700" />
            </div>

            {/* Send button */}
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="cursor-pointer w-12"
              disabled={isSelfChat || isUploading || (!messageText.trim() && !uploadedAttachment)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Rating popup */}
      {/* <RatingPopup
        open={showRatingPopup}
        setOpen={setShowRatingPopup}
        chatId={lastClosedChatId || selectedContact?._id || ''}
        onSubmit={onSubmitRating}
        loading={ratingLoading}
      /> */}

      {/* Approval popup */}
      {/* <ApprovalPopup
        open={showApprovalPopup}
        setOpen={setShowApprovalPopup}
        dealId={closedDealId || ''}
        budget={finalBudget}
        partnerName={selectedContact?.name || 'Buyer'}
        onAction={onDealApproval}
        loading={approvalLoading}
      /> */}
    </>
  );
};

// ─────────────────────────────────────────────
// Chatbot — root layout component
// ─────────────────────────────────────────────
const Chatbot = () => {
  const socket = useSocket();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId'); // productId has a Room Id
  const [recentChats, setRecentChats] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const state = location.state || {};

  // ── State se directly lo ──────────────────────────
  const buyerId = state.buyerId;
  const partnerName = state.partnerName;
  const partnerAvatar = state.partnerAvatar;
  const productName = state.productName;
  const sellerId = state.sellerId;

  // ── User / role ──────────────────────────────
  // TODO: replace with your auth store / context
  const currentUserId = null; // e.g. user?._id
  const userType = 'buyer'; // 'buyer' | 'seller' — derive from selectedContact + currentUserId

  // ── Deal state ───────────────────────────────
  const [isClosingDeal, setIsClosingDeal] = useState(false);
  const [isDealClosed, setIsDealClosed] = useState(false);
  const [isDealRejected, setIsDealRejected] = useState(false);
  const [waitingSellerApproval, setWaitingSellerApproval] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [finalBudget, setFinalBudget] = useState(0);
  const [closedDealId, setClosedDealId] = useState(null);

  // ── Popup state ──────────────────────────────
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [lastClosedChatId, setLastClosedChatId] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);

  // ── Callbacks — add your logic inside ────────
  const handleSelectContact = contact => {
    setSelectedContact(contact);
    setMessages([]);
    // TODO: reset unread count, join socket room, mark as read
  };

  const handleSidebarContactUpdate = (roomId, updater) => {
    setRecentChats(prev => prev.map(chat => (chat.roomId === roomId ? updater(chat) : chat)));
  };

  const handleSendMessage = (messageText, attachment) => {
    // TODO: emit socket message, update messages & sidebar
    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      senderId: currentUserId,
      senderType: userType,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
      attachment: attachment || null,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCloseDeal = amount => {
    // TODO: call requirementService.closeDeal(...)
    setIsClosingDeal(true);
  };

  const handleSubmitRating = (chatId, rating) => {
    // TODO: call chatService.rateChat(...)
    setRatingLoading(true);
  };

  const handleDealApproval = (dealId, action) => {
    // TODO: call requirementService.respondToCloseDeal(...)
    setApprovalLoading(true);
  };

  // ── Error state ──────────────────────────────
  if (!currentUserId) {
    // Remove this guard or replace with your auth check
    // return (
    //   <div className="h-screen flex items-center justify-center text-red-500 text-lg font-semibold">
    //     Error: Please log in to access chat
    //   </div>
    // );
  }

  useEffect(() => {
    if (!socket.connected) return alert('Socket not connected!');
    socket.emit(SOCKET_EVENTS.CHAT_USER, sellerId);
    socket.on(SOCKET_EVENTS.CHAT_USER, user => {
      // seller chat tab user
      setRecentChats((prev)=>[user,...prev])
      
    });
  }, [state]);
  console.log(recentChats)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-5">
      <div className="h-[calc(100vh-100px)] border-chat-border rounded-lg overflow-hidden mt-5">
        <div className="flex h-full gap-2">
          {/* ── Desktop Sidebar ── */}
          <div className="hidden md:block w-80 bg-gray-100 border-1 rounded-md">
            {isLoadingChats ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading chats...</p>
              </div>
            ) : (
              <ContactsList
                onSelectContact={handleSelectContact}
                contacts={recentChats}
                selectedContactId={selectedContact?.roomId || null}
                currentUserId={currentUserId}
              />
            )}
          </div>

          {/* ── Main area ── */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Mobile header */}
            <div className="md:hidden py-2 border-chat-border bg-chat-sidebar">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-semibold text-foreground">Messages</h2>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <ContactsList
                      onSelectContact={contact => {
                        handleSelectContact(contact);
                        setIsMobileMenuOpen(false);
                      }}
                      contacts={recentChats}
                      selectedContactId={selectedContact?.roomId || null}
                      currentUserId={currentUserId}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Chat area or empty state */}
            {selectedContact ? (
              <ChatArea
                selectedContact={selectedContact}
                userType={userType}
                currentUserId={currentUserId}
                messages={messages}
                setMessages={setMessages}
                isClosingDeal={isClosingDeal}
                isDealClosed={isDealClosed}
                isDealRejected={isDealRejected}
                waitingSellerApproval={waitingSellerApproval}
                isSeller={isSeller}
                isBuyer={isBuyer}
                finalBudget={finalBudget}
                closedDealId={closedDealId}
                showRatingPopup={showRatingPopup}
                setShowRatingPopup={setShowRatingPopup}
                ratingLoading={ratingLoading}
                lastClosedChatId={lastClosedChatId}
                showApprovalPopup={showApprovalPopup}
                setShowApprovalPopup={setShowApprovalPopup}
                approvalLoading={approvalLoading}
                onSendMessage={handleSendMessage}
                onCloseDeal={handleCloseDeal}
                onSubmitRating={handleSubmitRating}
                onDealApproval={handleDealApproval}
                isOnline={selectedContact?.isOnline || false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-background">
                {recentChats.length === 0 ? (
                  <div className="flex justify-center items-center h-full flex-col space-y-2">
                    <img src="no-chat.webp" alt="" className="h-28 w-28" />
                    <p className="text-center text-lg capitalize">No chats available</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">
                      {isLoadingChats ? 'Loading...' : ''}
                    </h3>
                    <p className="text-sm">Choose a contact from the sidebar to start messaging</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
