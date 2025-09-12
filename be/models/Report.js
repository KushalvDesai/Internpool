// models/Report.js
import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema({
  weekNumber: Number,
  questions: [
    {
      question: String,
      answer: String
    }
  ]
});

const reportSchema = new mongoose.Schema({
  record: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipRecord', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  studentID: { type: String, required: true },
  facultyCode: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  gradedAt: Date,
  grade: { type: Number, min: 0, max: 10 },
  weeklyReports: {
    type: [weeklyReportSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 6']
  }
});

function arrayLimit(val) {
  return val.length >= 4 && val.length <= 6;
}

const Report = mongoose.model('Report', reportSchema);
export default Report;
