import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    chat: chatReducer,
  },
});
