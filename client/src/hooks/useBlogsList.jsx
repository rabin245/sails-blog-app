import useSWR from "swr";
import { getBlogs } from "../api/postsApi";

export default function useBlogsList() {
  const { isLoading, error, data, mutate } = useSWR("/api/posts", getBlogs);
  const blogs = data?.posts;

  return {
    isLoading,
    error,
    blogs,
    mutate,
  };
}
