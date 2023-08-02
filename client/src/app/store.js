import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loadStateFromStorage } from "./services/auth/authSlice";
import { authApiService } from "./services/auth/authApiService";

const preloadedState = loadStateFromStorage();

export const store = configureStore({
  reducer: {
    [authApiService.reducerPath]: authApiService.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiService.middleware),
  preloadedState,
});
