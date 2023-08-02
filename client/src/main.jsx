import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BlogForm from "./component/BlogForm.jsx";
import Blogs from "./pages/Blogs.jsx";
import Chat from "./pages/Chat.jsx";
import { store } from "./app/store";
import { Provider } from "react-redux";
import SingleBlog from "./pages/SingleBlog.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Blogs />,
      },
      {
        path: "/blogs/new",
        element: <BlogForm />,
      },
      {
        path: "/blogs/:id",
        element: <SingleBlog />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} fallbackElement={<h1>Loading ...</h1>} />
  </Provider>
  // </React.StrictMode>
);
