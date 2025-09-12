import express from "express";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import InternshipRecord from "../models/Record.js";
import Report from "../models/Report.js";
import Company from "../models/Company.js";

const router = express.Router();

// View students of assigned batch
router.get("/students/:facultyId", async (req, res) => {
  const faculty = await Faculty.findById(req.params.facultyId);
  const students = await Student.find({ batch: faculty.assignedBatch });
  res.json(students);
});

// View students by internshipType
router.get("/students/internshipType/:type", async (req, res) => {
  const records = await InternshipRecord.find({ internshipType: req.params.type }).populate("student");
  res.json(records);
});

// View Weekly reports of a student (only submitted)
router.get("/reports/:studentId", async (req, res) => {
  try {
    // Find reports for the student
    const reports = await Report.find({ student: req.params.studentId });

    // Filter: only keep reports where at least one weeklyReport has submittedAt
    const submittedReports = reports.filter(r =>
      r.weeklyReports.some(w => w.submittedAt)
    );

    res.json(submittedReports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update report grade
router.put("/report/grade/:reportId", async (req, res) => {
  const report = await Report.findById(req.params.reportId);
  const week = report.weeklyReports.find(w => w.weekNumber === req.body.weekNumber);
  week.grade = req.body.grade;
  week.gradedAt = new Date();
  await report.save();
  res.json(report);
});

// View companies
router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

export default router;
