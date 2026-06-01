import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import session from "express-session";
import passport from "./config/Passport.js";

dotenv.config();

const app = express();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuth.js";

app.use("/api/admin", adminRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
import componentRoutes from "./routes/componentRoutes.js";

app.use("/api/component", componentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
import componentRoutes from "./routes/componentRoutes.js";

app.use(
  "/api/components",
  componentRoutes
);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ DB connected");
  app.listen(5000, () => console.log("🚀 Server running on 5000"));
});