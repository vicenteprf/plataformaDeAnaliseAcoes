import "dotenv/config";
import express from "express";
import router from "./routes/stockRoutes.js";

const app = express();

app.use(router);

app.get("/", (req, res) => {
  return res.json({
    message: "API funcionando!",
  });
});

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
