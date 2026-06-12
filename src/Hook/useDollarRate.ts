import axios from 'axios';
import { useEffect, useState } from 'react';

const getUsdToNgnRate = async (): Promise<number> => {
  const response = await axios.get('https://open.er-api.com/v6/latest/USD');
  return response.data.rates.NGN;
};

export const useDollarRate = (amount: number | string) => {
  const [dollarRate, setDollarRate] = useState<number>(0.00)
  useEffect(() => {
    async function fetchRate() {
      const rate = await getUsdToNgnRate();
      const amountInUsd: number = Number(amount);
      const amountInNaira: number = Math.ceil(amountInUsd * rate);
      setDollarRate(amountInNaira)
    }
    fetchRate();
  }, [amount]);

  return dollarRate.toString();

}


