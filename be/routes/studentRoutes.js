import express from "express";
import { Company } from "../models/Company.js";
import { InternshipRecord } from "../models/Record.js";
import Report from "../models/Report.js";
import { Faculty, Student } from "../models/User.js";

const router = express.Router();

router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

router.get("/faculty/:studentID", async (req, res) => {
  const student = await Student.findById(req.params.studentID);
  if (!student) return res.status(404).json({ message: "Student not found" });
  const faculty = await Faculty.findOne({ assignedBatch: student.batch });
  res.json(faculty);
});

router.post("/internship", async (req, res) => {
  const { batch } = req.body;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const batchYear = batch.slice(0, 2);
  const semester = parseInt(currentYear) - parseInt(batchYear);
  const record = new InternshipRecord({ ...req.body, semester });
  await record.save();
  res.status(201).json(record);
});

router.post("/report", async (req, res) => {
  const report = new Report(req.body);
  await report.save();
  res.status(201).json(report);
});

export default router;
