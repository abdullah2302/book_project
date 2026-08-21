import limiter from "express-rate-limit";

export const apiLimiter = limiter({
  windowMs: // 15 seconds
  15 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again after 5 seconds",
  standardHeaders: false,
  legacyHeaders: false
});
