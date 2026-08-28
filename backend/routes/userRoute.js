import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, getUserProfile } from "../controller/userController.js";
import {protect} from "../middleware/userMiddleware.js";
import morgan from "morgan";

const router = express.Router();
router.use(morgan("dev"));

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.get("/profile", protect, getUserProfile);


export default router;