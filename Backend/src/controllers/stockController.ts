import {
  getStockDetail,
  getStockList,
  getMarketData,
} from "../services/brapiService.js";
import type { Request, Response, NextFunction } from "express";

export async function getDetail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ticker = req.params.ticker as string;
  const range = (req.query.range as string) ?? "1mo";

  try {
    const data = await getStockDetail(ticker, range);
    return res.json(data);
  } catch (e: any) {
    e.context = `getDetail (${ticker})`;
    next(e);
  }
}

export async function getList(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await getStockList();
    return res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getMarket(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await getMarketData();
    return res.json(data);
  } catch (e) {
    next(e);
  }
}
