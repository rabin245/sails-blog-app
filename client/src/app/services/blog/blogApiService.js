import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApiService = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "posts",
    }),

    getBlogById: builder.query({
      query: (id) => `posts/${id}`,
    }),

    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: "posts",
        method: "POST",
        body: newBlog,
      }),
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...updatedBlog }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: updatedBlog,
      }),
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApiService;
