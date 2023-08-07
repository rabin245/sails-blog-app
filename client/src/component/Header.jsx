import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  selectUser,
} from "../app/services/auth/authSlice";
import { useLogoutMutation } from "../app/services/auth/authApiService";

export default function Header() {
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

  return (
    <div className="sticky top-0 left-0 z-10 bg-slate-800 flex justify-center shadow-xl">
      <nav
        className={`flex justify-between items-center py-3 ${
          isChatPage ? "w-full px-3" : "w-[80%]"
        }`}
      >
        <Link to="/" className="text-2xl font-bold">
          BlogTalk
        </Link>
        {loggedInUser
          ? (
            <div className="flex gap-2 text-white font-bold">
              {!isChatPage && (
                <Link
                  to="/blogs/new"
                  className="bg-slate-700 hover:bg-slate-900 py-2 px-4 rounded-xl flex items-center"
                >
                  Add New
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-800 hover:bg-red-900 py-2 px-4 rounded-xl flex items-center"
              >
                Log out
              </button>
            </div>
          )
          : (
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
