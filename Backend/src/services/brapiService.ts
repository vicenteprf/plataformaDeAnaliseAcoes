import axios from "axios";

const token = process.env.BRAPI_TOKEN;

export async function getStockDetail(ticker: string) {
  const detail = await axios.get(
    `https://brapi.dev/api/quote/${ticker}?token=${token}`,
  );

  return detail.data;
}

export async function getStockList() {
  const list = await axios.get(
    `https://brapi.dev/api/quote/list?token=${token}`,
  );

  return list.data;
}

export async function getMarketData() {
  const dolar = await axios.get(
    `https://brapi.dev/api/v2/currency?currency=USD-BRL&token=${token}`,
  );

  return dolar.data;
}
