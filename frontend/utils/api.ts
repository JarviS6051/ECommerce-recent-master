import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", // Make sure this is correct
  withCredentials: true, // If your API requires cookies
});

export default API;
