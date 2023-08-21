export const joinRoom = async (io, token) => {
  console.log("joining room\n\n\n\n");
  return new Promise((resolve) => {
    io.socket.request(
      {
        method: "get",
        url: "/chat/join-room",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
      (resData, jwres) => {
        // console.log("resData", resData);
        // console.log("jwres", jwres);

        resolve(resData);
      }
    );
  });
};

export const leaveRoom = async (io, token) => {
  return new Promise((resolve) => {
    io.socket.request(
      {
        method: "get",
        url: "/chat/leave-room",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
      (resData, jwres) => {
        // console.log("resData", resData);
        // console.log("jwres", jwres);

        resolve(resData);
      }
    );
  });
};
