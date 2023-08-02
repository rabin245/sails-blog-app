import { Outlet, useNavigation } from "react-router-dom";
import "./App.css";
import Header from "./component/Header";

function App() {
  const navigation = useNavigation();
  return (
    <>
      <Header />
      {navigation.state === "loading" ? <h1>Loading...</h1> : <Outlet />}
    </>
  );
}

export default App;
