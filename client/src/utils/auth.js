import axios from "axios";

export const login = async ({ email, password }) => {
  try {
    const res = await axios.post(
      "/api/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const id = res.data.data.id;

    localStorage.setItem("user", JSON.stringify({ email, id }));

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const logout = () => {
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
    return true;
  }
  return false;
};
