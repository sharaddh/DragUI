import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import passport from "./config/Passport.js";
import connectDB from "./config/db.js";


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
import componentRoutes from "./routes/componentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

import adminRoutes
from "./routes/adminRoutes.js";

import adminAuthRoutes
from "./routes/adminAuth.js";

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin-auth",
  adminAuthRoutes
);
app.use("/api/auth", authRoutes);
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
import collaborationRoutes
from "./routes/collaborationRoutes.js";
app.use(
 "/api/collaboration",
 collaborationRoutes
);
import workspaceRoutes
from "./routes/workspaceRoutes.js";
app.use(
  "/api/workspaces",
  workspaceRoutes
);

import recommendationRoutes
from "./routes/recommendationRoutes.js";
app.use(
  "/api/recommendations",
  recommendationRoutes
);

import searchRoutes
from "./routes/searchRoutes.js";
app.use(
  "/api/search",
  searchRoutes
);

import componentAnalyticsRoutes
from "./routes/componentAnalyticsRoutes.js";
app.use(
 "/api/component-analytics",
 componentAnalyticsRoutes
);

import marketplaceRoutes
from "./routes/marketplaceRoutes.js";
app.use(
 "/api/marketplace",
 marketplaceRoutes
);
import aiProjectRoutes
from "./routes/aiProjectRoutes.js";
app.use(
 "/api/ai-projects",
 aiProjectRoutes
);
import publishRoutes
from "./routes/publishRoutes.js";
app.use(
 "/api/publish",
 publishRoutes
);

import uploadRoutes
from "./routes/uploadRoutes.js";

app.use(
 "/api/upload",
 uploadRoutes
);
import versionRoutes
from "./routes/versionRoutes.js";

app.use(
 "/api/versions",
 versionRoutes
);
import aiRoutes
from "./routes/aiRoutes.js";

app.use(
 "/api/ai",
 aiRoutes
);
import commentRoutes
from "./routes/commentRoutes.js";

app.use(
 "/api/comments",
 commentRoutes
);
// DB

connectDB();

// Start

const PORT =
  process.env.PORT || 5000;

import http from "http";

import {
 initializeSocket
}
from "./socket/index.js";
const server =
  http.createServer(
    app
  );
  server.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server Running On ${PORT}`
    );

  }
);