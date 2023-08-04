import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApiService = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getChats: builder.query({
      query: (id) => `chat/conversations/${id}`,
    }),

    getContactedPerson: builder.query({
      query: () => `chat/person-contacts`,
    }),

    sendChat: builder.mutation({
      query: (newChat) => ({
        url: "chat/send",
        method: "POST",
        body: newChat,
      }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetContactedPersonQuery,
  useSendChatMutation,
} = chatApiService;
