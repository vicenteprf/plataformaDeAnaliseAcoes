import {
  getStockDetail,
  getStockList,
  getMarketData,
} from "../services/brapiService.js";
import type { Request, Response } from "express";

export async function getDetail(req: Request, res: Response) {
  const ticker = req.params.ticker as string;
  const range = (req.query.range as string) ?? "1mo";

  try {
    const data = await getStockDetail(ticker, range);

    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: `Error: ${e}` });
  }
}

export async function getList(req: Request, res: Response) {
  try {
    const data = await getStockList();

    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: `Error: ${e}` });
  }
}

export async function getMarket(req: Request, res: Response) {
  try {
    const data = await getMarketData();

    return res.json(data);
  } catch (e) {
    console.error("Erro no getMarket:", e);
    return res.status(500).json({ error: `Error: ${e}` });
  }
}
