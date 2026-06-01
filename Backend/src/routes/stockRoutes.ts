import { Router } from "express";
import {
  getDetail,
  getList,
  getMarket,
} from "../controllers/stockController.js";

const router = Router();

router.get("/stocks", getList);
router.get("/stock/:ticker", getDetail);
router.get("/market", getMarket);

export default router;
