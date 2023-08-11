import axios from "axios";

export const getChat = async (receiverId) => {
  const response = await axios.get(
    `/api/chat/conversations?receiverId=${receiverId}`,
    {
      withCredentials: true,
    },
  );
  if (response.status === 200) {
    console.log("response.data", response.data);
    return response.data;
  } else return null;
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
    },
  );
  if (response.status === 200) {
    console.log("response.data", response.data);
    return response;
  } else return null;
};

export const joinRoom = async (io, token) => {
  console.log("joining room\n\n\n\n");
  return new Promise((resolve) => {
    io.socket.request({
      method: "get",
      url: "/chat/join-room",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    }, (resData, jwres) => {
      console.log("resData", resData);
      console.log("jwres", jwres);

      resolve(resData);
    });
  });
};

export const leaveRoom = async (io, token) => {
  return new Promise((resolve) => {
    io.socket.request({
      method: "get",
      url: "/chat/leave-room",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    }, (resData, jwres) => {
      console.log("resData", resData);
      console.log("jwres", jwres);

      resolve(resData);
    });
  });
};
