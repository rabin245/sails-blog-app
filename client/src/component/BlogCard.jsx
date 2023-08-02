import PropTypes from "prop-types";
import DOMPurify from "dompurify";
export default function BlogCard({ blog }) {
  function createMarkup(html) {
    const sanitizedHTML = DOMPurify.sanitize(html);
    return {
      __html: sanitizedHTML,
    };
  }
  //should show the blog with title descroptiopn and author name
  return (
    <div className="flex justify-center items-center  mb-3 w-[80vw]">
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
              dangerouslySetInnerHTML={createMarkup(blog.content)}
            ></div>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400">
              Edit
            </button>
            <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-400">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};
