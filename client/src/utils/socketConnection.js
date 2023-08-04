import socketIOClient from "socket.io-client";

export const connectToSocket = () => {
  let io;
  io = sailsIOClient(socketIOClient);
  io.sails.url = "http://localhost:1337";
  io.socket.on("connect", function onConnect() {
    console.log("This socket is now connected to the Sails server!");
  });

  return io;
};
