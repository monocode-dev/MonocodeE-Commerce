import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction){
    if(!req.session?.userId){
        return res.status(401).json({success: false, message: 'Not Authorized.'});
    }
    next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction){
    if(req.session?.role !== 'admin'){
        return res.status(403).json({success: false, message: 'Forbidden: Admin access required.'});
    };
    next();
}