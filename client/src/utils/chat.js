import axios from "axios";

export const getChat = async (io, receiverId, userId) => {
  console.log("getting chat\n\n\n\n");
  return new Promise((resolve) => {
    io.socket.get(
      `/chat/conversations/?senderId=${userId}&receiverId=${receiverId}`,
      (body, JWR) => {
        console.log("Sails responded with: ", body);
        console.log("with headers: ", JWR.headers);
        console.log("and with status code: ", JWR.statusCode);
        resolve(body);
      }
    );
  });
};

export const postChat = async (io, receiverId, senderId, message) => {
  console.log("posting chat\n\n\n\n");
  // return new Promise((resolve) => {
  //   io.socket.post(
  //     `/chat/send`,
  //     {
  //       receiverId,
  //       message,
  //       senderId,
  //     },
  //     (body, JWR) => {
  //       console.log("Sails responded with: ", body);
  //       console.log("with headers: ", JWR.headers);
  //       console.log("and with status code: ", JWR.statusCode);
  //       resolve(body);
  //     }
  //   );
  // });

  const response = axios.post(
    `/api/chat/send`,
    {
      receiverId,
      message,
      senderId,
    },
    {
      withCredentials: true,
    }
  );
  if (response.status === 200) {
    console.log("response.data", response.data);
    return response;
  } else return null;
};

export const joinRoom = async (io, userId) => {
  console.log("joining room\n\n\n\n");
  return new Promise((resolve) => {
    io.socket.get(`/chat/join-room/?userId=${userId}`, (body, JWR) => {
      console.log("Sails responded with: ", body);
      console.log("with headers: ", JWR.headers);
      console.log("and with status code: ", JWR.statusCode);
      resolve(body);
    });
  });
};
