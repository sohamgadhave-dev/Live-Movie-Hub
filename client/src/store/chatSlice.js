import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    users: [],
    connectionStatus: 'disconnected', // 'connecting' | 'connected' | 'disconnected'
    currentRoom: null,
    currentUsername: null,
    typingUsers: [],
    userCount: 0,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUserCount: (state, action) => {
      state.userCount = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    setCurrentUsername: (state, action) => {
      state.currentUsername = action.payload;
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter((u) => u !== action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
      state.users = [];
      state.currentRoom = null;
      state.typingUsers = [];
      state.userCount = 0;
    },
  },
});

export const {
  addMessage,
  setMessages,
  setUsers,
  setUserCount,
  setConnectionStatus,
  setCurrentRoom,
  setCurrentUsername,
  addTypingUser,
  removeTypingUser,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
