import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  logout as logouAction,
} from "../app/services/auth/authSlice";
import { useLogoutMutation } from "../app/services/auth/authApiService";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(selectUser);

  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    try {
      logout().unwrap();
      dispatch(logouAction());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky top-0 left-0 z-10 bg-slate-800 flex justify-center">
      <nav className="flex justify-between items-center py-3 w-[80%]">
        <h1 className="text-2xl font-bold">BlogTalk</h1>
        {loggedInUser ? (
          <div className="flex gap-2 text-white font-bold">
            <Link
              to="/blogs/new"
              className="bg-slate-700 hover:bg-slate-900  py-2 px-4 rounded-xl flex items-center"
            >
              Add New
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-700 hover:bg-slate-900   py-2 px-4 rounded-xl flex items-center"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-slate-700 hover:bg-slate-900  py-2 px-4 rounded-xl flex items-center"
          >
            Login
          </button>
        )}
      </nav>
    </div>
  );
}
