import mongoose from "mongoose";

const internshipRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentID: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  facultyCode: { type: String, required: true },
  semester: { type: String, required: true },
  internshipType: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  stipend: { type: Number },
  offerLetter: { type: String }, // Google Drive Link
  completionCertificate: { type: String }, // Google Drive Link
}, { timestamps: true });

export const InternshipRecord = mongoose.model("InternshipRecord", internshipRecordSchema);
