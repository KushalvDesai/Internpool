import express from "express";
import { Company } from "../models/Company.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all companies
router.get("/", authenticate, async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// Get single company
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// Create company (admin only)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Company name is required" });
    const company = new Company({ ...req.body, updatedBy: req.user._id });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
});

// Update company (admin only)
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id, updatedAt: new Date() },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// Delete company (admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
