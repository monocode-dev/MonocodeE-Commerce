import { Router } from "express";
import { GetCart, postCartItem, deleteCartItem } from "../controllers/cartController";

const router = Router();

router.get("/", GetCart)
router.post("/", postCartItem)
router.delete("/:id", deleteCartItem)

export default router;