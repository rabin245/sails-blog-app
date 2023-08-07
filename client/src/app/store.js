import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loadStateFromStorage } from "./services/auth/authSlice";
import { authApiService } from "./services/auth/authApiService";
import { blogApiService } from "./services/blog/blogApiService";
import blogReducer from "./services/blog/blogSlice";
import chatReducer from "./services/chat/chatSlice";

const preloadedAuthState = loadStateFromStorage();

export const store = configureStore({
  reducer: {
    [authApiService.reducerPath]: authApiService.reducer,
    auth: authReducer,
    [blogApiService.reducerPath]: blogApiService.reducer,
    blog: blogReducer,
    chat: chatReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiService.middleware)
      .concat(blogApiService.middleware),
  preloadedState: {
    auth: preloadedAuthState,
  },
});
