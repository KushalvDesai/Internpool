import express from "express";
import { Faculty, Student } from "../models/User.js";
import { InternshipRecord } from "../models/Record.js";
import Report from "../models/Report.js";
import { Company } from "../models/Company.js";

const router = express.Router();

// View students of assigned batch
router.get("/students/:facultyId", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    const students = await Student.find({ batch: faculty.assignedBatch });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View students by internshipType
router.get("/students/internshipType/:type", async (req, res) => {
  const records = await InternshipRecord.find({ internshipType: req.params.type }).populate("student");
  res.json(records);
});

// View students by ID
router.get("/students/id/:studentId", async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
});

// View Weekly reports of a student (only submitted)
router.get("/reports/:studentId", async (req, res) => {
  try {
    // Find reports for the student
    const reports = await Report.find({ student: req.params.studentId });
    const submittedReports = reports.filter(r =>
      r.weeklyReports.some(w => w.submittedAt)
    );
    res.json(submittedReports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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


// View companies
router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

export default router;
