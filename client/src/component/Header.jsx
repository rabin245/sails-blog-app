import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  selectUser,
} from "../app/services/auth/authSlice";
import { useLogoutMutation } from "../app/services/auth/authApiService";
import { useState } from "react";

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
    <div className="sticky top-0 left-0 z-30 bg-slate-800 flex justify-center shadow-xl">
      <nav
        className={`flex justify-between items-center h-14 ${
          isChatPage ? "w-full px-3" : "w-[80%]"
        }`}
      >
        <Link to="/" className="text-2xl font-bold">
          BlogTalk
        </Link>
        {loggedInUser ? (
          <div className="flex gap-2 text-white font-bold relative">
            {!isChatPage && (
              <Link
                to="/blogs/new"
                className="bg-slate-700 hover:bg-slate-900 py-2 px-4 rounded-xl flex items-center"
              >
                Add New
              </Link>
            )}

            <div className="cursor-pointer">
              <span
                className="font-bold bg-white h-10 w-10 rounded-full text-xl text-black flex items-center justify-center  "
                onClick={toggleModal}
              >
                {loggedInUser.fullName[0]}
              </span>

              <div
                className={`absolute  right-0 top-12 bg-slate-700  py-2 shadow-lg rounded-lg ${
                  showModal ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex flex-col text-sm font-medium  items-center gap-2">
                  <p className="cursor-default">{loggedInUser.fullName}</p>

                  <p
                    className="hover:bg-slate-500 px-4 "
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
