import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loadStateFromStorage } from "./services/auth/authSlice";
import { authApiService } from "./services/auth/authApiService";
import blogReducer from "./services/blog/blogSlice";
import chatReducer from "./services/chat/chatSlice";

const preloadedAuthState = loadStateFromStorage();

export const store = configureStore({
  reducer: {
    [authApiService.reducerPath]: authApiService.reducer,
    auth: authReducer,
    blog: blogReducer,
    chat: chatReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiService.middleware),
  preloadedState: {
    auth: preloadedAuthState,
  },
});
