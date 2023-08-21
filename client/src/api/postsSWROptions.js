export const createBlogOptions = (newPost) => ({
  optimisticData: (oldData) => ({
    posts: [...oldData.posts, newPost],
  }),
  rollbackOnError: true,
  revalidate: false,
  populateCache: (updatedBlog, oldData) => ({
    posts: [...oldData.posts, updatedBlog.post],
  }),
});
