import express from "express";
import { Faculty, Student } from "../models/User.js";
import { InternshipRecord } from "../models/Record.js";
import { Company } from "../models/Company.js";

const router = express.Router();

router.put("/faculty/:facultyId/assign", async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.facultyId,
    { assignedBatch: req.body.batch },
    { new: true }
  );
  res.json(faculty);
});

router.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.get("/students/internshipType/:type", async (req, res) => {
  const records = await InternshipRecord.find({ internshipType: req.params.type }).populate("student");
  res.json(records);
});

router.get("/companies", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

export default router;
