import { Axios } from "axios";

const publicRequest = new Axios({
    baseURL: 'http://localhost:8080.api'
})


export {publicRequest}