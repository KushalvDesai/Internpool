// models/Report.js
import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema({
  weekNumber: Number,
  fromdate: Date,
  todate: Date,
  workingHours: Number,
  questions: [
    {
      question: String,
      answer: String
    }
  ],
  submittedAt: { type: Date, default: Date.now },
  gradedAt: Date,
  grade: { type: Number, min: 0, max: 10 },
});

const reportSchema = new mongoose.Schema({
  record: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipRecord', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  technology: { type: String, required: true },
  studentID: { type: String, required: true },
  facultyID: { type: String, required: true },
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
