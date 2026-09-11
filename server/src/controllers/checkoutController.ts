import { Request, Response } from "express";
import Stripe from "stripe";
import { getCartOwner } from "../middleware/middleware";
import { getCartItems } from "../db/cart";
import pool from "../db/migration/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createCheckoutSession(req: Request, res: Response) {
    const {user_id, session_id} = getCartOwner(req);
    const {email} = req.body;

    if(!email){
        return res.status(400).json({success: false, message: "Email is required"});
    }

    try {
        const cartItems = await getCartItems(user_id, session_id);

        if(cartItems.length === 0){
            return res.status(400).json({succes: false, message: "Cart is empty"});
        }

        const lineItems = await Promise.all(
            cartItems.map(async (item) => {
                const productResult = await pool.query('SELECT * FROM products WHERE id = $1',[item.product_id])
                const product = productResult.rows[0];

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {name: product.name},
                        unit_amount: product.price
                    },
                    quantity: item.quantity
                };
            })
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: email,
            metadata: {
                user_id: user_id ? String(user_id): "",
                session_id: session_id ?? "",
                email: email
            },
        });

        return res.status(201).json({success: true, url: session.url});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Checkout failed, please try again" });
    }
}