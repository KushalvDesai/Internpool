import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err.message));

// Routes
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/api/company", companyRoutes);

app.get("/", (req, res) => res.send("API running..."));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port https://localhost:${PORT}`));
