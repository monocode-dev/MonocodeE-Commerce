import { Router } from "express";
import { getProducts, postProduct, putProduct, deleteProduct } from "../controllers/productController";

//middleware
import { requireAuth, requireAdmin } from "../middleware/middleware";

const router = Router();

router.get("/", getProducts)
router.post("/", requireAdmin, postProduct)
router.put("/:id", requireAdmin, putProduct)
router.delete("/:id", requireAdmin, deleteProduct)

export default router;