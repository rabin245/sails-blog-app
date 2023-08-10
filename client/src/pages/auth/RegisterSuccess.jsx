import { useLocation } from "react-router-dom";

const ConfirmEmail = () => {
  const { state } = useLocation();

  const { email } = state;

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-16 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Confirm Email</h1>

        <p className="text-center">
          A confirmation email has been sent to{" "}
          <strong>{email}</strong>. Please check your email to confirm your
          account.
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
