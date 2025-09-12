import express from "express";
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
import InternshipRecord from "../models/Record.js";

const router = express.Router();

// Assign batch to faculty
router.put("/faculty/:facultyId/assign", async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.facultyId,
    { assignedBatch: req.body.batch },
    { new: true }
  );
  res.json(faculty);
});

// View all students
router.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// View students by internshipType
router.get("/students/internshipType/:type", async (req, res) => {
  const records = await InternshipRecord.find({ internshipType: req.params.type }).populate("student");
  res.json(records);
});

export default router;
