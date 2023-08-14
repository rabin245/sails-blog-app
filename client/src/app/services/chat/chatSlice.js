import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//  todo: use socket virtual requests
const getChats = createAsyncThunk("chatApi/getChats", async (id) => {
  const response = await axios.get(`/api/chat/conversations/${id}`);
  return response.data;
});

const markAsRead = createAsyncThunk("chatApi/markAsRead", async (id) => {
  console.log("Mark as read test");
  const response = await axios.put(`/api/chat/mark-read/${id}`);
  if (response.status === 200) {
    updateContactedPerson({ contactId: id, count: 0 });
  }
  console.log(response);
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

//  todo: use socket virtual requests
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
      const { contactId, count } = action.payload;
      const contactedPerson = state.contactedPerson.map((contact) => {
        if (contact.contact.id == contactId) {
          contact.count = count;
        }
        return contact;
      });
      state.contactedPerson = contactedPerson;
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
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(markAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(markAsRead.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { updateContactedPerson } = chatSlice.actions;

export { getChats, getContactedPerson, sendChat, markAsRead };
export default chatSlice.reducer;
