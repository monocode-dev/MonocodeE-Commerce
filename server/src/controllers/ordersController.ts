import { Request, Response } from "express";
import { getAllOrders, getOrderById, updateOrderStatus } from "../db/orders";

export async function getOrders(req: Request, res: Response) {
    try {
        const orders = await getAllOrders();
        return res.status(200).json({success: true, data: orders});
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error, Please try again later..."});
    }
}

export async function getOrder(req: Request, res: Response) {
    const {id} = req.params;

    try {
        const order = await getOrderById(id as string);
        return res.status(200).json({success: true, data: order});
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error, Please try again later..."});
    }
}

export async function putOrder(req: Request, res: Response) {
    const {id} = req.params;
    const {status} = req.body;

    try {
        const changes = await updateOrderStatus(id as string, status);

        if (changes === 0) {
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }
        return res.status(200).json({ success: true, message: "Order Status Changed." });
    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error, Please try again later..."});
    }
}