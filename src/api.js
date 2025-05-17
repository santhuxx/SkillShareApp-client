import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Change if your backend is hosted elsewhere
});

export default API;