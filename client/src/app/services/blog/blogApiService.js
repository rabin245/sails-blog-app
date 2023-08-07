import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApiService = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "posts",
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (id) => `posts/${id}`,
      providesTags: ["Blog"],
    }),

    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: "posts",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...updatedBlog }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: updatedBlog,
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
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
