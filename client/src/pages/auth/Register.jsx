import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../app/services/auth/authApiService";

export default function Register() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));

    setErrMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { message } = await register(credentials).unwrap();

      console.log(message);

      setCredentials({
        fullName: "",
        email: "",
        password: "",
      });

      navigate("/signup/success", { state: { email: credentials.email } });
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (error.status === 409) {
        setErrMsg("Email already exists");
      } else {
        setErrMsg("Register Failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Register</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={credentials.fullName}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
            required
          />

          <p className={errMsg ? "text-red-500 text-center" : "invisible"}>
            {errMsg}
          </p>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline" replace>
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}
