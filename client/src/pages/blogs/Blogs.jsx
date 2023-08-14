import { memo, useEffect } from "react";
import BlogCard from "../../component/blog/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlog,
  getBlogs,
  selectBlogs,
  selectError,
  selectIsError,
  selectIsLoading,
} from "../../app/services/blog/blogSlice";
import ChatIcon from "../../component/chat/ChatIcon";
import { joinRoom, leaveRoom } from "../../utils/blogs";

function Blogs({ io }) {
  const dispatch = useDispatch();

  const blogs = useSelector(selectBlogs);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);
  const error = useSelector(selectError);

  useEffect(() => {
    joinRoom(io).then((data) => {
      console.log(data);
    });

    const handlerFunction = ({ post }) => {
      console.log("new post", post);
      dispatch(addBlog(post));
    };

    io.socket.on("new-post", handlerFunction);

    dispatch(getBlogs());

    return () => {
      leaveRoom(io).then((data) => {
        console.log(data);
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

  if (isError) {
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
