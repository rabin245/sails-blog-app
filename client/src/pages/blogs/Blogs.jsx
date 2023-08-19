import { memo, useEffect } from "react";
import BlogCard from "../../component/blog/BlogCard";
import ChatIcon from "../../component/chat/ChatIcon";
import { joinRoom, leaveRoom } from "../../utils/blogs";
import useBlogsList from "../../hooks/useBlogsList";

function Blogs({ io }) {
  const { isLoading, error, blogs, mutate } = useBlogsList();

  useEffect(() => {
    joinRoom(io).then((data) => {
      // console.log(data);
    });

    const handlerFunction = ({ post }) => {
      console.log("new post event", post);
      mutate((oldData) => ({
        posts: [...oldData.posts, post],
      }));
    };

    io.socket.on("new-post", handlerFunction);

    return () => {
      leaveRoom(io).then((data) => {
        // console.log(data);
      });

      io.socket.off("new-post", handlerFunction);
    };
  }, []);

  const layout = (content) => {
    return (
      <>
        <div className="bg-slate-900 max-h-fit min-h-[calc(100vh-3.5rem)]">
          <div className="flex flex-col items-center pt-5 h-full w-full">
            <h1 className="text-4xl font-bold mb-4">Blogs</h1>
            {content}
          </div>
          <ChatIcon />
        </div>
      </>
    );
  };

  if (isLoading) {
    return layout(<div>Loading...</div>);
  }

  if (error) {
    return layout(
      <div className="text-red-500">
        <h1 className="text-xl text-center">Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const content =
    blogs && blogs.length > 0 ? (
      blogs
        .slice()
        .reverse()
        .map((blog, index) => <BlogCard key={index} blog={blog} />)
    ) : (
      <div className="text-2xl font-bold">No blogs yet</div>
    );

  return layout(content);
}

export default memo(Blogs);
