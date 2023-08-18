import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const markAsRead = createAsyncThunk("chatApi/markAsRead", async (id) => {
  const response = await axios.put(`/api/chat/mark-read/${id}`);
  return response.data;
});

const getContactedUsersList = createAsyncThunk(
  "chatApi/getContactedUsersList",
  async (id = null) => {
    let response;
    if (!id) {
      response = await axios.get("/api/chat/contact-list");
    } else {
      response = await axios.get(`/api/chat/contact-list/?id=${id}`);
    }

    console.log(response);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    contactedUsers: [],
    isLoading: false,
    isError: false,
  },
  reducers: {
    updateContactedUsersList: (state, action) => {
      const { contact, count } = action.payload;

      const indexToUpdate = state.contactedUsers.findIndex(
        (contactInfo) => contactInfo.contact.id == contact.id
      );

      console.log(indexToUpdate);

      if (indexToUpdate !== -1) {
        state.contactedUsers[indexToUpdate].count = count;
      } else {
        state.contactedUsers.push({ contact, count });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContactedUsersList.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.contactedUsers = [];
      })
      .addCase(getContactedUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.contactedUsers = action.payload.contacts;
      })
      .addCase(getContactedUsersList.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(markAsRead.pending, (state) => {
        state.isError = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isError = false;

        const { sender } = action.payload;

        const indexToUpdate = state.contactedUsers.findIndex(
          (contactInfo) => contactInfo.contact.id == sender
        );

        if (indexToUpdate !== -1) {
          state.contactedUsers[indexToUpdate].count = 0;
        }
      })
      .addCase(markAsRead.rejected, (state) => {
        state.isError = true;
      });
  },
});

export const { updateContactedUsersList } = chatSlice.actions;

export { getContactedUsersList, markAsRead };
export default chatSlice.reducer;
