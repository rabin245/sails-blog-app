import { Outlet, useNavigation } from "react-router-dom";
import "./App.css";
import Header from "./component/Header";
import { ToastContainer } from "react-toastify";

function App() {
  const navigation = useNavigation();

  return (
    <>
      <Header />
      {navigation.state === "loading" ? <h1>Loading...</h1> : <Outlet />}
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
App.whyDidYouRender = true;
export default App;
