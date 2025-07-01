import axios from "axios";

const API = axios.create({ baseURL: "/api/admin" });

export const adminLogin = (data) => API.post("/login", data);
