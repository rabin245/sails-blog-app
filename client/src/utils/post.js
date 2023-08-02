import axios from "axios";

export const getPost = () => {
  return axios
    .get("/api/posts", {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        console.log(response.data.posts);
        return response.data.posts;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createPost = async ({ title, content }) => {
  try {
    const res = await axios.post(
      "/api/posts",
      {
        title,
        content,
      },
      {
        withCredentials: true,
      }
    );

    console.log("created post", res.data);
  } catch (error) {
    console.log(error);
  }
};

export const getSinglePost = async (id) => {
  try {
    const res = await axios.get(`/api/posts/${id}`, {
      withCredentials: true,
    });
    console.log("single post", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
