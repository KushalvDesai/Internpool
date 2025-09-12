import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty", "admin"], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { discriminatorKey: "role", timestamps: true });

export const User = mongoose.model("User", userSchema);

// Student Schema extra fields in student that all users dont have
const studentSchema = new mongoose.Schema({
  studentID: { type: String, required: true, unique: true },
  batch: { type: String, required: true },
});

export const Student = User.discriminator("student", studentSchema);

// Faculty Schema extra fields in faculty that all users dont have
const facultySchema = new mongoose.Schema({
  facultyCode: { type: String, required: true, unique: true },
  assignedBatch: { type: String, required: true },
});

export const Faculty = User.discriminator("faculty", facultySchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
    adminID: { type: String, required: true, unique: true },
});

export const Admin = User.discriminator("admin", adminSchema);
