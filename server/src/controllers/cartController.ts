import { getCartItems, addCartItem, removeCartItem } from "../db/cart";
import { getCartOwner } from "../middleware/middleware";
import { Request, Response } from "express";

export async function GetCart(req: Request, res: Response) {
    const cartIds = getCartOwner(req);
    const {user_id, session_id} = cartIds;

    try {
        const cart = await getCartItems(user_id, session_id);
        return res.status(200).json({success: true, message: "Cart Found!", data: cart});
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error!, Please try again later..."});
    }
}

export async function postCartItem(req: Request, res: Response) {
    const cartIds = getCartOwner(req);
    const {user_id, session_id} = cartIds;

    const {product_id, quantity} = req.body;

    try {
        const item = await addCartItem(user_id, session_id, product_id, quantity);
        return res.status(200).json({success: true, message: "Item added successfully!", data: item});
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error!, Please try again later..."});
    }
}


export async function deleteCartItem(req: Request, res: Response) {
    const cartIds = getCartOwner(req);
    const {user_id, session_id} = cartIds;

    const {id} = req.params;

    try {
        const changes = await removeCartItem(Number(id), user_id, session_id);

        if(changes === 0){
            return res.status(404).json({success: false, message: "Item not Found!"});
        }
        
        return res.status(200).json({success: true, message: "Item removed successfully!"});
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error!, Please try again later..."});
    }
}