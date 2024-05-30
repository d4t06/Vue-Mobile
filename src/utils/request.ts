import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'https://spring-mobile-latest.onrender.com/api';

const publicRequest = axios.create({
   baseURL: BASE_URL,
});

const privateRequest = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
});

export { publicRequest, privateRequest };
