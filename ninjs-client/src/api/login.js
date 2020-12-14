import axios from "axios";

const API_URL = "http://localhost:4000/auth";

const login = async (email, password) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  return axios
    .post(API_URL + "/login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  login,
  logout,
};
