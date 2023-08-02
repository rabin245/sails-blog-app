import { useEffect, useState } from "react";
import BlogCard from "../component/BlogCard";
import { getPost } from "../utils/post";
import sailsIOClient from "sails.io.js";
// import { io } from "socket.io-client";
import socketIOClient from "socket.io-client";
export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch initial blog data using getPost()
    getPost()
      .then((post) => {
        console.log(post);
        setBlogs(post);
      })
      .catch((error) => {
        console.error(error);
      });

    let io;
    if (socketIOClient.sails) {
      io = socketIOClient;
    } else {
      io = sailsIOClient(socketIOClient);
    }

    io.sails.url = "http://localhost:1337";

    io.socket.on("connect", function onConnect() {
      console.log("This socket is now connected to the Sails server!");
    });

    io.socket.on("newBlogPost", (blog) => {
      console.log("workloads changed", blog);
      setBlogs((prevValue) => {
        console.log(prevValue);
        return prevValue.concat([blog]);
      });
    });
  }, []);

  const reversedBlogs = blogs.slice().reverse();

  return (
    <div className="bg-slate-900 flex min-h-screen max-h-fit w-screen">
      <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
        <h1 className="text-4xl font-bold mb-4">Blogs</h1>
        {reversedBlogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
    </div>
  );
}
