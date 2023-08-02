import { createSlice } from "@reduxjs/toolkit";

const saveStateToStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("authState", serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const loadStateFromStorage = () => {
  try {
    const serializedState = sessionStorage.getItem("authState");
    if (serializedState === null) {
      return undefined; // If there is no saved state, return undefined to use the initialState from the authSlice.js
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadStateFromStorage() || {
    user: null,
    token: null,
  },
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      saveStateToStorage(state);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      saveStateToStorage(state);
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
