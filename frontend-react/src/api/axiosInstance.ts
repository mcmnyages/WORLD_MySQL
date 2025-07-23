import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  'http://localhost:5000/api', // uses the value from .env
  timeout: 10000, // optional: fail if request takes too long
});

export default axiosInstance;
