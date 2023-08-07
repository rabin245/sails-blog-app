// import axios from "axios";
import sailsIOClient from "sails.io.js";
// import { io } from "socket.io-client";
import socketIOClient from "socket.io-client";

export const getChat = async (io, receiverId, userId) => {
  // const io = connectToSocket();
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
  // const io = connectToSocket();
  console.log("posting chat\n\n\n\n");
  return new Promise((resolve) => {
    io.socket.post(
      `/chat/send`,
      {
        receiverId,
        message,
        senderId,
      },
      (body, JWR) => {
        console.log("Sails responded with: ", body);
        console.log("with headers: ", JWR.headers);
        console.log("and with status code: ", JWR.statusCode);
        resolve(body);
      }
    );
  });
};

// export const leaveChat = async (id) => {
//   const io = connectToSocket();
//   io.socket.get(`/chat/leave/${id}`, (body, JWR) => {
//     console.log("Sails responded with: ", body);
//     console.log("with headers: ", JWR.headers);
//     console.log("and with status code: ", JWR.statusCode);
//   });
// };

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
