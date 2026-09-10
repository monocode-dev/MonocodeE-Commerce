import pool, {Cart} from "./migration/database";

export async function getCartItems(user_id: number | null, session_id: string | null): Promise<Cart[]> {
    const result = await pool.query(
        `SELECT * FROM cart WHERE
        (user_id = $1 AND $1 IS NOT NULL) OR
        (session_id = $2 AND $2 IS NOT NULL)`,
        [user_id, session_id]
    );
    return result.rows;
}

export async function addCartItem(user_id: number | null, session_id: string | null, product_id: number, quantity: number): Promise<Cart> {
    const checkProduct = await pool.query(
        `SELECT * FROM cart WHERE product_id = $1 AND (
         (user_id = $2 AND $2 IS NOT NULL) OR
         (session_id = $3 AND $3 IS NOT NULL)
        )`,
        [product_id, user_id, session_id]
    );

    if(checkProduct.rows.length === 0){
        const result = await pool.query(
            `INSERT INTO cart 
            (user_id, session_id, product_id, quantity) VALUES 
            ($1, $2, $3, $4) RETURNING *`,
            [user_id, session_id, product_id, quantity]
        );
        return result.rows[0];
    }

    const newQuantity = checkProduct.rows[0].quantity + quantity;

    const result = await pool.query(
        `UPDATE cart SET quantity = $1 WHERE 
         product_id = $2 AND (
         (user_id = $3 AND $3 IS NOT NULL) OR
         (session_id = $4 AND $4 IS NOT NULL)) RETURNING *`, 
        [newQuantity, product_id, user_id, session_id]
    );
    return result.rows[0];
}

export async function removeCartItem(id: number, user_id: number | null, session_id: string | null): Promise<number | null> {
    const result = await pool.query(
        `DELETE FROM cart WHERE id = $1 AND (
         (user_id = $2 AND $2 IS NOT NULL) OR
         (session_id = $3 AND $3 IS NOT NULL)
        )`,
        [id, user_id, session_id]
    );

    return result.rowCount;
}

export async function mergeGuestCart(session_id: string, user_id: number): Promise<void> {
  await pool.query(
    `UPDATE cart SET user_id = $1, session_id = NULL WHERE session_id = $2`,
    [user_id, session_id]
  );
}