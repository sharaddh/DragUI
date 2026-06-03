import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import passport from "./config/passport.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Security

app.use(helmet());

// Compression

app.use(compression());

// Logging

app.use(morgan("dev"));

// CORS

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
    ],

    credentials: true,
  })
);

// Body Parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session

app.use(
  session({
    secret:
      process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,

      secure: false,

      maxAge:
        1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Health Check

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DropUI API Running",
  });
});

import errorHandler
from "./middleware/errorHandler.js";

import {
  apiLimiter,
} from "./middleware/rateLimiter.js";

app.use(apiLimiter);
app.use(errorHandler);
// Routes

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import componentRoutes from "./routes/componentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use(
  "/api/components",
  componentRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);
import analyticsRoutes
from "./routes/analyticsRoutes.js";

import assetRoutes
from "./routes/assetRoutes.js";
app.use(
 "/api/analytics",
 analyticsRoutes
);
import cliRoutes
from "./routes/cliRoutes.js";
app.use(
 "/api/cli",
 cliRoutes
);
app.use(
 "/api/assets",
 assetRoutes
);
import workspaceRoutes
from "./routes/workspaceRoutes.js";
app.use(
  "/api/workspaces",
  workspaceRoutes
);
// DB

connectDB();

// Start

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running On ${PORT}`
  );
});