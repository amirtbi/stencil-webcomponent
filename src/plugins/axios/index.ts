import axios from 'axios';
const API_KEY = 'SYS391O1R9LE35B1';

const axiosInstance = axios.create({
  baseURL: '',
});

class ApiClass {
  get(url: string) {
    return axiosInstance.get(url);
  }

  post(url: string, payload: any, config: any) {
    return axiosInstance.post(url, payload, config);
  }
}

export default ApiClass;
