import BlogCard from "../component/BlogCard";
import { useGetBlogsQuery } from "../app/services/blog/blogApiService";

export default function Blogs() {
  const { data, error, isLoading } = useGetBlogsQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  const blogs = data.posts;
  console.log(data);
  console.log(blogs);

  const reversedBlogs = blogs.slice().reverse();

  return (
    <div className="bg-slate-900 flex min-h-screen max-h-fit ">
      <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
        <h1 className="text-4xl font-bold mb-4">Blogs</h1>
        {reversedBlogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
    </div>
  );
}
