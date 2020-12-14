import axios from "axios";

const addRegister = async (data) => {
  const res = await axios.post(`http://localhost:4000/register`, data);
  return res.data;
};

// add user_id
const deleteUser = async (id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "delete",
    url: `http://localhost:4000/register/${id}`,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};

const getRegister = async () => {
  const res = await axios.get(`http://localhost:4000/register`);
  return res.data;
};
const getUser = async (id) => {
  const res = await axios.get(`http://localhost:4000/register/${id}`);
  return res.data;
};

const editUser = async (form, id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  // await axios({
  //   method: "put",
  //   url: `http://localhost:4000/register/editprofile/${id}`,
  //   data: form,
  // })
  //   .then(function (response) {})
  //   .catch(function (response) {
  //     console.log(response);
  //   });
  const res = await axios.put(
    `http://localhost:4000/register/editprofile/${id}`,
    form
  );
  return res.data;
};

const editRole = async (form, id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.put(`http://localhost:4000/register/${id}`, form);
  return res.data;
};

export { addRegister, getRegister, deleteUser, editUser, getUser, editRole };
