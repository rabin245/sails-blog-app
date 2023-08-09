import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getBlogs = createAsyncThunk("blog/getBlogs", async () => {
  const response = await axios.get("/api/posts");
  return response.data;
});

export const getBlogById = createAsyncThunk("blog/getBlogById", async (id) => {
  const response = await axios.get(`/api/posts/${id}`);
  return response.data;
});

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (newBlog) => {
    const response = await axios.post("/api/posts", newBlog);
    return response.data;
  },
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, ...updatedBlog }) => {
    const response = await axios.put(`/api/posts/${id}`, updatedBlog);
    return response.data;
  },
);

export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id) => {
  await axios.delete(`/api/posts/${id}`);
  return id;
});

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    currentBlog: null,
    isLoading: false,
    isError: false,
    error: null,
  },
  reducers: {
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
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
      .addCase(getBlogById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.currentBlog = action.payload.post;
      })
      .addCase(getBlogById.rejected, (state, action) => {
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
        state.blogs.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error;
      });
  },
});

export const { setBlogs, addBlog } = blogSlice.actions;

export default blogSlice.reducer;

export const selectBlogs = (state) => state.blog.blogs;
export const selectCurrentBlog = (state) => state.blog.currentBlog;
export const selectIsLoading = (state) => state.blog.isLoading;
export const selectIsError = (state) => state.blog.isError;
export const selectError = (state) => state.blog.error;
