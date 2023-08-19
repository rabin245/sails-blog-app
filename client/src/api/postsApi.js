import axios from "axios";

export const getBlogs = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export const createBlog = async (newBlog) => {
  const response = await axios.post("/api/posts", newBlog);
  return response.data;
};
