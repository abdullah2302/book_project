import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export async function registerUser(req, res) {
    try {
        const { username, email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch); // Debugging line
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


       res.json({
            message: "Login successful",
            accessToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function refreshToken(req, res) {
    try {
        const token = req.cookies?.refreshToken || req.body?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {

            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }

            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const accessToken = generateAccessToken(user);
            res.status(200).json({ accessToken });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function logoutUser(req, res) {
    try {

        const token = req.cookies?.refreshToken;

        if (token) {
           
            await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
        }

        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}