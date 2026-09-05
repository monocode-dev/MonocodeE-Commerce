import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export interface User {
    id: number;
    email: string;
    password: string;
    role: string;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    created_at: string;
}

export interface Cart {
    id: number;
    user_id: number | null;
    session_id: string | null;
    product_id: number;
    quantity: number;
}

export interface Order {
    id: number;
    user_id: number | null;
    email: string;
    stripe_session_id: string;
    status: string;
    total_price: number;
    created_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
}


export default pool;