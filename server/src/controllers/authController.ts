import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUser, addUser } from "../db/users";
import { mergeGuestCart } from "../db/cart";

//login
export async function login(req: Request, res: Response){
    const {email, password} = req.body;

    if (!email) return res.status(400).json({success: false, message: 'Please Enter an Email'});

    try {
        const user = await findUser(email);
        if(!user) return res.status(401).json({success: false, message: "Invalid Email"});

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass) return res.status(401).json({success: false, message: 'Invalid password'});

        req.session.userId = user.id;
        req.session.role = user.role;
        await mergeGuestCart(req.sessionID, user.id);

        return res.status(201).json({success: true, message: "Logged in successfully", data: { email: user.email, role: user.role }})

    } catch (err) {
        return res.status(500).json({success: false, message: "Server Error, Please try again later"});
    }
};

//signup
export async function signup(req: Request, res: Response){
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).json({success: false, message: 'Please Enter an Email and Password'});

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await addUser(email, hashedPassword);

        req.session.userId = user.id;
        req.session.role = user.role;
        await mergeGuestCart(req.sessionID, user.id);

        return res.status(201).json({success: true, message: "Signed up successfully", data: { email: user.email, role: user.role }})
    } catch (err) {
        return res.status(400).json({success: false, message: 'Email Already Exists'});
    }
}

//logout
export async function logout(req: Request, res: Response) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({success: false, message: 'Could not Log Out, Please try again'});
        }

        res.clearCookie('connect.sid');

        return res.status(200).json({success: true, message: 'logged out Successfully'});
    });
}