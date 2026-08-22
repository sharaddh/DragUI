import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Decodes the bearer token when present but NEVER rejects the request.
// Sets req.user/req.userId on success; leaves them undefined otherwise.
export default async function optionalAuth(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token =
        authHeader.split(" ")[1];

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      if (decoded.userId) {
        const user =
          await User.findById(
            decoded.userId
          ).select("_id");

        if (user) {
          req.user = user;
          req.userId = user._id;
        }
      }
    }
  } catch (error) {
    // Invalid/expired token -> continue unauthenticated
  }

  next();
}
