import pool from './database'

async function dbMigrate() {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price INTEGER NOT NULL,
                image_url TEXT,
                stock INTEGER NOT NULL DEFAULT 0
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart(
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders(
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                stripe_session_id INTEGER NOT NULL,
                status TEXT NOT NULL,
                total_price INTEGER NOT NULL
            );
        `);

        console.log("MIGRATION COMPLETED SUCCESSFULLY")
    }catch(err){
        console.log("MIGRATION FAILED", err)
    }finally{
        await pool.end();
    }
}

dbMigrate();