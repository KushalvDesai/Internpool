import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  hr: [
    {
      name: String,
      email: String,
      contact: String,
    }
  ],
  address: String,
  verified: { type: Boolean, default: false },
  website: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Company = mongoose.model("Company", companySchema);
