import { Router } from "express";
import { stripeWebhookHandler } from "../controllers/webhookController";

const router = Router();

router.post("/", stripeWebhookHandler);

export default router;