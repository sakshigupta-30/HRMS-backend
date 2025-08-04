const mongoose = require("mongoose");

const SalarySummarySchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true },
    month: { type: String, required: true }, // Format: "2025-08"
    salaryDetails: { type: Object, required: true }
  },
  { timestamps: true }
);

// Unique per employee per month
SalarySummarySchema.index({ employeeCode: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("SalarySummary", SalarySummarySchema);
