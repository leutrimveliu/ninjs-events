import axios from "axios";

const getCategories = async () => {
  const res = await axios.get("http://localhost:4000/category");
  return res.data;
};

const addCategory = async (form) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "post",
    url: "http://localhost:4000/category",
    data: form,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};

const getLocation = async () => {
  const res = await axios.get("http://localhost:4000/locations");
  return res.data;
};
const deleteCategories = async (id, user_id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "delete",
    url: `http://localhost:4000/Category/${id}`,
    data: user_id,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};
const editCategory = async (form, id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "put",
    url: `http://localhost:4000/editCategory/${id}`,
    data: form,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};

export {
  getCategories,
  getLocation,
  deleteCategories,
  editCategory,
  addCategory,
};
