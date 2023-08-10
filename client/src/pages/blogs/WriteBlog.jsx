import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { createBlog, selectIsLoading } from "../../app/services/blog/blogSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Blog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
  });

  const [error, setError] = useState("");

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const contentState = editorState.getCurrentContent();

      if (contentState.getPlainText().trim().length === 0) {
        return setError("Content cannot be empty");
      }

      const contentStateJSON = JSON.stringify(convertToRaw(contentState));

      const res = await dispatch(createBlog({
        title: blog.title,
        content: contentStateJSON,
      }));

      if (!res.error) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="bg-slate-900 flex justify-center items-start min-h-[calc(100vh-3.5rem)] p-3">
      <div className=" bg-slate-800 p-16 rounded-xl shadow-2xl w-4/6">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={blog.title}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />

          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "embedded",
                "image",
                "remove",
                "history",
              ],
            }}
          />

          {error ? <p className="text-red-500 text-center">{error}</p> : null}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            {isLoading ? "Loading..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
