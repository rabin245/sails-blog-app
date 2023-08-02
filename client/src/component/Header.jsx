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

  const [logout, { isLoading }] = useLogoutMutation();

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
    <nav className="bg-slate-800 h-12 flex justify-between p-2 px-[15%]">
      <h1 className="text-2xl  font-bold">Welcome to Blog</h1>
      {loggedInUser ? (
        <div className="flex gap-2 text-white font-bold">
          <Link
            to="/blogs/create"
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
  );
}
