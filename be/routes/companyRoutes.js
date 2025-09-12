import express from "express";
import { Company } from "../models/Company.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const company = new Company(req.body);
  await company.save();
  res.status(201).json(company);
});

router.put("/:id", async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.json(company);
});

router.delete("/:id", async (req, res) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.json({ message: "Company deleted" });
});

export default router;
