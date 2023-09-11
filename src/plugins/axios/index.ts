import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.coinbase.com/v2',
});

class ApiClass {
  get(url: string, params?: any) {
    return axiosInstance.get(url, params);
  }

  post(url: string, payload: any, config: any) {
    return axiosInstance.post(url, payload, config);
  }
}

export default ApiClass;
