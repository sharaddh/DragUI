import jwt from "jsonwebtoken";

export default function adminAuth(
  req,
  res,
  next
) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
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