import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../app/services/auth/authApiService";
import { login as loginAction } from "../app/services/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, token } = await login(credentials).unwrap();
      dispatch(loginAction({ user, token }));

      console.log(user, token);

      setCredentials({
        email: "",
        password: "",
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Wrong Username or Password");
      } else if (err.status === 404) {
        setErrMsg("User not found");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
          />

          <p
            className={errMsg ? "text-red-500" : "invisible"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline" replace>
            Signup now
          </Link>
        </p>
      </div>
    </div>
  );
}
