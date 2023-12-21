import axios from "axios";

const API = axios.create({
    baseURL: "https://api-blog-xn32.onrender.com"
    //baseURL: "http://localhost:8080"
})

export default API