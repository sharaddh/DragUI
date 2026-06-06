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
    } = req.body;

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