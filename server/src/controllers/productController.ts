import { Request, Response } from "express";
import { findProducts, addProduct, editProduct, removeProduct } from "../db/products";
import { Product } from "../db/migration/database";

export async function getProducts(req: Request, res: Response) {
    const {name} = req.query

    try {
        const products = name ? await findProducts(name as string) : await findProducts();
        return res.status(200).json({success: true, data: products});
    } catch (err) {
        res.status(500).json({success: false, message: "Server Error, please try again..."});
    }
}

export async function postProduct(req: Request, res: Response) {
    let {name, description, price, image_url, stock} = req.body

    if(!name) name = 'untitled';
    if(!price) price = 0;
    if(!image_url) image_url = "Default image";
    if(!stock) stock = 0;

    try {
        const productId = await addProduct(name, price, stock, description, image_url)
        const newProduct: Product = {
            id: productId,
            name: name,
            description: description,
            price: price,
            image_url: image_url,
            stock: stock,
        }
        return res.status(200).json({success: true, data: newProduct});
    } catch (err) {
        res.status(500).json({success: false, message: "Server Error, please try again..."});
    }
}

export async function putProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, image_url, stock } = req.body;

    try {
        const changes = await editProduct(id as string, name, description, price, image_url, stock);

        if(changes === 0){
            return res.status(404).json({ success: false, message: 'Product Not Found'});
        }

        return res.status(200).json({ success: true, message: 'Product Edited', data: {id, name, description, price, image_url, stock } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error, please try again..." });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const {id} = req.params;

    try {
        const changes = await removeProduct(id as string)

        if(changes === 0){
            return res.status(404).json({ success: false, message: 'Product Not Found'});
        }
        
        return res.status(200).json({ success: true, message: 'Product Deleted'});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error, please try again..." });
    }
}