import axios from "axios";

const API = axios.create({ baseURL: "/api/owner" });

export const ownerSignup = (data) => API.post("/signup", data);
export const ownerLogin = (data) => API.post("/login", data);
