import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Menu,
  Paperclip,
  Star,
  PanelRightIcon,
  PanelRightOpen,
  X,
  Download,
  Handshake,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';
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
import pdfImage from '/pdf_img.png';
import { useFetch } from '@/hooks/useFetch';
import bucketService from '@/services/bucket.service';
import bidService from '@/services/bid.service';
import { formatSize } from '@/utils/sizeFormatter';
import { currencyConvertor } from '@/utils/currencyConvertor';
// ─────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────
const fmt = val => (val && val !== '' ? val.replace(/_/g, ' ') : null);
const fmtDate = val => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d) ? null : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─────────────────────────────────────────────
// QuoteDetailsPanel — supplier proof card
// ─────────────────────────────────────────────
const QuoteDetailsPanel = ({ quote, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-xs text-slate-400 animate-pulse">Loading quote details…</div>
      </div>
    );
  }
  if (!quote) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 bg-slate-50 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-300" />
        </div>
        <p className="text-xs text-slate-400">No quote details available</p>
      </div>
    );
  }

  const seller = quote.sellerId || {};
  const biz = quote.businessDets || {};

  const sections = [
    {
      heading: 'Quote Summary',
      color: 'orange',
      rows: [
        { label: 'Quoted Price', value: quote.budgetQuation ? `₹ ${Number(quote.budgetQuation).toLocaleString('en-IN')}` : null },
        { label: 'Brand Available', value: fmt(quote.availableBrand) },
        { label: 'Earliest Delivery', value: fmtDate(quote.earliestDeliveryDate) },
        { label: 'Location', value: fmt(quote.location) },
      ],
    },
    {
      heading: 'Terms & Logistics',
      color: 'blue',
      rows: [
        { label: 'Seller Type', value: fmt(quote.sellerType) },
        { label: 'Price Basis', value: fmt(quote.priceBasis) },
        { label: 'Taxes', value: fmt(quote.taxes) },
        { label: 'Freight Terms', value: fmt(quote.freightTerms) },
        { label: 'Payment Terms', value: fmt(quote.paymentTerms) },
      ],
    },
    {
      heading: 'Business Identity',
      color: 'green',
      rows: [
        { label: 'Business Type', value: fmt(quote.businessType) },
        { label: 'Company Name', value: biz.company_name || null },
        { label: 'Company Reg No', value: biz.company_reg_num || null },
        { label: 'GST Number', value: biz.gst_num || null },
        { label: 'GST (Profile)', value: seller.gstin || null },
      ],
    },
    {
      heading: 'Supplier Profile',
      color: 'purple',
      rows: [
        { label: 'Name', value: seller.firstName ? `${seller.firstName} ${seller.lastName || ''}`.trim() : null },
        { label: 'Business Name', value: seller.businessName || null },
        { label: 'Categories', value: seller.supplierCategories || null },
        { label: 'Phone', value: seller.phone ? seller.phone.toString().replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : null },
      ],
    },
  ];

  const colorMap = {
    orange: 'bg-orange-500',
    blue: 'bg-slate-500',
    green: 'bg-emerald-500',
    purple: 'bg-violet-500',
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      <div className="px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Supplier Quote Details</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Proof provided by supplier at time of quoting</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {sections.map(section => {
          const filledRows = section.rows.filter(r => r.value);
          if (filledRows.length === 0) return null;
          return (
            <div key={section.heading} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className={`flex items-center gap-2 px-3 py-2 ${colorMap[section.color]} bg-opacity-10`}
                style={{ background: section.color === 'orange' ? '#fff7ed' : section.color === 'blue' ? '#f8fafc' : section.color === 'green' ? '#f0fdf4' : '#faf5ff' }}>
                <span className={`w-1.5 h-1.5 rounded-full ${colorMap[section.color]}`} />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{section.heading}</p>
              </div>
              <div className="divide-y divide-slate-50">
                {filledRows.map(row => (
                  <div key={row.label} className="flex items-start justify-between gap-2 px-3 py-2">
                    <span className="text-[11px] text-slate-400 shrink-0 mt-px">{row.label}</span>
                    <span className="text-[11px] font-semibold text-slate-700 text-right capitalize break-all">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Note to buyer */}
        {quote.buyerNote && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">Note from Supplier</p>
            <p className="text-xs text-amber-800 leading-relaxed">{quote.buyerNote}</p>
          </div>
        )}

        {/* Quote status badge */}
        {quote.quoteStatus && (
          <div className={`rounded-xl px-3 py-2 text-center text-xs font-bold capitalize ${
            quote.quoteStatus === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' :
            quote.quoteStatus === 'shortlisted' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
            quote.quoteStatus === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-slate-100 text-slate-600'
          }`}>
            Quote Status: {quote.quoteStatus}
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header + Search */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
          <Input
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-orange-400"
          />
        </div>
      </div>

      {/* Contact Items */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
            <Search className="w-8 h-8 opacity-30" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          filteredContacts.map(contact => {
            const unreadCount =
              contact.buyerId === currentUserId
                ? contact.buyerUnreadCount || 0
                : contact.sellerUnreadCount || 0;

            const isSelected = contact.roomId === selectedContactId;
            const isOnline = contact.isOnline || false;

            const timeStr = contact.lastMessage?.timestamp
              ? (() => {
                  const d = new Date(contact.lastMessage.timestamp);
                  const now = new Date();
                  const isToday = d.toDateString() === now.toDateString();
                  return isToday
                    ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                })()
              : '';

            return (
              <div
                key={contact.roomId}
                ref={el => { contactRefs.current[filteredContacts.indexOf(contact)] = el; }}
                onClick={() => { if (!isSelected) onSelectContact(contact); }}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all border-b border-slate-50 ${
                  isSelected
                    ? 'bg-orange-50 border-l-[3px] border-l-orange-500'
                    : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
                }`}
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-bold">
                      {fallBackName(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  />
                </div>

                {/* Name + last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-sm font-semibold truncate ${isSelected ? 'text-orange-800' : 'text-slate-800'}`}>
                      {contact.name}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">{timeStr}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <p className="text-xs text-slate-500 truncate">
                      {contact.lastMessage?.message || 'Start the conversation'}
                    </p>
                    {!isSelected && unreadCount > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] bg-orange-500 text-white rounded-full px-1 text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {contact.productName && (
                    <p className="text-[10px] text-orange-500 font-medium truncate mt-0.5">
                      {contact.productName}
                    </p>
                  )}
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
  userType,
  currentUserId,
  messages = [],
  setMessages,
  isClosingDeal,
  isDealClosed,
  isDealRejected,
  waitingSellerApproval,
  isSeller,
  isBuyer,
  finalBudget,
  closedDealId,
  showRatingPopup,
  setShowRatingPopup,
  ratingLoading,
  lastClosedChatId,
  showApprovalPopup,
  setShowApprovalPopup,
  approvalLoading,
  pendingDealTerms,
  onSendMessage,
  onCloseDeal,
  onSubmitRating,
  onDealApproval,
  isOnline,
  socket,
  productId,
  dealSellerRating = 0,
  // Quote panel
  showQuotePanel,
  setShowQuotePanel,
  quoteDetails,
  quoteLoading,
}) => {
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageText, setMessageText] = useState('');

  // Attachment local UI state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewObjectURL, setPreviewObjectURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAttachment, setUploadedAttachment] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const navigate = useNavigate();
  // Budget dialog
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const {
    fn: uploadFileFN,
    data: uploadFileRes,
    loading: uploadFileLoading,
  } = useFetch(bucketService.uploadFile);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ── File handling ──────────────────────────
  const handleFileSelect = async e => {
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
      toast.error('Invalid file type. Only images and documents are allowed.');
      return;
    }
    setSelectedFile(file);
    console.log('Selected file:', file);

    if (previewObjectURL) URL.revokeObjectURL(previewObjectURL);

    if (file.type.startsWith('image/')) {
      setPreviewObjectURL(URL.createObjectURL(file));
      setSelectedFileType('image');
    } else {
      setPreviewObjectURL(file);
      setSelectedFileType('document');
    }

    // TODO: call your upload service here
    // Example:
    // setIsUploading(true);
    // uploadFile(file).then(data => { setUploadedAttachment(data); setIsUploading(false); });
  };

  async function uploadToServer(file) {
    if (!file) return toast.error('No file selected for upload');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadFileFN(formData);
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (uploadFileRes) {
      console.log(uploadFileRes, 'Uploaded file response');
      setUploadedAttachment(uploadFileRes);
      onSendMessage?.(messageText, uploadFileRes);
      setMessageText('');
      clearAttachment();
    }
  }, [uploadFileRes]);

  const clearAttachment = () => {
    setSelectedFile(null);
    if (previewObjectURL) URL.revokeObjectURL(previewObjectURL);
    setPreviewObjectURL(null);
    setSelectedFileType(null);
    setUploadedAttachment(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      if (previewObjectURL) URL.revokeObjectURL(previewObjectURL);
    };
  }, [previewObjectURL]);

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

  const handleBudgetConfirm = (amount, agreedTerms) => {
    setShowBudgetDialog(false);
    onCloseDeal?.(amount, agreedTerms);
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

  async function downloadFile(path, fileName) {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  // ── Self-chat guard ────────────────────────
  const actualBuyerId = selectedContact?.buyerId;
  const actualSellerId = selectedContact?.sellerId;
  const isSelfChat =
    (currentUserId === actualBuyerId && currentUserId === actualSellerId) ||
    actualBuyerId === actualSellerId;

  // ── Empty state ────────────────────────────
  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">
          <p className="text-sm">Select a conversation to start</p>
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

      <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
      {/* ── Chat column ── */}
      <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
        {(previewObjectURL || selectedFileType === 'document') && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/5">
            <div className="relative w-[420px] rounded-xl bg-gray-50 p-6 shadow-md flex flex-col items-center gap-5">
              {/* Close Button */}
              <button
                onClick={clearAttachment}
                className="absolute top-3 right-3 bg-orange-100 text-orange-500 rounded-md p-1 cursor-pointer hover:bg-orange-200"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Preview Image */}
              {selectedFileType === 'image' ? (
                <img
                  src={previewObjectURL}
                  alt="Preview"
                  className="h-40 w-40 object-contain rounded-lg"
                />
              ) : (
                <img
                  src={pdfImage}
                  alt="Document preview"
                  className="h-40 w-40 object-contain rounded-lg"
                />
              )}

              {/* File Info */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground break-all">
                  File Name: {selectedFile?.name}
                </p>

                <small className="text-xs text-muted-foreground">
                  File Size: {selectedFile ? formatSize(selectedFile.size) : 'Unknown'}
                </small>
              </div>

              {/* Submit Button */}
              <Button
                onClick={() => {
                  if (selectedFile && !uploadFileLoading) {
                    uploadToServer(selectedFile);
                  }
                }}
                type="button"
                disabled={uploadFileLoading}
                className="w-32 bg-orange-600 border-2 border-orange-600 text-white hover:bg-orange-700 cursor-pointer"
              >
                {uploadFileLoading ? 'Uploading...' : 'Send Attachment'}
              </Button>
            </div>
          </div>
        )}
        {/* ── Chat Header ── */}
        <div className="border-b border-slate-200 bg-white">
          {/* Product tag */}
          <div className="px-4 py-1.5 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
            <p className="text-xs text-orange-700 font-semibold truncate">
              {selectedContact.productName || 'Product Discussion'}
            </p>
          </div>

          {/* Avatar / name / deal button */}
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            {/* Left: avatar + name */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="cursor-pointer shrink-0"
                onClick={() =>
                  navigate(
                    '/user-profile/' +
                      (selectedContact.buyerId === currentUserId
                        ? selectedContact.sellerId
                        : selectedContact.buyerId)
                  )
                }
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-sm">
                      {fallBackName(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
                  {selectedContact.name}
                </h3>
                {dealSellerRating > 0 ? (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= dealSellerRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Close Deal button */}
            {userType === 'buyer' ? (
              <Button
                size="sm"
                className={`shrink-0 text-xs font-semibold px-3 h-8 rounded-lg transition-all ${
                  isDealClosed
                    ? 'bg-green-600 hover:bg-green-600 text-white cursor-default'
                    : waitingSellerApproval
                      ? 'bg-orange-500 hover:bg-orange-500 text-white cursor-default'
                      : isDealRejected
                        ? 'bg-red-500 hover:bg-red-500 text-white cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm shadow-orange-200'
                }`}
                onClick={() => {
                  if (!isDealClosed && !isDealRejected && !waitingSellerApproval) {
                    handleCloseDealClick();
                  }
                }}
                disabled={
                  isClosingDeal || isDealClosed || isDealRejected || waitingSellerApproval || messages.length === 0
                }
              >
                {isClosingDeal
                  ? 'Closing…'
                  : isDealClosed
                    ? '✓ Deal Closed'
                    : waitingSellerApproval
                      ? 'Awaiting Seller'
                      : isDealRejected
                        ? 'Deal Rejected'
                        : 'Close Deal'}
              </Button>
            ) : (
              (isDealClosed || isDealRejected) && (
                <span
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                    isDealClosed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {isDealClosed ? '✓ Deal Closed' : 'Deal Rejected'}
                </span>
              )
            )}
            {/* Quote panel toggle */}
            <button
              onClick={() => setShowQuotePanel(p => !p)}
              title="View supplier quote details"
              className={`shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer ${
                showQuotePanel
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <PanelRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Messages Area ── */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ background: 'linear-gradient(180deg, #fff8f4 0%, #ffffff 60%)' }}
        >
          {/*  messages */}

          {isSelfChat ? (
            <div className="text-center text-red-500 font-semibold">
              Cannot send messages to yourself. Buyer and seller must be different users.
            </div>
          ) : (
            messages.map((message, index) => {
              const isMine = message.senderId === currentUserId && message.senderType === userType;
              // console.log('MSG DEBUG:', {
              //   senderId: message.senderId,
              //   currentUserId,
              //   senderType: message.senderType,
              //   userType,
              //   isMine,
              //   hasAttachment: !!message.attachment?.url,
              //   attachmentUrl: message.attachment,
              //   text: message.text,
              // });
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
                  <div className={`flex gap-2.5 items-end ${isMine ? 'justify-end' : 'justify-start'}`}>
                    {!isMine && (
                      <Avatar className="h-8 w-8 flex-shrink-0 mb-6">
                        <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                        <AvatarFallback>{selectedContact.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[320px] sm:max-w-md relative px-4 py-2.5 shadow-xs ${
                          isMine
                            ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-2xl rounded-tr-xs'
                            : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-xs'
                        }`}
                      >
                        {/* Attachment */}
                        {message.attachment?.url && (
                          <div className="relative mb-1">
                            {message.attachment.type === 'image' ? (
                              <img
                                src={message.attachment.url}
                                alt={message.attachment.fileName}
                                className="max-w-[200px] max-h-[200px] w-auto h-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(message.attachment.url, '_blank')}
                              />
                            ) : (
                              <div
                                className={`flex items-center gap-3 rounded-lg p-3 w-[200px] ${
                                  isMine ? 'bg-white/10 text-white' : 'bg-slate-200/80 text-slate-800'
                                }`}
                                title={message.attachment.fileName || 'Document'}
                              >
                                <img
                                  src={pdfImage}
                                  alt="document"
                                  className="h-10 w-10 object-contain flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium truncate">
                                    {message.attachment.fileName || 'Document'}
                                  </p>
                                  {message.attachment.fileSize && (
                                    <p className="text-xs opacity-60 mt-0.5">
                                      {formatSize(message.attachment.fileSize)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            <div
                              className="absolute z-10 top-1 right-1 bg-orange-100 text-orange-500 rounded-sm p-1 cursor-pointer"
                              onClick={() => {
                                downloadFile(message.attachment.url, message.attachment.fileName);
                              }}
                            >
                              <TooltipComp
                                hoverChildren={<Download className="h-4 w-4" />}
                                contentChildren={<p>Download</p>}
                              ></TooltipComp>
                            </div>
                          </div>
                        )}

                        {/* Text */}
                        {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
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
                  </div>
                </React.Fragment>
              );
            })
          )}

          {/* Inline Deal Status Banners */}
          {waitingSellerApproval && (
            <div className="p-4 rounded-xl border animate-fade-in shadow-xs max-w-2xl mx-auto w-full bg-orange-50 border-orange-200 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500 p-2.5 rounded-full text-white shrink-0 mt-0.5 animate-pulse">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-orange-950">⚡ Deal Awaiting Seller Approval</h4>
                    <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
                      {userType === 'seller'
                        ? `The buyer has requested to close this deal at a final price of ₹${finalBudget}.`
                        : `You have requested to close this deal at a final price of ₹${finalBudget}. Awaiting supplier's response.`}
                    </p>
                  </div>
                </div>
                {userType === 'seller' && (
                  <Button
                    size="sm"
                    className="bg-orange-600 text-white hover:bg-orange-700 font-medium whitespace-nowrap cursor-pointer shadow-sm"
                    onClick={() => setShowApprovalPopup(true)}
                  >
                    Accept / Decline Deal
                  </Button>
                )}
              </div>
            </div>
          )}

          {isDealClosed && (
            <div className="p-4 rounded-xl border shadow-xs max-w-2xl mx-auto w-full bg-green-50 border-green-200 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 p-2.5 rounded-full text-white shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-950">🎉 Deal Closed Successfully!</h4>
                  <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                    This deal has been accepted and closed at <span className="font-bold text-sm">₹{finalBudget}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isDealRejected && (
            <div className="p-4 rounded-xl border shadow-xs max-w-2xl mx-auto w-full bg-red-50 border-red-200 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-500 p-2.5 rounded-full text-white shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-950">❌ Deal Declined</h4>
                  <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                    The requested deal closure at ₹{finalBudget} was rejected.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Message Input ── */}
        <div className="p-3 border-t border-slate-200 bg-white">
          {/* Attachment preview */}
          {/* {(selectedFile || uploadedAttachment) && (
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
          )} */}

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
      </div>{/* end chat column */}

      {/* ── Quote details panel ── */}
      {showQuotePanel && (
        <div className="hidden md:flex w-72 shrink-0 flex-col border-l border-slate-200">
          <QuoteDetailsPanel quote={quoteDetails} loading={quoteLoading} />
        </div>
      )}
      </div>{/* end flex row */}

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
        terms={pendingDealTerms}
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
  const [pendingDealTerms, setPendingDealTerms] = useState(null);
  const [dealSellerRating, setDealSellerRating] = useState(0);
  const [showQuotePanel, setShowQuotePanel] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
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

    const handlePendingDeal = ({ dealId, amount, roomId: dealRoomId, agreedTerms }) => {
      // Only show popup if this deal belongs to the active chat room
      // OR store it so it shows when seller opens that room
      setPendingDealId(dealId);
      setPendingDealAmount(amount);
      setPendingDealTerms(agreedTerms || null);
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
    setQuoteDetails(null);
    // Fetch quote proof details for this product+seller pair
    const pId = contact.productId;
    const sId = contact.sellerId;
    if (pId && sId) {
      setQuoteLoading(true);
      bidService.getBidByProductIdAndSellerId(pId, sId)
        .then(data => setQuoteDetails(data))
        .catch(() => setQuoteDetails(null))
        .finally(() => setQuoteLoading(false));
    }
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

  const handleCloseDeal = (amount, agreedTerms) => {
    if (!selectedContact) return;
    setIsClosingDeal(true);
    // trigger the socket of seller Approval
    socket.emit(SOCKET_EVENTS.DEAL_CLOUSER, {
      roomId: selectedContact.roomId,
      buyerId: selectedContact.buyerId,
      sellerId: selectedContact.sellerId,
      productId: selectedContact.productId,
      amount,
      agreedTerms: agreedTerms || {},
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
          <div className="h-[calc(100vh-80px)] border border-slate-200 rounded-xl overflow-hidden sm:mt-4 shadow-sm">
            <div className="flex h-full gap-2">
              {/* Sidebar */}
              <div className="hidden md:block w-72 border-r border-slate-200 shrink-0">
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
                <div className="md:hidden flex items-center gap-2 px-3 py-2.5 border-b border-slate-200 bg-white">
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
                        <PanelRightOpen className="h-5 w-5" />
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
                  <h2 className="text-sm font-bold text-slate-800">Messages</h2>
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
                    pendingDealTerms={pendingDealTerms}
                    onSendMessage={handleSendMessage}
                    onCloseDeal={handleCloseDeal}
                    onSubmitRating={handleSubmitRating}
                    onDealApproval={handleDealApproval}
                    isOnline={selectedContact?.isOnline || false}
                    socket={socket}
                    productId={productId}
                    dealSellerRating={dealSellerRating}
                    showQuotePanel={showQuotePanel}
                    setShowQuotePanel={setShowQuotePanel}
                    quoteDetails={quoteDetails}
                    quoteLoading={quoteLoading}
                  />
                ) : (
                  <div
                    className="flex-1 flex items-center justify-center"
                    style={{ background: 'linear-gradient(180deg, #fff8f4 0%, #ffffff 60%)' }}
                  >
                    {recentChats.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 text-center px-6">
                        <img src="no-chat.webp" alt="" className="h-24 w-24 opacity-60" />
                        <p className="text-sm font-semibold text-slate-600">No conversations yet</p>
                        <p className="text-xs text-slate-400">Click "Chat Now" on an RFQ to start a conversation with a supplier</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center px-6">
                        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                          <Send className="w-6 h-6 text-orange-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">Select a conversation</p>
                        <p className="text-xs text-slate-400">Choose from the sidebar to continue</p>
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
