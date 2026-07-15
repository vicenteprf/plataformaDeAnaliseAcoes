import "dotenv/config";
import express from "express";
import router from "./src/routes/stockRoutes.js";
import cors from "cors";
import { authMiddleware } from "./src/middlewares/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(authMiddleware);

app.use(router);

app.get("/", (_req, res) => {
  return res.json({
    message: "API funcionando!",
  });
});

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
