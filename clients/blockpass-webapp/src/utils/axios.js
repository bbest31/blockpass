import axios from 'axios';
// config
import { SERVER_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: SERVER_API,
  timeout: 5000,
});

// interceptor to globally handle error responses for requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
