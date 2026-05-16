import type { Stock } from "../types/stock";

const TICKERS = ["TAEE11", "BBAS3", "CSMG3", "BBSE3", "KLBN11"];

export async function fetchStocks(): Promise<Stock[]> {
  const token = import.meta.env.VITE_BRAPI_TOKEN;

  const results = await Promise.all(
    TICKERS.map((ticker) =>
      fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`)
        .then((r) => r.json())
        .then((d) => d.results[0]),
    ),
  );

  console.log(results);

  return results;
}
