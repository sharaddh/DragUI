import rateLimit from "express-rate-limit";

export const apiLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many requests. Please try again later.",
    },
  });

export const authLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many login attempts.",
    },
  });
// CLI endpoints do a DB lookup per call - keep them modest
export const cliLimiter =
 rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: "Too many CLI requests, slow down" },
 });
