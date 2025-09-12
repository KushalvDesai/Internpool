import express from "express";
import { Company } from "../models/Company.js";
import { InternshipRecord } from "../models/Record.js";
import Report from "../models/Report.js";
import { Faculty, Student } from "../models/User.js";

const router = express.Router();

// View all companies
router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

// View assigned faculty (batch match)
router.get("/faculty/:studentId", async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const faculty = await Faculty.findOne({ assignedBatch: student.batch });
  res.json(faculty);
});

// Create internship record
router.post("/internship", async (req, res) => {
  const record = new InternshipRecord(req.body);
  await record.save();
  res.status(201).json(record);
});

// Create weekly report (submit report)
router.post("/report", async (req, res) => {
  const report = new Report(req.body);
  await report.save();
  res.status(201).json(report);
});

export default router;
