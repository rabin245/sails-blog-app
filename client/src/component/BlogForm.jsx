import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Blog() {
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
  });

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // todo
  const createPost = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();

    const contentState = editorState.getCurrentContent();
    const contentStateJSON = JSON.stringify(convertToRaw(contentState));
    console.log(contentStateJSON);

    createPost({
      title: blog.title,
      content: contentStateJSON,
    }).then((res) => {
      console.log(res);
      navigate("/blogs");
    });
  };

  return (
    <div className="flex justify-center  ">
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

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
