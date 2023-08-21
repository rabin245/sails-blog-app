import axios from "axios";

export const chatConversationUrl = "/api/chat/conversations?receiverId=";

export const getChat = async (url) => {
  const response = await axios.get(
    // `/api/chat/conversations?receiverId=${receiverId}`,
    url,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const postChat = async (receiverId, message) => {
  const response = await axios.post(
    `/api/chat/send`,
    {
      receiverId,
      message,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};
