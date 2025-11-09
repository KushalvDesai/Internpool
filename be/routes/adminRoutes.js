import express from "express";
import { Faculty, Student } from "../models/User.js";
import { InternshipRecord } from "../models/Record.js";
import { Company } from "../models/Company.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Assign batch to faculty
router.put("/faculty/:facultyId/assign", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { batch } = req.body;
    if (!batch) return res.status(400).json({ message: "Batch is required" });
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.facultyId,
      { assignedBatch: batch },
      { new: true }
    );
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json(faculty);
  } catch (err) {
    next(err);
  }
});

// Get all students
router.get("/students", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// Get students by internship type
router.get("/students/internshipType/:type", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const records = await InternshipRecord.find({ internshipType: req.params.type })
      .populate("student")
      .populate("company")
      .populate("faculty");
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// Get all faculty
router.get("/faculty", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    next(err);
  }
});

// Get all companies
router.get("/companies", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// Get all internship records
router.get("/internships", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const records = await InternshipRecord.find()
      .populate("student")
      .populate("company")
      .populate("faculty");
    res.json(records);
  } catch (err) {
    next(err);
  }
});

export default router;
