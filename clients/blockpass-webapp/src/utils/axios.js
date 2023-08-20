import axios from 'axios';
// config
import { SERVER_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: SERVER_API,
  timeout: 30000,
});

export default axiosInstance;
