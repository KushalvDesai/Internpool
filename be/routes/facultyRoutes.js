import express from "express";
import { Faculty, Student } from "../models/User.js";
import { InternshipRecord } from "../models/Record.js";
import Report from "../models/Report.js";
import { Company } from "../models/Company.js";

const router = express.Router();

router.get("/students/:facultyId", async (req, res) => {
  const faculty = await Faculty.findById(req.params.facultyId);
  if (!faculty) return res.status(404).json({ message: "Faculty not found" });
  const students = await Student.find({ batch: faculty.assignedBatch });
  res.json(students);
});

router.get("/students/internshipType/:type", async (req, res) => {
  if (!req.query.facultyId) return res.status(400).json({ message: "facultyId is required" });
  const faculty = await Faculty.findById(req.query.facultyId);
  const records = await InternshipRecord.find({ internshipType: req.params.type }).populate("student");
  const filtered = records.filter(r => r.student?.batch === faculty.assignedBatch);
  res.json(filtered);
});

router.get("/students/id/:studentId", async (req, res) => {
  if (!req.query.facultyId) return res.status(400).json({ message: "facultyId is required" });
  const faculty = await Faculty.findById(req.query.facultyId);
  const student = await Student.findById(req.params.studentId);
  if (!student || student.batch !== faculty.assignedBatch) {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(student);
});

router.get("/reports/:studentId", async (req, res) => {
  if (!req.query.facultyId) return res.status(400).json({ message: "facultyId is required" });
  const faculty = await Faculty.findById(req.query.facultyId);
  const student = await Student.findById(req.params.studentId);
  if (!student || student.batch !== faculty.assignedBatch) {
    return res.status(403).json({ message: "Access denied" });
  }
  const reports = await Report.find({ student: req.params.studentId });
  const submitted = reports.filter(r => r.weeklyReports.some(w => w.submittedAt));
  res.json(submitted);
});

router.put("/report/grade/:reportId", async (req, res) => {
  const { weekNumber, grade } = req.body;
  const report = await Report.findById(req.params.reportId);
  const week = report?.weeklyReports.find(w => w.weekNumber === weekNumber);
  if (!week || !week.submittedAt) {
    return res.status(400).json({ message: "Cannot grade. Not submitted." });
  }
  week.grade = grade;
  week.gradedAt = new Date();
  await report.save();
  res.json(report);
});

router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

export default router;
