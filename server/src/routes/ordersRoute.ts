import { Router } from "express";
import { getOrders, getOrder, putOrder } from "../controllers/ordersController";
import { requireAdmin } from "../middleware/middleware";

const router = Router();

router.get("/", requireAdmin, getOrders);
router.get("/:id", requireAdmin, getOrder);
router.put("/:id", requireAdmin, putOrder);

export default router;