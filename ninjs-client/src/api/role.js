import axios from "axios";

const addRole = async (data) => {
  const res = await axios.post(`http://localhost:4000/role`, data);
  return res.data;
};

const getRoles = async () => {
  const res = await axios.get(`http://localhost:4000/role`);
  return res.data;
};

export { addRole, getRoles };
