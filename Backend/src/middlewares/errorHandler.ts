import type { Request, Response, NextFunction } from "express";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err?.response?.status || 500;
  const message =
    err?.response?.data?.message || err?.message || "Erro interno do servidor";
  const context = err?.context || `${req.method} ${req.originalUrl}`;

  console.error(`[API Error] [${context}] Status ${status} - ${message}`);

  return res.status(status).json({ error: message });
}
