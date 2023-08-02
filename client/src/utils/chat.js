// import axios from "axios";
import sailsIOClient from "sails.io.js";
// import { io } from "socket.io-client";
import socketIOClient from "socket.io-client";

export const connectToSocket = () => {
  let io;
  if (socketIOClient.sails) {
    io = socketIOClient;
  } else {
    io = sailsIOClient(socketIOClient);
  }

  io.sails.url = "http://localhost:1337";

  io.socket.on("connect", function onConnect() {
    console.log("This socket is now connected to the Sails server!");
  });

  return io;
};

export const joinChat = async (id) => {
  const io = connectToSocket();
  io.socket.get(`/chat/join/${id}`, (body, JWR) => {
    console.log("Sails responded with: ", body);
    console.log("with headers: ", JWR.headers);
    console.log("and with status code: ", JWR.statusCode);
  });

  //   return axios
  //     .get(`http://localhost:1337/chat/join/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       return response.data;
  //     });
};

export const postChat = async (roomid, msg) => {
  const io = connectToSocket();
  console.log("herE");
  io.socket.post(`/chat/post`, { roomid, msg }, (body, JWR) => {
    console.log("Sails responded with: ", body);
    console.log("with headers: ", JWR.headers);
    console.log("and with status code: ", JWR.statusCode);
  });

  //   return axios
  //     .post(
  //       `http://localhost:1337/chat/post`,
  //       {
  //         roomid: roomid,
  //         msg: msg,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //       return response.data;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
};

export const leaveChat = async (id) => {
  const io = connectToSocket();
  io.socket.get(`/chat/leave/${id}`, (body, JWR) => {
    console.log("Sails responded with: ", body);
    console.log("with headers: ", JWR.headers);
    console.log("and with status code: ", JWR.statusCode);
  });
};
