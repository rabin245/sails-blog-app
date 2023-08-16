import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//  todo: left to implement in the component
const getChats = createAsyncThunk("chatApi/getChats", async (id) => {
  const response = await axios.get(`/api/chat/conversations/${id}`);
  return response.data;
});

const markAsRead = createAsyncThunk("chatApi/markAsRead", async (id) => {
  const response = await axios.put(`/api/chat/mark-read/${id}`);
  return response.data;
});

const getContactedPerson = createAsyncThunk(
  "chatApi/getContactedPerson",
  async (id = null) => {
    const response = await axios.get("/api/chat/person-contacts");

    if (id) {
      const contacts = response.data.contacts;
      const isContactExist = contacts.some(
        (contact) => contact.contact.id == id
      );

      if (!isContactExist) {
        const newContact = await axios.get(`/api/user/${id}`);
        response.data.contacts = [
          ...response.data.contacts,
          { contact: newContact.data.user, count: 0 },
        ];
      }
    }
    console.log(response);
    return response.data;
  }
);

//  todo: left to implement in the component
const sendChat = createAsyncThunk("chatApi/sendChat", async (newChat) => {
  const response = await axios.post("/api/chat/send", newChat);
  return response.data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    contactedPerson: [],
    sendChatStatus: "idle",
    isLoading: false,
    isError: false,
    // noOfUnreadmesg: 0,
  },
  reducers: {
    updateContactedPerson: (state, action) => {
      const { contact, count } = action.payload;

      const indexToUpdate = state.contactedPerson.findIndex(
        (contactInfo) => contactInfo.contact.id == contact.id
      );

      console.log(indexToUpdate);

      if (indexToUpdate !== -1) {
        state.contactedPerson[indexToUpdate].count = count;
      } else {
        state.contactedPerson.push({ contact, count });
      }
    },
  },
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
        // state.noOfUnreadmesg = action.payload.unreadCounts.count;
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
      })
      .addCase(markAsRead.pending, (state) => {
        state.isError = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isError = false;

        const { sender } = action.payload;

        const indexToUpdate = state.contactedPerson.findIndex(
          (contactInfo) => contactInfo.contact.id == sender
        );

        if (indexToUpdate !== -1) {
          state.contactedPerson[indexToUpdate].count = 0;
        }
      })
      .addCase(markAsRead.rejected, (state) => {
        state.isError = true;
      });
  },
});

export const { updateContactedPerson } = chatSlice.actions;

export { getChats, getContactedPerson, sendChat, markAsRead };
export default chatSlice.reducer;
