import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getBlogs = createAsyncThunk("blog/getBlogs", async () => {
  const response = await axios.get("/api/posts");
  return response.data;
});

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (newBlog) => {
    try {
      const response = await axios.post("/api/posts", newBlog);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

// todo
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, ...updatedBlog }) => {
    const response = await axios.put(`/api/posts/${id}`, updatedBlog);
    return response.data;
  }
);

// todo
export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id) => {
  await axios.delete(`/api/posts/${id}`);
  return id;
});

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    isLoading: false,
    isError: false,
    error: null,
    currentPostComments: [],
    currentPostLikers: [],
  },
  reducers: {
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
    setCurrentPostComments: (state, action) => {
      state.currentPostComments = action.payload;
    },
    setCurrentPostLikers: (state, action) => {
      state.currentPostLikers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.blogs = action.payload.posts;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error;
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.blogs.push(action.payload.post);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error;
      });
  },
});

export const {
  addBlog,
  setCurrentPostComments,
  setCurrentPostLikers,
} = blogSlice.actions;

export default blogSlice.reducer;

export const selectBlogs = (state) => state.blog.blogs;
export const selectIsLoading = (state) => state.blog.isLoading;
export const selectIsError = (state) => state.blog.isError;
export const selectError = (state) => state.blog.error;
