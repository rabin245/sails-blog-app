import { Link, useParams } from "react-router-dom";
import { parseJSON } from "../utils/parseJson";
import { useGetBlogByIdQuery } from "../app/services/blog/blogApiService";
import { useSelector } from "react-redux";
import { selectUser } from "../app/services/auth/authSlice";

export default function SingleBlog() {
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

  console.log(data);

  const content = parseJSON(data.post.content);
  const blog = {
    ...data.post,
    content,
  };

  console.log(blog);

  return (
    <div className="bg-slate-900 flex min-h-screen max-h-fit">
      <div className=" w-screen flex flex-col justify-center items-center pt-5 h-full">
        <div className="flex justify-center items-center  mb-3 w-[80vw]">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className=" bg-slate-800 py-5 px-10 rounded-xl shadow-2xl w-full">
              <h1 className="text-4xl font-bold mb-5">{blog.title}</h1>

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

              <div
                className="pe-2 text-xl max-w-[80vw]  break-words"
                dangerouslySetInnerHTML={blog.content}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
