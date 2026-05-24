import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Menu, Paperclip, Star, PanelRightIcon, PanelRightOpen } from 'lucide-react';
// import RatingPopup from '@/components/Popup/RatingPopup';
// import ApprovalPopup from '@/components/Popup/ApprovalPopup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { fallBackName } from '@/utils/fallBackName';
import useSocket from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/socket/socketEvents';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUserState } from '@/redux/hooks/useUser';
import { useChatState, useDispatchChat } from '@/redux/hooks/useChat';
import ApprovalPopup from '@/components/custom/popups/ApprovalPopup';
import BudgetInputDialog from '@/components/custom/popups/BudgetInputDialog';
import { toast } from 'sonner';
import RatingPopup from '@/components/custom/popups/RatingPopup';
import Loader from '@/components/custom/Loader';
import TooltipComp from '@/lib/TooltipComp';

// ─────────────────────────────────────────────
// ContactsList — sidebar list of recent chats
// ─────────────────────────────────────────────
const ContactsList = ({
  onSelectContact,
  contacts = [],
  selectedContactId,
  currentUserId,
  focusTile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const contactRefs = useRef({});

  useEffect(() => {
    if (focusTile !== -1 && contactRefs.current[focusTile]) {
      contactRefs.current[focusTile].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [focusTile]);

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
                      className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full`}
                    />
                    {/* ${
                        isOnline ? 'bg-green-500' : 'bg-red-500'
                      } */}
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
  socket,
  productId,
  dealSellerRating = 0,
}) => {
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  console.log(selectedContact, 23);
  const [messageText, setMessageText] = useState('');

  // Attachment local UI state
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAttachment, setUploadedAttachment] = useState(null);
  const navigate = useNavigate();
  // Budget dialog
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    const payload = { productId: productId };
    socket.emit(SOCKET_EVENTS.PRODUCT_SOLD, payload);

    socket.once(SOCKET_EVENTS.PRODUCT_SOLD, ({ isSoldProduct }) => {
      if (isSoldProduct) {
        toast.error('This product has already been sold!');
      } else {
        setShowBudgetDialog(true);
      }
    });
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
      <BudgetInputDialog
        open={showBudgetDialog}
        setOpen={setShowBudgetDialog}
        onConfirm={handleBudgetConfirm}
        loading={isClosingDeal}
      />

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
                <div className="flex items-center gap-3 ">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(
                        '/user-profile/' +
                          (selectedContact.buyerId === currentUserId
                            ? selectedContact.sellerId
                            : selectedContact.buyerId)
                      );
                    }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <h3 className="font-semibold text-gray-700">{selectedContact.name}</h3>
                      {/* product Rating */}
                      {dealSellerRating > 0 && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= dealSellerRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                          {/* <span className="text-xs text-gray-500 ml-1">{dealSellerRating}/5</span> */}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full `} />
                      {/* ${isOnline ? 'bg-green-600' : 'bg-red-600'} */}
                      <span className={`text-sm font-medium `}>
                        {/* ${isOnline ? 'text-green-600' : 'text-red-600'} */}
                        {/* {isOnline ? 'Online' : 'Offline'} */}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: close-deal button (visible to buyer, or when deal is closed/rejected) */}
                {/* ── Close Deal / Deal Status Button ── */}
                {userType === 'buyer' ? (
                  <Button
                    size="sm"
                    className={`${
                      isDealClosed
                        ? 'bg-green-600 hover:bg-green-600 text-white border-green-600 cursor-default'
                        : waitingSellerApproval
                          ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600 cursor-default'
                          : isDealRejected
                            ? 'bg-red-500 hover:bg-red-500 text-white border-red-500 cursor-not-allowed'
                            : 'text-orange-600 hover:text-orange-600 bg-transparent cursor-pointer hover:bg-transparent border-orange-600'
                    } w-24 sm:w-auto px-4 text-sm font-medium`}
                    onClick={() => {
                      if (!isDealClosed && !isDealRejected && !waitingSellerApproval) {
                        handleCloseDealClick();
                      }
                    }}
                    disabled={
                      isClosingDeal ||
                      isDealClosed ||
                      isDealRejected ||
                      waitingSellerApproval ||
                      messages.length === 0
                    }
                  >
                    {isClosingDeal
                      ? 'Closing...'
                      : isDealClosed
                        ? 'Deal Closed'
                        : waitingSellerApproval
                          ? 'Deal in Progress'
                          : isDealRejected
                            ? 'Deal Rejected'
                            : 'Close Deal'}
                  </Button>
                ) : (
                  (isDealClosed || isDealRejected) && (
                    <Button
                      disabled={
                        isClosingDeal ||
                        isDealClosed ||
                        isDealRejected ||
                        waitingSellerApproval ||
                        messages.length === 0
                      }
                      size="sm"
                      className={`px-4 text-sm font-medium cursor-default ${
                        isDealClosed
                          ? 'bg-green-600 hover:bg-green-600 text-white border-green-600'
                          : 'bg-red-500 hover:bg-red-500 text-white border-red-500'
                      }`}
                    >
                      {isDealClosed ? 'Deal Closed' : 'Deal Rejected'}
                    </Button>
                  )
                )}

                {/* ✅ Seller sees "Deal Closed" / "Deal Rejected" as a read-only badge after refresh */}
                {/* {userType === 'seller' && (isDealClosed || isDealRejected) && (
                  <span
                    className={`px-4 py-1.5 rounded text-sm font-medium border ${
                      isDealClosed
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-red-100 text-red-600 border-red-200'
                    }`}
                  >
                    {isDealClosed ? 'Deal Closed' : 'Deal Rejected'}
                  </span>
                )} */}
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
            {/* <div
              className={`p-2 rounded-full border-2 border-gray-500 ${
                isSelfChat || isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-gray-100'
              }`}
              onClick={() => !isSelfChat && !isUploading && fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4 text-gray-700" />
            </div> */}

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
      <RatingPopup
        open={showRatingPopup}
        setOpen={setShowRatingPopup}
        chatId={lastClosedChatId || selectedContact?._id || ''}
        onSubmit={onSubmitRating}
        loading={ratingLoading}
      />

      {/* Approval popup */}
      <ApprovalPopup
        open={showApprovalPopup}
        setOpen={setShowApprovalPopup}
        dealId={closedDealId || ''}
        budget={finalBudget}
        partnerName={selectedContact?.name || 'Buyer'}
        onAction={onDealApproval}
        loading={approvalLoading}
      />
    </>
  );
};

// ─────────────────────────────────────────────
// Chatbot — root layout component
// ─────────────────────────────────────────────
const Chatbot = () => {
  const socket = useSocket();
  const location = useLocation();
  const {
    updateChatState,
    updateMessages,
    updateAddMessages,
    updateLastMessage,
    updateSetActiveRoom,
    updateMarkRoomRead,
    updateUserStatus,
    updateSetRecentChats,
  } = useDispatchChat();
  const { recentChats, messages, onlineUsers } = useChatState();
  const [loading, setLoading] = useState(false);
  const { user } = useUserState();
  const [searchParams] = useSearchParams();
  const [focusTile, setFocusTile] = useState(-1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const autoSelectedKeyRef = useRef(null);
  const state = location.state || {};
  const buyerId = state.buyerId;
  const productName = state.productName;
  const sellerId = state.sellerId;
  const incomingRoomId = state.roomId; // passed from navbar click
  const productId = state.productId;
  const selectedContactRef = useRef(null);

  const currentUserId = user?._id;
  const userType = selectedContact
    ? selectedContact.buyerId === currentUserId
      ? 'buyer'
      : 'seller'
    : 'buyer';
  const isBuyerRole = state.isBuyer !== undefined ? state.isBuyer : buyerId === currentUserId;
  const partnerIdToFetch = isBuyerRole ? sellerId : buyerId;

  // ── Deal state ───────────────────────────────
  const [isClosingDeal, setIsClosingDeal] = useState(false);
  const [isDealClosed, setIsDealClosed] = useState(false);
  const [isDealRejected, setIsDealRejected] = useState(false);
  const [waitingSellerApproval, setWaitingSellerApproval] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [finalBudget, setFinalBudget] = useState(0);
  const [closedDealId, setClosedDealId] = useState(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [lastClosedChatId, setLastClosedChatId] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [pendingDealId, setPendingDealId] = useState(null);
  const [pendingDealAmount, setPendingDealAmount] = useState(0);
  const [dealSellerRating, setDealSellerRating] = useState(0);
  // Replace your existing auto-select useEffect with this:
  useEffect(() => {
    if (!productId || !sellerId) return;

    const navKey = `${sellerId}_${productId}`;

    //  Already handled this navigation → don't interfere with manual selections
    if (autoSelectedKeyRef.current === navKey) return;

    if (recentChats.length > 0) {
      const tileIndex = recentChats.findIndex(
        item => item.productId === productId && item.sellerId === sellerId
      );
      setFocusTile(tileIndex);

      if (tileIndex !== -1) {
        autoSelectedKeyRef.current = navKey; // mark as handled
        handleSelectContact(recentChats[tileIndex]);
      }
    }
  }, [recentChats, productId, sellerId, location]);

  useEffect(() => {
    if (!socket) return;

    const handleDealStatusUpdate = ({
      roomId: updatedRoomId,
      dealId,
      status,
      amount,
      sellerRating,
    }) => {
      setClosedDealId(dealId);
      setFinalBudget(amount);
      setDealSellerRating(sellerRating ?? 0);
      if (status === 'waiting_seller_approval') {
        setIsClosingDeal(false);
        setWaitingSellerApproval(true);
        setIsBuyer(true);
        setIsDealClosed(false);
        setIsDealRejected(false);
      }

      if (status === 'completed') {
        setIsDealClosed(true);
        setWaitingSellerApproval(false);
        setShowApprovalPopup(false);
        setIsClosingDeal(false);
        setIsDealRejected(false);
        setIsBuyer(false);
        setIsSeller(false);
        const amISeller = selectedContactRef.current?.sellerId === currentUserId;
        const alreadyRated = sellerRating > 0;
        if (amISeller && !alreadyRated) {
          setLastClosedChatId(dealId);
          setShowRatingPopup(true);
        }
      }

      if (status === 'rejected') {
        setIsDealRejected(true);
        setWaitingSellerApproval(false);
        setShowApprovalPopup(false);
        setIsClosingDeal(false);
        setIsDealClosed(false);
      }
    };

    socket.on(SOCKET_EVENTS.DEAL_STATUS_UPDATE, handleDealStatusUpdate);
    return () => socket.off(SOCKET_EVENTS.DEAL_STATUS_UPDATE, handleDealStatusUpdate);
  }, [socket]);

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  // ── PENDING_DEAL listener — seller sees popup (live or on refresh via JOIN_ROOM)
  useEffect(() => {
    if (!socket) return;

    const handlePendingDeal = ({ dealId, amount, roomId: dealRoomId }) => {
      // Only show popup if this deal belongs to the active chat room
      // OR store it so it shows when seller opens that room
      setPendingDealId(dealId);
      setPendingDealAmount(amount);
      setClosedDealId(dealId);
      setFinalBudget(amount);
      setWaitingSellerApproval(true);
      setIsSeller(true);
      setShowApprovalPopup(true);
    };

    socket.on(SOCKET_EVENTS.PENDING_DEAL, handlePendingDeal);
    return () => socket.off(SOCKET_EVENTS.PENDING_DEAL, handlePendingDeal);
  }, [socket]);

  // ── FIXED: Single CHAT_USER effect — emits AND handles response ──────────
  useEffect(() => {
    if (!socket || !partnerIdToFetch) return;

    // ✅ Emit so server responds with seller data
    socket.emit(SOCKET_EVENTS.CHAT_USER, partnerIdToFetch);

    const handleChatUser = userData => {
      // Use incomingRoomId from navbar if available, otherwise build it
      const roomId =
        incomingRoomId ||
        [buyerId, userData._id, searchParams.get('productId')].filter(Boolean).join('_');

      const contactEntry = {
        roomId,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        avatar: userData.profileImage || '',
        // ✅ Correctly assign buyerId/sellerId regardless of who's logged in
        buyerId: isBuyerRole ? currentUserId : userData._id,
        sellerId: isBuyerRole ? userData._id : currentUserId,
        productId: searchParams.get('productId'),
        productName,
        isOnline: false,
        chatrating: 0,
        lastMessage: null,
        buyerUnreadCount: 0,
        sellerUnreadCount: 0,
      };

      updateChatState(contactEntry);

      // Auto-select and join if we came from navbar with a known roomId
      if (incomingRoomId) {
        setSelectedContact(contactEntry);
        updateMessages([]);
        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
          roomId,
          buyerId: contactEntry.buyerId,
          sellerId: contactEntry.sellerId,
          productId: searchParams.get('productId'),
        });
        socket.emit(SOCKET_EVENTS.MARK_READ, {
          roomId,
          readerType: isBuyerRole ? 'buyer' : 'seller',
        });
      }
    };

    socket.on(SOCKET_EVENTS.CHAT_USER, handleChatUser);
    return () => socket.off(SOCKET_EVENTS.CHAT_USER, handleChatUser);
  }, [sellerId]); // ✅ Only one effect, no duplicate

  // For Status Online and offline

  useEffect(() => {
    if (!socket || !selectedContact) return;

    const userType = selectedContact
      ? selectedContact.buyerId === currentUserId
        ? 'buyer'
        : 'seller'
      : isBuyerRole
        ? 'buyer'
        : 'seller';

    const partnerId = selectedContact
      ? userType === 'buyer'
        ? selectedContact.sellerId
        : selectedContact.buyerId
      : null;

    // Ask server if partner is currently online
    socket.emit(SOCKET_EVENTS.USER_STATUS, { targetUserId: partnerId });

    const handleStatus = ({ userId, isOnline }) => {
      updateUserStatus({ userId, isOnline });
    };

    socket.on(SOCKET_EVENTS.USER_STATUS, handleStatus);
    return () => socket.off(SOCKET_EVENTS.USER_STATUS, handleStatus);
  }, [selectedContact?.roomId]);

  // ── Incoming messages ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleReceive = ({ roomId, message, messages: allMessages }) => {
      if (allMessages) {
        // Initial load from JOIN_ROOM
        updateMessages(
          allMessages.map(m => ({
            id: m.timestamp,
            text: m.message,
            senderId: m.senderId?.toString(), // ✅ ensure string for === comparison
            senderType: m.senderType,
            timestamp: m.timestamp,
            attachment: m.attachment,
          }))
        );
        return;
      }

      // Live incoming message
      updateAddMessages({
        id: message.timestamp,
        text: message.message,
        senderId: message.senderId?.toString(), // ✅ ensure string
        senderType: message.senderType,
        timestamp: message.timestamp,
        attachment: message.attachment,
      });

      updateLastMessage({
        roomId,
        lastMessage: { message: message.message, timestamp: message.timestamp },
      });
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceive);
    return () => socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceive);
  }, [socket]);

  // Add this effect in Chatbot to listen for USER_CHATS and populate sidebar
  useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.GET_USER_CHATS);

    const handleUserChats = chats => {
      updateSetRecentChats(chats);

      // ✅ Also refresh selectedContact with fresh productName from server
      setSelectedContact(prev => {
        if (!prev) return prev;
        const fresh = chats.find(c => c.roomId === prev.roomId);
        return fresh ? { ...prev, ...fresh } : prev;
      });
    };

    socket.on(SOCKET_EVENTS.USER_CHATS, handleUserChats);
    return () => socket.off(SOCKET_EVENTS.USER_CHATS, handleUserChats);
  }, [socket, location.state]);

  // ── Select contact ────────────────────────────────────────────────────────
  const handleSelectContact = contact => {
    setDealSellerRating(0);
    setLoading(true);
    setIsClosingDeal(false);
    setIsDealClosed(false);
    setIsDealRejected(false);
    setWaitingSellerApproval(false);
    setIsSeller(false);
    setIsBuyer(false);
    setFinalBudget(0);
    setClosedDealId(null);
    setShowApprovalPopup(false);

    setSelectedContact(contact);
    updateMessages([]);
    updateSetActiveRoom(contact.roomId);
    updateMarkRoomRead({ roomId: contact.roomId, readerType: userType });
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId: contact.roomId,
      buyerId: contact.buyerId,
      sellerId: contact.sellerId,
      productId: contact.productId || searchParams.get('productId'),
    });
    socket.emit(SOCKET_EVENTS.MARK_READ, { roomId: contact.roomId, readerType: userType });
    setTimeout(() => {
      socket.emit(SOCKET_EVENTS.GET_USER_CHATS);
    }, 300);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSendMessage = (messageText, attachment) => {
    if (!selectedContact) return;
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      roomId: selectedContact.roomId,
      message: messageText,
      senderType: userType,
      attachment: attachment || null,
    });
  };

  const handleCloseDeal = amount => {
    if (!selectedContact) return;
    setIsClosingDeal(true);
    // trigger the socket of seller Approval
    socket.emit(SOCKET_EVENTS.DEAL_CLOUSER, {
      roomId: selectedContact.roomId,
      buyerId: selectedContact.buyerId,
      sellerId: selectedContact.sellerId,
      productId: selectedContact.productId,
      amount,
    });
  };
  const handleSubmitRating = (chatId, rating) => {
    if (!chatId || !rating) return;
    setRatingLoading(true);

    socket.emit(SOCKET_EVENTS.DEAL_RATING, { dealId: chatId, rating });

    socket.once(SOCKET_EVENTS.DEAL_RATING, ({ success }) => {
      setRatingLoading(false);
      if (success) setShowRatingPopup(false);
    });
  };

  const handleDealApproval = (dealId, action) => {
    if (!selectedContact) return;
    setApprovalLoading(true);

    socket.emit(SOCKET_EVENTS.DEAL_APPROVAL, {
      dealId,
      action, // 'accept' | 'reject'
      roomId: selectedContact.roomId,
    });

    setApprovalLoading(false);
    setShowApprovalPopup(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 mb-5">
          <div className="h-[calc(100vh-100px)] border-chat-border rounded-lg overflow-hidden sm:mt-5">
            <div className="flex h-full gap-2">
              {/* Sidebar */}
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
                    focusTile={focusTile}
                  />
                )}
              </div>

              {/* Main area */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Mobile header */}
                <div className="md:hidden py-2 border-chat-border bg-chat-sidebar">
                  <div className="flex items-center gap-x-2">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="md">
                          <TooltipComp
                            hoverChildren={<PanelRightOpen className="h-8 w-8" />}
                            contentChildren={<p>Remove Doc</p>}
                          />
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
                    <h2 className="text-md sm:text-lg font-semibold text-foreground">Messages</h2>
                  </div>
                </div>

                {selectedContact ? (
                  <ChatArea
                    selectedContact={selectedContact}
                    userType={userType}
                    currentUserId={currentUserId}
                    messages={messages}
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
                    socket={socket}
                    productId={productId}
                    dealSellerRating={dealSellerRating}
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
                        <p className="text-sm">
                          Choose a contact from the sidebar to start messaging
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
