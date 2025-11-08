import axios from "axios";

// const localDevIP = "http://192.168.86.211:3001";
const url = "/";
const localDevIP = "http://localhost:3001";

const fetch = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? url : localDevIP,
  withCredentials: true,
});

export default fetch;
