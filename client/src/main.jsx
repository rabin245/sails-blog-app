import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BlogForm from "./pages/blogs/WriteBlog";
import Blogs from "./pages/blogs/Blogs";
import Chat from "./pages/chat/Chat";
import { store } from "./app/store";
import { Provider } from "react-redux";
import SingleBlog from "./pages/blogs/SingleBlog";
import Chatbody from "./component/chat/ChatBody";
import ChatbodyWithMessage from "./component/chat/ChatbodyWithMessage";
import { connectToSocket } from "./utils/socketConnection";
import RequireAuth from "./component/RequireAuth";
import ConfirmEmail from "./pages/auth/ConfirmEmail";
import RegisterSuccess from "./pages/auth/RegisterSuccess";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const io = connectToSocket();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Blogs io={io} />,
      },
      {
        path: "/blogs/:id",
        element: <SingleBlog />,
      },
      {
        path: "/",
        element: <RequireAuth />,
        children: [
          {
            path: "/blogs/new",
            element: <BlogForm />,
          },
          {
            path: "/chat",
            element: <Chat io={io} />,
            children: [
              {
                path: "/chat",
                element: <ChatbodyWithMessage />,
              },
              {
                path: "/chat/:id",
                element: <Chatbody io={io} />,
              },
            ],
          },
        ],
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
  {
    path: "/signup/success",
    element: <RegisterSuccess />,
  },
  {
    path: "/confirm",
    element: <ConfirmEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} fallbackElement={<h1>Loading ...</h1>} />
  </Provider>,
  // </React.StrictMode>
);
