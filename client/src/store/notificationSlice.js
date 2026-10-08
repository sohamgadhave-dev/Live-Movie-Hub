import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    events: [],           // Latest 10 SSE events
    toasts: [],           // Active toast notifications
    connectionStatus: 'connecting', // 'connecting' | 'live' | 'disconnected'
    unreadCount: 0,
  },
  reducers: {
    addEvent: (state, action) => {
      state.events.unshift(action.payload); // Newest on top
      if (state.events.length > 10) {
        state.events = state.events.slice(0, 10);
      }
      state.unreadCount += 1;
    },
    addToast: (state, action) => {
      state.toasts.push({
        ...action.payload,
        id: Date.now() + Math.random(),
      });
      // Max 5 toasts at a time
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(-5);
      }
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  addEvent,
  addToast,
  removeToast,
  setConnectionStatus,
  resetUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
