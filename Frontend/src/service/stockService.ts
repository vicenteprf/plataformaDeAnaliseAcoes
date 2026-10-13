import { supabase } from "../lib/supabase";
import { ApiError } from "../errors/ApiError";
import type { Stock, MarketData, fetchStocksResponse } from "../types/stock";

export const TICKERS = [
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
export async function fetchStocks(
  tickers: string[],
): Promise<fetchStocksResponse> {
  const results: Stock[] = [];
  const failed: string[] = [];

  for (const ticker of tickers) {
    try {
      const data = await apiRequest(`/stock/${ticker}`);

      if (data?.results?.[0]) {
        results.push(data.results[0]);
      } else {
        console.warn(`O ticker ${ticker} retornou uma lista vazia .`);
        failed.push(ticker);
      }
    } catch (e) {
      console.error(`Erro ao buscar o ticker ${ticker}:`, e);
      failed.push(ticker);
    }
  }

  return {
    results,
    failed,
  };
}

// Função para chamar as informações ibovespa e dolar
export async function fetchMarketData(): Promise<MarketData> {
  return apiRequest("/market");
}

export async function fetchStockDetail(
  ticker: string,
  range: string = "1mo",
): Promise<Stock> {
  return apiRequest(
    `/stock/${ticker}?range=${range}&modules=summaryProfile`,
  ).then((data) => ({
    ...data.results[0],
    ...data.results[0]?.summaryProfile,
  }));
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
  return apiRequest(`/stock/${ticker}`).then((data) => data.results[0]);
}

async function apiRequest(path: string) {
  const maxTentativas = 3;

  for (let i = 0; i <= maxTentativas; i++) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    });

    if (!response.ok) {
      let mensagem = "Erro desconhecido ao realizar a requisição.";

      if (response.status === 429 && i < maxTentativas) {
        const segundos = Number(response.headers.get("retry-after")) || 1;

        await new Promise((resolve) => setTimeout(resolve, segundos * 1000));

        continue;
      }

      try {
        const data = (await response.json()) as { error?: string };
        if (data.error) {
          mensagem = data.error;
        }
      } catch {
        // não faz nada: continua valendo a mensagem padrão
      }

      throw new ApiError(mensagem, response.status);
    }

    return response.json();
  }
}
