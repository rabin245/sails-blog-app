import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  selectUser,
} from "../app/services/auth/authSlice";
import { useLogoutMutation } from "../app/services/auth/authApiService";
import { useState } from "react";
import { RxPencil2 } from "react-icons/rx";
import UserAvatar from "./UserAvatar";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isChatPage = pathname.includes("/chat");

  const loggedInUser = useSelector(selectUser);

  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    try {
      logout().unwrap();
      dispatch(logoutAction());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="z-40 sticky top-0 left-0  bg-slate-800 flex justify-center shadow-xl">
      <nav
        className={`flex justify-between items-center h-14 ${
          isChatPage ? "w-full px-3" : "w-[80%]"
        }`}
      >
        <Link to="/" className="text-2xl font-bold">
          BlogTalk
        </Link>
        {loggedInUser ? (
          <div className="flex gap-2 text-white font-bold relative items-center">
            {!isChatPage && (
              <Link
                to="/blogs/new"
                className=" hover:text-slate-400 py-2 px-4 rounded-xl flex items-center font-medium"
              >
                <RxPencil2 className="me-2 text-xl" />
                Write
              </Link>
            )}

            <div className="cursor-pointer">
              <UserAvatar
                name={loggedInUser.fullName}
                toggleModal={toggleModal}
                customStyle={"h-8 w-8"}
              />

              <div
                className={`w-40 absolute  right-0 top-12 bg-slate-700  py-2 shadow-lg rounded-lg ${
                  showModal ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex flex-col text-sm font-medium  items-center gap-2">
                  <p className="cursor-default px-4">{loggedInUser.fullName}</p>

                  <p
                    className="hover:bg-slate-500 px-4 w-full text-center"
                    onClick={handleLogout}
                  >
                    Log out
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-slate-700 hover:bg-slate-900 py-2 px-4 rounded-xl flex items-center font-bold"
          >
            Login
          </button>
        )}
      </nav>
    </div>
  );
}
