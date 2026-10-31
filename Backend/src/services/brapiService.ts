import axios from "axios";

const token = process.env.BRAPI_TOKEN;

// Cache para dados do mercado (ibovespa + dólar)
let marketCache: { data: any; timestamp: number } | null = null;

let marketPending: Promise<any | null> | null = null;

// Cache para detalhes de cada ação, indexado por ticker+range
let detailCache: Record<string, { data: any; timestamp: number }> = {};

// Tempo de validade do cache: 1 minuto
const CACHE_TTL = 60 * 1000;

export async function getStockDetail(ticker: string, range: string) {
  // Chave única por ticker e período (ex: "PETR4-1mo")
  const cacheKey = `${ticker}-${range}`;

  // Retorna do cache se ainda estiver válido
  if (
    detailCache[cacheKey] &&
    Date.now() - detailCache[cacheKey].timestamp < CACHE_TTL
  ) {
    return detailCache[cacheKey].data;
  }

  // Busca da brapi e salva no cache
  const detail = await axios.get(
    `https://brapi.dev/api/quote/${ticker}?range=${range}&interval=1d&token=${token}`,
  );

  // Salva resultado no cache com o timestamp atual
  detailCache[cacheKey] = { data: detail.data, timestamp: Date.now() };

  return detail.data;
}

export async function getStockList() {
  const list = await axios.get(
    `https://brapi.dev/api/quote/list?token=${token}`,
  );

  return list.data;
}

export async function getMarketData() {
  // Retorna do cache se ainda estiver válido
  if (marketCache && Date.now() - marketCache.timestamp < CACHE_TTL)
    return marketCache.data;

  // Se já existe um pedido em andamento, reaproveita a promessa
  if (marketPending) return marketPending;

  // Inicia a busca sem await e armazena a promessa em marketPending
  marketPending = getMarketBrapi();

  // Aguarda a promessa resolver no try e garante a limpeza no finally
  try {
    return await marketPending;
  } finally {
    marketPending = null;
  }
}

async function getMarketBrapi() {
  // Busca ibovespa
  const ibovespaRes = await axios.get(
    `https://brapi.dev/api/quote/%5EBVSP?token=${token}`,
  );

  // Busca do dolar
  const dolarRes = await axios.get(
    `https://brapi.dev/api/quote/USDBRL=X?token=${token}`,
  );

  // Formata o resultado e salva no cache
  const result = {
    ibovespa: ibovespaRes.data.results[0].regularMarketPrice,
    ibovespaChange: ibovespaRes.data.results[0].regularMarketChangePercent,
    dolar: dolarRes.data.results[0].regularMarketPrice,
    dolarChange: dolarRes.data.results[0].regularMarketChangePercent,
    volume: ibovespaRes.data.results[0].regularMarketVolume,
  };

  // Salva resultado no cache com o timestamp atual
  marketCache = { data: result, timestamp: Date.now() };

  return result;
}
