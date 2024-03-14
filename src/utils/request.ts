import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const publicRequest = axios.create({
   baseURL: BASE_URL,
});

const privateRequest = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
   headers: { "Content-Type": "application/json" },
});

export { publicRequest, privateRequest };
