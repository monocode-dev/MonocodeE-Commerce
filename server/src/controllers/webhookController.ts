import { Request, Response } from "express";
import Stripe from "stripe";
import { createOrder } from "../db/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function stripeWebhookHandler(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error) {
        return res.status(400).send(`Webhook signature verification failed`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const user_id = session.metadata?.user_id ? Number(session.metadata.user_id) : null;
        const session_id = session.metadata?.session_id ? session.metadata.session_id : null;
        const email = session.metadata?.email as string;

        await createOrder(user_id, email,session_id, session.id, session.amount_total ?? 0);
    }

    return res.status(200).json({ received: true });
}