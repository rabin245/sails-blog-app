export const joinRoom = async (io) => {
  console.log("joining room\n\n\n\n");
  return new Promise((resolve) => {
    io.socket.get(`/join-blog`, (body, JWR) => {
      // console.log("Sails responded with: ", body);
      // console.log("with headers: ", JWR.headers);
      // console.log("and with status code: ", JWR.statusCode);
      resolve(body);
    });
  });
};

export const leaveRoom = async (io) => {
  return new Promise((resolve) => {
    io.socket.get(`/leave-blog`, (body, JWR) => {
      // console.log("Sails responded with: ", body);
      // console.log("with headers: ", JWR.headers);
      // console.log("and with status code: ", JWR.statusCode);
      resolve(body);
    });
  });
};

export const joinSingleRoom = async (io, id) => {
  return new Promise((resolve) => {
    io.socket.get(`/join-blog/${id}`, (body, JWR) => {
      // console.log("Sails responded with: ", body);
      // console.log("with headers: ", JWR.headers);
      // console.log("and with status code: ", JWR.statusCode);
      resolve(body);
    });
  });
};

export const leaveSingleRoom = async (io, id) => {
  return new Promise((resolve) => {
    io.socket.get(`/leave-blog/${id}`, (body, JWR) => {
      // console.log("Sails responded with: ", body);
      // console.log("with headers: ", JWR.headers);
      // console.log("and with status code: ", JWR.statusCode);
      resolve(body);
    });
  });
};
