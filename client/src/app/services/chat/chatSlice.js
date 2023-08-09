import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//  todo: use socket virtual requests
const getChats = createAsyncThunk("chatApi/getChats", async (id) => {
  const response = await axios.get(`/api/chat/conversations/${id}`);
  return response.data;
});

const getContactedPerson = createAsyncThunk(
  "chatApi/getContactedPerson",
  async (id = null) => {
    const response = await axios.get("/api/chat/person-contacts");

    if (id) {
      const contacts = response.data.contacts;
      const isContactExist = contacts.some(
        (contact) => contact.id == id,
      );

      if (!isContactExist) {
        const newContact = await axios.get(`/api/user/${id}`);
        response.data.contacts = [
          ...response.data.contacts,
          newContact.data.user,
        ];
      }
    }
    return response.data;
  },
);

//  todo: use socket virtual requests
const sendChat = createAsyncThunk(
  "chatApi/sendChat",
  async (newChat) => {
    const response = await axios.post("/api/chat/send", newChat);
    return response.data;
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    contactedPerson: [],
    sendChatStatus: "idle",
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.chats = [];
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.chats = action.payload;
      })
      .addCase(getChats.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getContactedPerson.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.contactedPerson = [];
      })
      .addCase(getContactedPerson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.contactedPerson = action.payload.contacts;
      })
      .addCase(getContactedPerson.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(sendChat.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.sendChatStatus = "loading";
      })
      .addCase(sendChat.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.sendChatStatus = "succeeded";
      })
      .addCase(sendChat.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.sendChatStatus = "failed";
      });
  },
});

export { getChats, getContactedPerson, sendChat };
export default chatSlice.reducer;
