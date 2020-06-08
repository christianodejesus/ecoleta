import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default api;
