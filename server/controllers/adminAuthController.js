import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign(
    { adminId: id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerAdmin = async (req, res, next) => {
  try {

    const {
      adminId,
      password,
      email,
      setupKey,
    } = req.body;

    // Registration is closed by default:
    // - open only while no admins exist (first-run bootstrap), or
    // - when the caller supplies ADMIN_SETUP_KEY matching the server env
    const adminCount =
      await Admin.countDocuments();

    const setupKeyValid =
      process.env.ADMIN_SETUP_KEY &&
      setupKey === process.env.ADMIN_SETUP_KEY;

    if (adminCount > 0 && !setupKeyValid) {
      return res.status(403).json({
        success: false,
        message: "Admin registration is disabled",
      });
    }

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: "adminId and password are required",
      });
    }

    const exists =
      await Admin.findOne({
        adminId,
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin =
      await Admin.create({
        adminId,
        password,
        email,
      });

    res.status(201).json({
      success: true,
      token: generateToken(admin._id),
      admin,
    });

  } catch (error) {

  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });



  }
};

export const loginAdmin = async (req, res, next) => {
  try {

    const {
      adminId,
      password,
    } = req.body;

    const admin =
      await Admin.findOne({
        adminId,
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account disabled",
      });
    }

    const match =
      await admin.comparePassword(
        password
      );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getProfile = async (
  req,
  res,
  next
) => {

  try {

    const admin =
      await Admin.findById(
        req.adminId
      ).select("-password");

    res.json({
      success: true,
      admin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};