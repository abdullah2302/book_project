import limiter from "express-rate-limit";

export const apiLimiter = limiter({
  windowMs: 0.05 * 60 * 1000, 
  max: 5, 
  message: "Too many requests from this IP, please try again after 5 seconds",
});
