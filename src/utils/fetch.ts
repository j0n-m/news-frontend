import axios from "axios";

const fetch = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://idk"
      : "http://localhost:3001/",
  withCredentials: true,
});

export default fetch;
