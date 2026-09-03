import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
dotenv.config();

export function protect(req, res, next) {
    const authHeader = req.headers.authorization;
    const tokenFromCookie = req.cookies?.accessToken;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : tokenFromCookie;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("Token verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}


export async function checkAdminExists(req, res, next) {
    try {
        const { role } = req.body;

        if (role === "admin") {
            const adminExists = await User.exists({ role: "admin" });
            if (adminExists) {
                return res.status(403).json({ message: "Admin already exists. Only one admin is allowed." });
            }
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

