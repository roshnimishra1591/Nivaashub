import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchAllReviews() {
  const res = await axios.get(`${API_BASE_URL}/api/reviews/all`);
  return res.data.reviews;
}

export async function fetchPropertyReviews(propertyId) {
  const res = await axios.get(`${API_BASE_URL}/api/reviews/property/${propertyId}`);
  return res.data.reviews;
}
