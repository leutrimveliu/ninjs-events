import axios from "axios";

const addPayment = async (form) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  // await axios({
  //   method: "post",
  //   url: "http://localhost:4000/payment",
  //   data: data,
  // })
  //   .then(function (response) {})
  //   .catch(function (response) {
  //     console.log(response);
  //   });
  const res = await axios.post("http://localhost:4000/payment", form);
  return res.data
};

const getPayments = async () => {
  const res = await axios.get(`http://localhost:4000/payment`);
  return res.data;
};

const getCompanyEvents = async (id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.get(`http://localhost:4000/payment/${id}`);
  return res.data;
};

const getEventsBooking = async (id) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.get(`http://localhost:4000/payment/bookings/${id}`);
  return res.data;
};

const getUserBookings = async (id, date) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  // const res = await axios.get(`http://localhost:4000/payment/profile/${id}`);
  const res = await axios.get(`http://localhost:4000/payment/profile/${id}?date=${date}`);
  return res.data;
};

// const editCategory = async (form, id) => {
//   axios.defaults.headers.common["Authorization"] =
//     "Bearer " + localStorage.getItem("user");
//   await axios({
//     method: "put",
//     url: `http://localhost:4000/editCategory/${id}`,
//     data: form,
//   })
//     .then(function (response) {})
//     .catch(function (response) {
//       console.log(response);
//     });
// };

export {
  addPayment,
  getPayments,
  getCompanyEvents,
  getEventsBooking,
  getUserBookings,
};
