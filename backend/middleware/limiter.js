import limiter from "express-rate-limit";

export const apiLimiter = limiter({
  windowMs: 60*1000, // 1 minute
  max: 30,
  message: "Too many requests from this IP, please try again after 1 minute.",
  standardHeaders: false,
  legacyHeaders: false
});
