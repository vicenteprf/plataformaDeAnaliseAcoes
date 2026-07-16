import { supabase } from "../lib/supabase";
import type { Stock, MarketData } from "../types/stock";

const TICKERS = [
  "TAEE4",
  "BBAS3",
  "CSMG3",
  "BBSE3",
  "KLBN4",
  "ITSA4",
  "SAPR4",
  "ITUB4",
  "BBDC4",
  "CMIG4",
  "CXSE3",
  "BRSR6",
  "SANB4",
  "PETR4",
  "TIMS3",
];

// Função para chamar as informações das ações
export async function fetchStocks(): Promise<Stock[]> {
  const results = await Promise.all(
    TICKERS.map((ticker) =>
      fetch(`${import.meta.env.VITE_API_URL}/stock/${ticker}`, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      }).then((response) => response.json().then((data) => data.results[0])),
    ),
  );

  return results;
}

// Função para chamar as informações ibovespa e dolar
export async function fetchMarketData(): Promise<MarketData> {
  const data = await fetch(`${import.meta.env.VITE_API_URL}/market`, {
    headers: {
      "x-api-key": import.meta.env.VITE_API_KEY,
    },
  }).then((response) => response.json());

  return {
    ibovespa: data.ibovespa,
    ibovespaChange: data.ibovespaChange,
    dolar: data.dolar,
    dolarChange: data.dolarChange,
    volume: data.volume,
  };
}

export async function fetchStockDetail(
  ticker: string,
  range: string = "1mo",
): Promise<Stock> {
  const detail = await fetch(
    `${import.meta.env.VITE_API_URL}/stock/${ticker}?range=${range}&modules=summaryProfile`,
    {
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    },
  )
    .then((response) => response.json())
    .then((data) => ({
      ...data.results[0],
      ...data.results[0]?.summaryProfile,
    }));

  return detail;
}

// Buscarr favoritos do usuário
export async function fetchFavorites(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("favorites")
    .select("ticker")
    .eq("user_id", userId);

  return data?.map((f) => f.ticker) ?? [];
}

// Adicionar favorito
export async function addFavorite(
  userId: string,
  ticker: string,
): Promise<void> {
  await supabase.from("favorites").insert({ user_id: userId, ticker });
}

// Remover favorito
export async function removeFavorite(
  userId: string,
  ticker: string,
): Promise<void> {
  await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("ticker", ticker);
}

export async function searchStock(ticker: string): Promise<Stock> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stock/${ticker}`,
    {
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  const data = await response.json();

  return data.results[0];
}
