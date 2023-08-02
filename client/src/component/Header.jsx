import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("logout");
    const res = logout();
    console.log(res);
    if (res) {
      console.log(res);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-slate-800 h-12 flex justify-between p-2 px-[15%]">
      <h1 className="text-2xl  font-bold">Welcome to Blog</h1>
      {localStorage.getItem("user") && (
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
            logout
          </button>
        </div>
      )}
    </nav>
  );
}
