import axios from "axios";

const addEvent = async (form) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  // await axios({
  //   method: "post",
  //   url: "http://localhost:4000/event",
  //   data: form,
  // })
  //   .then(function (response) {
  //     return response.data;
  //   })
  //   .catch(function (response) {
  //     console.log(response);
  //   });
  const res = await axios.post(`http://localhost:4000/event`, form);
  return res.data;
};

const getEvents = async (page, title, category, location, date) => {
  if (page) {
    const res = await axios.get(`http://localhost:4000/event?page=${page}`);
    return res.data;
  } else if (title) {
    const res = await axios.get(`http://localhost:4000/event?title=${title}`);
    return res.data;
  } else if (category && location && date) {
    const res = await axios.get(
      `http://localhost:4000/event?category=${category}&location=${location}&date=${date}`
    );
    return res.data;
  } else if (category && location) {
    const res = await axios.get(
      `http://localhost:4000/event?category=${category}&location=${location}`
    );
    return res.data;
  } else if (category && date) {
    const res = await axios.get(
      `http://localhost:4000/event?category=${category}&date=${date}`
    );
    return res.data;
  } else if (location && date) {
    const res = await axios.get(
      `http://localhost:4000/event?location=${location}&date=${date}`
    );
    return res.data;
  } else if (category) {
    const res = await axios.get(
      `http://localhost:4000/event?category=${category}`
    );
    return res.data;
  } else if (location) {
    const res = await axios.get(
      `http://localhost:4000/event?location=${location}`
    );
    return res.data;
  } else if (date) {
    const res = await axios.get(`http://localhost:4000/event?date=${date}`);
    return res.data;
  } else {
    const res = await axios.get("http://localhost:4000/event");
    return res.data;
  }
};

const getAdminEvents = async () => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("user");
  const res = await axios.get(`http://localhost:4000/event/admin`);
  return res.data;
};

// const getHomeEvents = async (category, page) => {
//   if (category) {
//     const res = await axios.get(
//       `http://localhost:4000/event/home?category=${category}`
//     );
//     return res.data;
//    } else if (page) {
//     const res = await axios.get(`http://localhost:4000/event/home?page=${page}`);
//     return res.data;
//   } else {
//     const res = await axios.get("http://localhost:4000/event/home");
//     return res.data;
//   }
// };

const getPopularEvents = async () => {
  const res = await axios.get("http://localhost:4000/event/popular");
  return res.data;
};

const getFreeEvents = async () => {
  const res = await axios.get("http://localhost:4000/event/free");
  return res.data;
};

const getPaidEvents = async () => {
  const res = await axios.get("http://localhost:4000/event/paid");
  return res.data;
};

const getSingleEvent = async (id) => {
  const res = await axios.get(`http://localhost:4000/event/${id}`);
  return res.data;
};

// const getSearchEvents = async (title) => {

// };

const getEventAndBooking = async (id, formdata) => {
  const res = await axios.post(
    `http://localhost:4000/event/booking/${id}`,
    formdata
  );
  return res.data;
};

// export { addEvent, getEvents, getSingleEvent, getEventAndBooking };
// export { addEvent, getEvents, getSingleEvent, getEventAndBooking, getPopularEvents, getFreeEvents, getPaidEvents, getHomeEvents, getSearchEvents };
export {
  addEvent,
  getEvents,
  getSingleEvent,
  getEventAndBooking,
  getPopularEvents,
  getFreeEvents,
  getPaidEvents,
  getAdminEvents,
};
