import type { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API Key não informada." });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: "API Key inválida.",
    });
  }

  next();
}
