import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // adjust if your backend endpoints have a different prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
