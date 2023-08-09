import axios from "axios";

export const postComment = async (message, postId) => {
  const response = await axios.post(
    "/api/posts/" + postId + "/comment",
    {
      content: message,
    },
    {
      withCredentials: true,
    }
  );
  return response;
};

export const likePost = async (postId) => {
  const response = await axios.post(
    "/api/posts/" + postId + "/like",
    {},
    {
      withCredentials: true,
    }
  );
  return response;
};

export const unlikePost = async (postId) => {
  const response = await axios.post(
    "/api/posts/" + postId + "/unlike",
    {},
    {
      withCredentials: true,
    }
  );
  return response;
};
