import express from "express";
import { Company } from "../models/Company.js";
import { InternshipRecord } from "../models/Record.js";
import Report from "../models/Report.js";
import { Faculty, Student } from "../models/User.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all companies
router.get("/companies", authenticate, async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// Get student's assigned faculty
router.get("/faculty/:studentID", authenticate, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentID);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (req.user.role === "student" && req.user._id.toString() !== student._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    const faculty = await Faculty.findOne({ assignedBatch: student.batch });
    res.json(faculty);
  } catch (err) {
    next(err);
  }
});

// Get student's own data
router.get("/profile", authenticate, authorize("student"), async (req, res, next) => {
  try {
    const student = await Student.findById(req.user._id);
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// Get student's internships
router.get("/internships", authenticate, authorize("student"), async (req, res, next) => {
  try {
    const records = await InternshipRecord.find({ student: req.user._id })
      .populate("company")
      .populate("faculty");
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// Create internship record
router.post("/internship", authenticate, authorize("student"), async (req, res, next) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    
    const { batch, company, internshipType, stipend, offerLetter } = req.body;
    if (!batch || !company || !internshipType) {
      return res.status(400).json({ message: "Batch, company, and internshipType are required" });
    }
    
    const faculty = await Faculty.findOne({ assignedBatch: student.batch });
    if (!faculty) return res.status(404).json({ message: "No faculty assigned to your batch" });
    
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const batchYear = batch.slice(0, 2);
    const semester = (parseInt(currentYear) - parseInt(batchYear)).toString();
    
    const record = new InternshipRecord({
      student: req.user._id,
      studentID: student.studentID,
      faculty: faculty._id,
      facultyID: faculty.facultyID,
      semester,
      internshipType,
      company,
      stipend,
      offerLetter,
    });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

// Get student's reports
router.get("/reports", authenticate, authorize("student"), async (req, res, next) => {
  try {
    const reports = await Report.find({ student: req.user._id })
      .populate("company")
      .populate("faculty")
      .populate("record");
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

// Create report
router.post("/report", authenticate, authorize("student"), async (req, res, next) => {
  try {
    const { record, technology } = req.body;
    if (!record || !technology) {
      return res.status(400).json({ message: "Record and technology are required" });
    }
    
    const internshipRecord = await InternshipRecord.findById(record);
    if (!internshipRecord) return res.status(404).json({ message: "Internship record not found" });
    if (internshipRecord.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const student = await Student.findById(req.user._id);
    const faculty = await Faculty.findById(internshipRecord.faculty);
    
    const report = new Report({
      record,
      student: req.user._id,
      faculty: internshipRecord.faculty,
      company: internshipRecord.company,
      technology,
      studentID: student.studentID,
      facultyID: faculty.facultyID,
      weeklyReports: [],
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
});

// Submit weekly report
router.post("/report/:reportId/weekly", authenticate, authorize("student"), async (req, res, next) => {
  try {
    const { weekNumber, fromdate, todate, workingHours, questions } = req.body;
    if (!weekNumber || !fromdate || !todate || !workingHours) {
      return res.status(400).json({ message: "Week number, dates, and working hours are required" });
    }
    
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    if (report.weeklyReports.length >= 6) {
      return res.status(400).json({ message: "Maximum 6 weekly reports allowed" });
    }
    
    const weeklyReport = {
      weekNumber,
      fromdate: new Date(fromdate),
      todate: new Date(todate),
      workingHours,
      questions: questions || [],
      submittedAt: new Date(),
    };
    
    report.weeklyReports.push(weeklyReport);
    await report.save();
    res.json(report);
  } catch (err) {
    next(err);
  }
});

export default router;
