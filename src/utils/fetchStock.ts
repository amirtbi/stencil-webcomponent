import ApiInstance from '../plugins/axios/index';
const API_KEY = 'SYS391O1R9LE35B1';
const axiosApi = new ApiInstance();
export const fetchPrice = async (symbol: string) => {
  try {
    const res = await axiosApi.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);

    const { data } = await res;
    return data['Global Quote'];
  } catch (e) {
    throw new Error('Something went wrong!');
  }
};
