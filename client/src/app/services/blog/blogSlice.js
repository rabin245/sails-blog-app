import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
  },
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
  },
});

export const { setBlogs, addBlog } = blogSlice.actions;

export default blogSlice.reducer;

export const selectBlogs = (state) => state.blog.blogs;
