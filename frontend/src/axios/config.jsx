import axios from "axios";

const API = axios.create({
    baseURL: "https://fakestoreapi.com"
})

export default API