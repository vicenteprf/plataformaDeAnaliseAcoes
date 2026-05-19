import { supabase } from "../lib/supabase";
import type { Stock } from "../types/stock";

export interface MarketData {
  ibovespa: number;
  ibovespaChange: number;
  dolar: number;
  dolarChange: number;
  volume: number;
}

const TICKERS = ["TAEE11", "BBAS3", "CSMG3", "BBSE3", "KLBN3"];

// Função para chamar as informações das ações
export async function fetchStocks(): Promise<Stock[]> {
  const token = import.meta.env.VITE_BRAPI_TOKEN;

  const results = await Promise.all(
    TICKERS.map((ticker) =>
      fetch(`https://brapi.dev/api/quote/${ticker}?token=${token}`)
        .then((response) => response.json())
        .then((data) => data.results[0]),
    ),
  );

  console.log(results);

  return results;
}

// Função para chamar as informações ibovespa e dolar
export async function fetchMarketData(): Promise<MarketData> {
  const token = import.meta.env.VITE_BRAPI_TOKEN;

  const [ibovespa, dolar] = await Promise.all([
    fetch(`https://brapi.dev/api/quote/%5EBVSP?token=${token}`)
      .then((response) => response.json())
      .then((data) => data.results[0]),
    fetch(`https://brapi.dev/api/quote/USDBRL=X?token=${token}`)
      .then((response) => response.json())
      .then((data) => data.results[0]),
  ]);

  return {
    ibovespa: ibovespa.regularMarketPrice,
    ibovespaChange: ibovespa.regularMarketChangePercent,
    dolar: dolar.regularMarketPrice,
    dolarChange: dolar.regularMarketChangePercent,
    volume: ibovespa.regularMarketVolume,
  };
}

export async function fetchStockDetail(
  ticker: string,
  range: string = "1mo",
): Promise<Stock> {
  const token = import.meta.env.VITE_BRAPI_TOKEN;

  const detail = await fetch(
    `https://brapi.dev/api/quote/${ticker}?modules=summaryProfile&range=${range}&interval=1d&token=${token}`,
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
export async function addFovorite(
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
