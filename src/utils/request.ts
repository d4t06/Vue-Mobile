import axios from "axios";

const publicRequest = axios.create({
   baseURL: "http://localhost:8080/api",
});

export { publicRequest };
