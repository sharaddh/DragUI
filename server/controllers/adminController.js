import Component from "../models/Component.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const dashboard =
async (
  req,
  res
) => {

  try {

    const [
      users,
      projects,
      components,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Component.countDocuments(),
    ]);

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


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};