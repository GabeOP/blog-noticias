import axios from "axios";

const API = axios.create({
    baseURL: "https://api-blog-xn32.onrender.com"
})

export default API