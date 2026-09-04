import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export interface User{
    id: number;
    email: string;
    password: string;
    role: string;
};

export interface Product{
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
};

export interface Cart{
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
};

export interface Order{
    id: number;
    user_id: number;
    stripe_sesssion_id: number;
    status: string;
    total_price: number;
};

export default pool;