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

    import { Router } from "express";
import { Bill } from "../models/bill";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { audit } from "../middleware/audit";

const router = Router();

const createSchema = z.object({
  customerId: z.string(),
  visitId: z.string().optional(),
  items: z.array(z.object({ description: z.string(), quantity: z.number().optional(), unitPrice: z.number().optional() })).optional(),
  discount: z.number().optional(),
  tax: z.number().optional(),
  advancePaid: z.number().optional()
});

router.get("/", async (req, res) => {
  const list = await Bill.find().limit(100);
  res.json({ success: true, data: list });
});

router.post("/", authenticate, audit, async (req, res) => {
  try {
    const p = createSchema.parse(req.body);
    const billNumber = `BILL-${Date.now()}`;
    const subtotal = (p.items || []).reduce((s, it) => s + ((it.quantity || 1) * (it.unitPrice || 0)), 0);
    const total = subtotal - (p.discount || 0) + (p.tax || 0);
    const bill = new Bill({ billNumber, ...p, subtotal, totalAmount: total, pendingAmount: total - (p.advancePaid || 0) } as any);
    await bill.save();
    res.json({ success: true, data: bill });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const b = await Bill.findById(req.params.id);
  if (!b) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: b });
});

export default router;


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