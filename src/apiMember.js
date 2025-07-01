import axios from "axios";

const API = axios.create({ baseURL: "/api/member" });

export const addMember = (data) => API.post("/add", data);
export const getMembershipStatus = (email) => API.get(`/status?email=${encodeURIComponent(email)}`);
