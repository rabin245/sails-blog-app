import { useEffect, useState } from "react";
import BlogCard from "../component/BlogCard";
import sailsIOClient from "sails.io.js";
import socketIOClient from "socket.io-client";
import { useGetBlogsQuery } from "../app/services/blog/blogApiService";

export default function Blogs() {
  const { data, error, isLoading } = useGetBlogsQuery();

  const [blogPosts, setBlogPosts] = useState([]);

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
      setBlogPosts((prevPosts) => [...prevPosts, post]);
    });

    return () => {
      console.log("running cleanup function");
      io.socket.get("/leave-blog", function (body, response) {
        console.log("\n\nSails responded with: ", body);
        console.log("with headers: ", response.headers);
        console.log("and with status code: ", response.statusCode, "\n\n");
      });
    };
  }, []);

  useEffect(() => {
    if (data) {
      setBlogPosts(data.posts);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  const reversedBlogs = blogPosts.slice().reverse();

  return (
    <div className="bg-slate-900 flex min-h-screen max-h-fit ">
      <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
        <h1 className="text-4xl font-bold mb-4">Blogs</h1>
        {reversedBlogs.map((blog, index) => (
          <BlogCard
            key={index}
            blog={blog}
          />
        ))}
      </div>
    </div>
  );
}
