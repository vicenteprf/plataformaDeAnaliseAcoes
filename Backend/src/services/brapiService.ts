import axios from "axios";

const token = process.env.BRAPI_TOKEN;

export async function getStockDetail(ticker: string, range: string) {
  const detail = await axios.get(
    `https://brapi.dev/api/quote/${ticker}?range=${range}&interval=1d&token=${token}`,
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
  const [ibovespaRes, dolarRes] = await Promise.all([
    axios.get(`https://brapi.dev/api/quote/%5EBVSP?token=${token}`),
    axios.get("https://economia.awesomeapi.com.br/json/last/USD-BRL"),
  ]);

  return {
    ibovespa: ibovespaRes.data.results[0].regularMarketPrice,
    ibovespaChange: ibovespaRes.data.results[0].regularMarketChangePercent,
    dolar: parseFloat(dolarRes.data.USDBRL.bid),
  };
}
