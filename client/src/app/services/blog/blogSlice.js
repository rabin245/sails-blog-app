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
    try {
      const response = await axios.post("/api/posts", newBlog);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, ...updatedBlog }) => {
    const response = await axios.put(`/api/posts/${id}`, updatedBlog);
    return response.data;
  }
);

export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id) => {
  await axios.delete(`/api/posts/${id}`);
  return id;
});

export const likePost = createAsyncThunk(
  "blog/likePost",
  async (postId, { dispatch, getState }) => {
    await axios.post(`/api/posts/${postId}/like`);
    // const { currentBlog } = getState().blog;
    // const { user } = getState().auth;
    // const updatedCurrentBlog = {
    //   ...currentBlog,
    //   likers: [...currentBlog.likers, user],
    // };
    // dispatch(blogSlice.actions.updateCurrentBlog(updatedCurrentBlog));
  }
);

export const unlikePost = createAsyncThunk(
  "blog/unlikePost",
  async (postId, { dispatch, getState }) => {
    await axios.post(`/api/posts/${postId}/unlike`);
    // const { currentBlog } = getState().blog;
    // const { user } = getState().auth;
    // const updatedLikers = currentBlog.likers.filter(
    //   (liker) => liker.id !== user.id,
    // );
    // const updatedCurrentBlog = {
    //   ...currentBlog,
    //   likers: updatedLikers,
    // };
    // dispatch(blogSlice.actions.updateCurrentBlog(updatedCurrentBlog));
  }
);


const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    currentBlog: null,
    isCurrentBlogLiked: false,
    noOfLikes: 0,
    isLoading: false,
    isError: false,
    error: null,
    currentPostComments: []
  },
  reducers: {
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
    updateCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    increaseLikes: (state) => {
      state.noOfLikes += 1;
    },
    decreaseLikes: (state) => {
      state.noOfLikes -= 1;
    },
    setCurrentPostComments: (state, action) => {
      state.currentPostComments = action.payload;
    },
    updateCurrentPostComments: (state, action) => {
      state.currentPostComments.push(action.payload);
    }
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
        state.isCurrentBlogLiked = action.payload.isLiked;
        state.noOfLikes = action.payload.numberOfLikes;
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
  increaseLikes,
  decreaseLikes,
  updateCurrentBlog,
  setCurrentPostComments,
  updateCurrentPostComments
} = blogSlice.actions;

export default blogSlice.reducer;

export const selectBlogs = (state) => state.blog.blogs;
export const selectCurrentBlog = (state) => state.blog.currentBlog;
export const selectIsLoading = (state) => state.blog.isLoading;
export const selectIsError = (state) => state.blog.isError;
export const selectError = (state) => state.blog.error;
export const selectIsCurrentBlogLiked = (state) =>
  state.blog.isCurrentBlogLiked;
export const selectNoOfLikes = (state) => state.blog.noOfLikes;
