import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082/api', // adjusted to match Order & Billing Backend running on port 8082
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
