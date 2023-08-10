import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { parseJSON } from "../../utils/parseJson";

export default function BlogCard({ blog }) {
  return (
    <Link to={`/blogs/${blog.id}`}>
      <div className="flex justify-center items-center mb-3 w-[80vw]">
        <div className=" bg-slate-800 p-5 rounded-xl shadow-2xl w-full">
          <div className="flex justify-between ">
            <div>
              <h1 className="text-3xl font-bold mb-1">{blog.title}</h1>
              <span className="text-sm text-gray-500 italic mb-3">
                By {blog.author.fullName},{" "}
                {new Date(blog.createdAt).toLocaleString()}
              </span>

              <div
                className="pe-2 line-clamp-2 max-w-[70vw]  break-words"
                dangerouslySetInnerHTML={parseJSON(blog.content)}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
