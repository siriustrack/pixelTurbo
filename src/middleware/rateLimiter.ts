import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: "Too many requests, please try again later.",
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Limit each IP to 5 login requests per hour
  message: {
    error: {
      message: "Too many login attempts, please try again later.",
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
