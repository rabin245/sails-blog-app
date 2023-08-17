import axios from "axios";

export const getSinglePost = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

export const likePost = async (id) => {
  const res = await axios.post(`/api/posts/${id}/like`);
  return res.data;
};

export const unlikePost = async (id) => {
  const res = await axios.post(`/api/posts/${id}/unlike`);
  return res.data;
};

export const commentOnPost = async (id, content) => {
  const res = await axios.post(`/api/posts/${id}/comment`, { content });
  return res.data;
};
