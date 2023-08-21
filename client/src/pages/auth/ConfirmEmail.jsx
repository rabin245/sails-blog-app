import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(search).get("token");

  const [errMsg, setErrMsg] = useState("");

  if (!token) {
    navigate("/login", {
      replace: true,
    });
  }

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await axios.get("/api/user/confirm" + search);

        console.log(res.data);
        navigate("/login", {
          replace: true,
        });
      } catch (error) {
        console.log(error);
        setErrMsg("Invalid or Expired Token");
      }
    };
    confirmEmail();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl">
        {errMsg
          ? <h1 className="text-4xl font-bold mb-4 text-center">{errMsg}</h1>
          : (
            <h1 className="text-4xl font-bold mb-4 text-center">
              Confirming Email...
            </h1>
          )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
