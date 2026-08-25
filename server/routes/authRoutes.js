import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import passport from "../config/Passport.js";

const router = express.Router();

const TOKEN_TTL = "7d";

// Allowed post-OAuth redirect targets (prevents open-redirect token theft)
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
].filter(Boolean);

function safeClientRedirect(candidate) {
  try {
    const url = new URL(candidate);
    // Loopback targets are CLI login callbacks - token goes to the
    // user's own machine, so they are safe to allow on any port.
    // The local callback server is plain http by definition.
    const isLoopbackHttp =
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (allowedOrigins.includes(url.origin) || isLoopbackHttp)
    ) {
      return url.toString();
    }
  } catch {
    // fall through
  }
  const base = process.env.CLIENT_URL || "http://localhost:5173";
  return `${base}/auth-success`;
}

function signUserToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

// ================= EMAIL LOGIN =================
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // Unknown emails get the same generic error - no auto-registration,
    // no account enumeration
    if (!user || !user.password) {
      const socialOnly = user && !user.password;
      if (socialOnly) {
        return res.status(400).json({
          message: "This email is linked to a social account. Sign in with Google or GitHub.",
        });
      }
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = signUserToken(user);

    res.json({
      token,
      user: { _id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================= EMAIL REGISTER =================
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists. Please sign in." });
    }

    const data = { email, password, provider: "local" };
    if (username && username.trim()) data.username = username.trim();

    const user = await User.create(data);

    const token = signUserToken(user);

    res.status(201).json({
      token,
      user: { _id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ================= GOOGLE =================
router.get("/user/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

router.get(
  "/user/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = signUserToken(req.user);

    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/auth-success?token=${token}`);
  }
);

router.get(
  "/google",
  (req, res, next) => {
    req.session.redirect = req.query.redirect;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = signUserToken(req.user);

    const redirect = safeClientRedirect(req.query.redirect || req.session?.redirect);
    res.redirect(`${redirect}${redirect.includes("?") ? "&" : "?"}token=${token}`);
  }
);

// ================= GITHUB =================
router.get(
  "/github",
  (req, res, next) => {
    req.session.redirect = req.query.redirect;
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = signUserToken(req.user);

    const redirect = safeClientRedirect(req.query.redirect || req.session?.redirect);
    res.redirect(`${redirect}${redirect.includes("?") ? "&" : "?"}token=${token}`);
  }
);

// ================= PROFILE =================
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json({ user });
});

// ================= UPDATE PROFILE =================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const update = {};
    if (username !== undefined) update.username = username;
    if (avatar !== undefined) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ================= CHANGE PASSWORD =================
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }
    const user = await User.findById(req.userId);
    if (!user.password) {
      return res.status(400).json({ success: false, message: "OAuth users cannot change password here" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ================= NOTIFICATIONS (stub) =================
router.get("/notifications", authMiddleware, async (req, res) => {
  res.json({ success: true, notifications: [] });
});

router.patch("/notifications/mark-all-read", authMiddleware, async (req, res) => {
  res.json({ success: true });
});

export default router;
