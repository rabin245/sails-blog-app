import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setErrMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/user/forgot-password", { email });
      console.log(response.data);

      setSuccessMsg("Email sent successfully");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (error.response.status === 404) {
        setErrMsg("User not found");
      } else {
        setErrMsg("Something went wrong");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Forgot Password</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-400"
            value={email}
            onChange={handleChange}
            required
          />

          {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400 disabled:opacity-50"
            disabled={successMsg.length > 0}
          >
            {successMsg.length > 0 ? successMsg : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
