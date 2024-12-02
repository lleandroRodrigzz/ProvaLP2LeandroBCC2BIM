import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import messageReducer from '../features/messageSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    messages: messageReducer,
  },
});
