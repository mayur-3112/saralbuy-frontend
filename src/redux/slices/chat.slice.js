import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    recentChats: [], // sidebar + navbar list
    messages: [], // active chat messages
    activeRoomId: null,
    onlineUsers: [],
  },
  reducers: {
    setRecentChats: (state, action) => {
      state.recentChats = action.payload;
    },
    // in chat.slice.js
    upsertContact: (state, action) => {
      const contact = action.payload;
      const idx = state.recentChats.findIndex(c => c.roomId === contact.roomId);
      if (idx === -1) {
        state.recentChats.unshift(contact);
      } else {
        // ✅ Only overwrite fields that are actually present and not null/undefined
        const existing = state.recentChats[idx];
        state.recentChats[idx] = {
          ...existing,
          ...Object.fromEntries(
            Object.entries(contact).filter(([_, v]) => v !== null && v !== undefined && v !== '')
          ),
          // ✅ Never overwrite productName if we already have a real one
          productName:
            existing.productName && existing.productName !== 'Product Discussion'
              ? existing.productName
              : contact.productName || existing.productName,
        };
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateLastMessage: (state, action) => {
      const { roomId, lastMessage, unreadField } = action.payload;
      const chat = state.recentChats.find(c => c.roomId === roomId);
      if (chat) {
        if (lastMessage) chat.lastMessage = lastMessage;
        if (unreadField) chat[unreadField] = (chat[unreadField] || 0) + 1;
      }
    },
    markRoomRead: (state, action) => {
      const { roomId, readerType } = action.payload;
      const chat = state.recentChats.find(c => c.roomId === roomId);
      if (chat) {
        const field = readerType === 'buyer' ? 'buyerUnreadCount' : 'sellerUnreadCount';
        chat[field] = 0;
      }
    },
    setActiveRoom: (state, action) => {
      state.activeRoomId = action.payload;
    },
    setUserOnline: (state, action) => {
      const { userId, isOnline, lastSeenAt, status } = action.payload;
      if (isOnline) {
        if (!state.onlineUsers.includes(userId)) {
          state.onlineUsers.push(userId);
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
      }

      // update presence and lastSeenAt across recent chat list
      state.recentChats = state.recentChats.map(chat => {
        const isPartner = chat.sellerId === userId || chat.buyerId === userId;
        if (!isPartner) return chat;
        return {
          ...chat,
          isOnline: isOnline,
          lastSeenAt: lastSeenAt !== undefined ? lastSeenAt : chat.lastSeenAt,
          status: status || chat.status,
        };
      });
    },
  },
});

export const {
  setRecentChats,
  upsertContact,
  setMessages,
  addMessage,
  updateLastMessage,
  markRoomRead,
  setActiveRoom,
  setUserOnline,
} = chatSlice.actions;

export default chatSlice.reducer;
