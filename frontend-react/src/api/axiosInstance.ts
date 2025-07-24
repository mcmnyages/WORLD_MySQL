import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL , // uses the value from .env
  timeout: 10000, // optional: fail if request takes too long
});

export default axiosInstance;
