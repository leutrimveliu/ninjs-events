import axios from "axios";

const editEvent = async (form, id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "put",
    url: `http://localhost:4000/editEvent/${id}`,
    data: form,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};

const getEventDetails = async (id) => {
  const res = await axios.get(`http://localhost:4000/editEvent/${id}`);
  return res.data;
};

// approve Event
const approveEvent = async (id, form) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "put",
    url: `http://localhost:4000/editEvent/approve/${id}`,
    data: form,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};

// const deleteEvent = async (id) => {
const deleteEvent = async (id, user_id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  await axios({
    method: "delete",
    url: `http://localhost:4000/editEvent/${id}`,
    data: user_id,
  })
    .then(function (response) {})
    .catch(function (response) {
      console.log(response);
    });
};

export { editEvent, getEventDetails, deleteEvent, approveEvent };
