import pool, { User } from "./migration/database"

export async function findUser(email: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

export async function addUser(email: string, hashedPassword: string): Promise<User> {
    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
    );
    return result.rows[0];
}