import ApiInstance from '../plugins/axios/index';
// const API_KEY = 'BLUNMEHMBB8K5S5H';
const axiosApi = new ApiInstance();

const basePath = {
  prefix: '/prices',
};

const PriceInfo = new Map();
const btc = new Map();
const eth = new Map();
const pairCoin = new Map();
let date;

export const addPricesInfo = (entries: any, pair: string) => {
  PriceInfo.set('money', parseFloat(entries.data.amount));
  PriceInfo.set(
    'formatted',
    new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
    }).format(entries.data.amount),
  );

  PriceInfo.set('name', pair.split('-')[0]);
};

export const grabPrices = async (pair: string) => {
  try {
    const response = await fetchPrices(pair);
    const { data: result } = response;

    addPricesInfo(result, pair);
  } catch (e) {
    console.log('error', e);
  }
};

export const setValues = async (value: string) => {
  try {
    const response = await grabPrices(value);

    if (value === 'BTC-USD') {
      btc.set('name', PriceInfo.get('name'));
      btc.set('formatted', PriceInfo.get('formatted'));
      btc.set('money', PriceInfo.get('money'));
      return btc;
    } else if (value === 'ETH-USD') {
      eth.set('name', PriceInfo.get('name'));
      eth.set('formatted', PriceInfo.get('formatted'));
      eth.set('money', PriceInfo.get('money'));
      return eth;
    } else {
      pairCoin.set('name', PriceInfo.get('name'));
      pairCoin.set('formatted', PriceInfo.get('formatted'));
      pairCoin.set('money', PriceInfo.get('money'));
      return pairCoin;
    }

    // date = new Date().toString();
  } catch (e) {
    console.log('error happened', e);
  }
};

export const fetchPrices = (pair: string): Promise<any> => {
  return axiosApi.get(`${basePath.prefix}/${pair}/buy`);
};
