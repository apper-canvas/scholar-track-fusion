import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Configure Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Disable serializable check for user object
  }),
});