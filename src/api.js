// Utility for making API requests to the backend
const API_BASE_URL = 'http://localhost:5000/api';

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

// Example for other endpoints
export async function getAbout() {
  const res = await fetch(`${API_BASE_URL}/about`);
  return res.json();
}

export async function getContact() {
  const res = await fetch(`${API_BASE_URL}/contact`);
  return res.json();
}

export async function getRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms`);
  return res.json();
}

export async function getServices() {
  const res = await fetch(`${API_BASE_URL}/services`);
  return res.json();
}
