import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/auth.middleware.js";
import passport from "../config/Passport.js";

const router = express.Router();



// ================= EMAIL LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    // 🔥 AUTO REGISTER
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashed });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json("Invalid password");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});


// ================= GOOGLE =================
router.get("/user/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

router.get(
  "/user/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET
    );

    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);

router.get(
  "/google",
  (req, res, next) => {
    const redirect = req.query.redirect;
    req.session.redirect = redirect;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET
    );

    const redirect = req.query.redirect || req.session?.redirect;

    if (redirect) {
      return res.redirect(`${redirect}?token=${token}`);
    }

    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);

// ================= GITHUB =================
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET
    );

    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
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

export default router;