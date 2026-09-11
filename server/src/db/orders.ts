import { getCartItems } from "./cart";
import pool from "./migration/database";

export async function createOrder(
    user_id: number | null,
    email: string,
    session_id: string | null,
    stripe_session_id: string,
    total_price: number
): Promise<void> {
    const orderResult = await pool.query(
        `INSERT INTO orders (user_id, email, stripe_session_id, status, total_price)
        VALUES ($1, $2, $3, 'paid', $4) RETURNING id`,
        [user_id, email, stripe_session_id, total_price]
    );
    const orderId = orderResult.rows[0].id;

    const cartItems = await getCartItems(user_id, session_id);

    for (const item of cartItems) {
        const productResult = await pool.query(
            `SELECT price FROM products WHERE id = $1`, [item.product_id]
        );
        const price = productResult.rows[0].price;

        await pool.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
            VALUES ($1, $2, $3, $4)`,
            [orderId, item.product_id, item.quantity, price]
        );
    }

    await pool.query(
        `DELETE FROM cart WHERE 
         (user_id = $1 AND $1 IS NOT NULL) OR 
         (session_id = $2 AND $2 IS NOT NULL)`,
        [user_id, session_id]
    );
}