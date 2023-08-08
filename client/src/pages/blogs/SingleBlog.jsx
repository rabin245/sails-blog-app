import { Link, useParams } from "react-router-dom";
import { parseJSON } from "../../utils/parseJson";
import { useGetBlogByIdQuery } from "../../app/services/blog/blogApiService";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/services/auth/authSlice";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { useState } from "react";
import CommentBar from "./CommentBar";
import ChatIcon from "../../component/chat/ChatIcon";
export default function SingleBlog() {
  const [isFilled, setIsFilled] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const { id } = useParams();

  const user = useSelector(selectUser);

  const { data, error, isLoading } = useGetBlogByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        {error.originalStatus} {error.data}
      </div>
    );

  const content = parseJSON(data.post.content);

  const blog = {
    ...data.post,
    content,
  };

  const toggleLike = () => {
    setIsFilled(!isFilled);
  };

  const toggleComment = () => {
    console.log("toggleComment");
    console.log(showComment);
    setShowComment(!showComment);
  };

  return (
    <div className="bg-slate-900 flex min-h-[calc(100vh-3.5rem)] max-h-fit relative">
      <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
        <div className="flex justify-center items-center  mb-3 w-[80vw]">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className=" bg-slate-800 py-5 px-10 rounded-xl shadow-2xl w-full">
              <h1 className="text-4xl font-bold mb-5">{blog.title}</h1>

              <BlogMetaData blog={blog} user={user} />

              <LikesAndCommentsSection
                isFilled={isFilled}
                toggleLike={toggleLike}
                toggleComment={toggleComment}
              />

              <div
                className="pe-2 text-xl max-w-[80vw]  break-words"
                dangerouslySetInnerHTML={blog.content}
              ></div>
            </div>
          )}
        </div>
      </div>
      <ChatIcon />
      <CommentBar setShowComment={setShowComment} showComment={showComment} />
    </div>
  );
}

export function LikesAndCommentsSection({
  isFilled,
  toggleLike,
  toggleComment,
}) {
  return (
    <div className="flex p-2 border-y border-gray-600 mb-10">
      <AiFillHeart
        className={`text-2xl cursor-pointer ${isFilled ? "text-red-500" : ""}`}
        onClick={toggleLike}
      />
      <FaRegComment
        className="text-2xl ml-10 cursor-pointer"
        onClick={toggleComment}
      />
      <IoShareOutline className="text-2xl ml-auto" />
    </div>
  );
}

export function BlogMetaData({ blog, user }) {
  return (
    <div className="flex gap-2 items-center mb-10">
      <span className="font-bold bg-white h-10 w-10 rounded-full text-xl text-black flex items-center justify-center  ">
        {blog.author.fullName[0]}
      </span>
      <div>
        <div className="flex text-sm  items-center gap-2">
          <span>By {blog.author.fullName}</span>
          {user &&
            (user.id != blog.author.id ? (
              <>
                <span>·</span>
                <Link to={`/chat/${blog.author.id}`}>Message</Link>
              </>
            ) : null)}
        </div>
        <span className="text-sm text-gray-500 italic">
          {new Date(blog.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
