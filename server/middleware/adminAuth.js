import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export default async function adminAuth(
  req,
  res,
  next
) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Must carry an admin claim - user JWTs ({ userId }) are rejected here
    if (!decoded.adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const admin =
      await Admin.findById(
        decoded.adminId
      ).select("isActive");

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.adminId =
      decoded.adminId;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  }

}
