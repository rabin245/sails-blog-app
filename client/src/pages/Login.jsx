import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(data);
    if (response) {
      navigate("/blogs");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            Login
          </button>
        </form>

        <p className="mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup now
          </Link>
        </p>
      </div>
    </div>
  );
}
