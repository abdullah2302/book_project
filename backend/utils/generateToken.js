import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateAccessToken(user)  {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY ,
  });
}

export function generateRefreshToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
}
