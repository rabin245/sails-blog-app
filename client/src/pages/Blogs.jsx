import { useEffect, useMemo } from "react";
import BlogCard from "../component/BlogCard";
import { useGetBlogsQuery } from "../app/services/blog/blogApiService";
import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";
import { useDispatch, useSelector } from "react-redux";
import { selectBlogs } from "../app/services/blog/blogSlice";
import { addBlog, setBlogs } from "../app/services/blog/blogSlice";
import ChatIcon from "../component/ChatIcon";

export default function Blogs() {
  const { data, error, isLoading } = useGetBlogsQuery();
  const dispatch = useDispatch();

  const blogPosts = useSelector(selectBlogs);

  useEffect(() => {
    let io;
    if (socketIOClient.sails) {
      io = socketIOClient;
    } else {
      io = sailsIOClient(socketIOClient);
    }

    io.sails.url = "http://localhost:1337";
    io.socket.get("/join-blog", function (body, response) {
      console.log("\n\nSails responded with: ", body);
      console.log("with headers: ", response.headers);
      console.log("and with status code: ", response.statusCode, "\n\n");
    });

    io.socket.on("new-post", function ({ post }) {
      console.log("new post", post);
      dispatch(addBlog(post));
    });

    return () => {
      io.socket.get("/leave-blog", function (body, response) {
        console.log("\n\nSails responded with: ", body);
        console.log("with headers: ", response.headers);
        console.log("and with status code: ", response.statusCode, "\n\n");
      });
    };
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setBlogs(data.posts));
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  const reversedBlogs = blogPosts.slice().reverse();

  return (
    <>
      <div className="bg-slate-900 flex min-h-screen max-h-fit">
        <div className="w-screen flex flex-col justify-center items-center pt-5 h-full">
          <h1 className="text-4xl font-bold mb-4">Blogs</h1>
          {reversedBlogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
        <ChatIcon />
      </div>
    </>
  );
}
