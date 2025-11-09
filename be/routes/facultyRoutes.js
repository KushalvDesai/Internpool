import express from "express";
import { Faculty, Student } from "../models/User.js";
import { InternshipRecord } from "../models/Record.js";
import Report from "../models/Report.js";
import { Company } from "../models/Company.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get faculty's assigned students
router.get("/students", authenticate, authorize("faculty"), async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.user._id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    const students = await Student.find({ batch: faculty.assignedBatch });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// Get students by internship type
router.get("/students/internshipType/:type", authenticate, authorize("faculty"), async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.user._id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    const records = await InternshipRecord.find({ internshipType: req.params.type })
      .populate("student")
      .populate("company");
    const filtered = records.filter(r => r.student?.batch === faculty.assignedBatch);
    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

// Get specific student
router.get("/students/:studentID", authenticate, authorize("faculty"), async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.user._id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    const student = await Student.findById(req.params.studentID);
    if (!student || student.batch !== faculty.assignedBatch) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// Get student's reports
router.get("/reports/:studentID", authenticate, authorize("faculty"), async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.user._id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    const student = await Student.findById(req.params.studentID);
    if (!student || student.batch !== faculty.assignedBatch) {
      return res.status(403).json({ message: "Access denied" });
    }
    const reports = await Report.find({ student: req.params.studentID })
      .populate("company")
      .populate("record");
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

// Grade weekly report
router.put("/report/grade/:reportId", authenticate, authorize("faculty"), async (req, res, next) => {
  try {
    const { weekNumber, grade, remarks } = req.body;
    if (weekNumber === undefined || grade === undefined) {
      return res.status(400).json({ message: "Week number and grade are required" });
    }
    if (grade < 0 || grade > 10) {
      return res.status(400).json({ message: "Grade must be between 0 and 10" });
    }
    
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.faculty.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const week = report.weeklyReports.find(w => w.weekNumber === weekNumber);
    if (!week || !week.submittedAt) {
      return res.status(400).json({ message: "Cannot grade. Not submitted." });
    }
    
    week.grade = grade;
    week.gradedAt = new Date();
    if (remarks) week.remarks = remarks;
    await report.save();
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// Get all companies
router.get("/companies", authenticate, authorize("faculty"), async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

export default router;
