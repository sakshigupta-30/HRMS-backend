const mongoose = require("mongoose");

const SalarySummarySchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, trim: true },
    month: { 
      type: String, 
      required: true, 
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"] 
    },
    salaryDetails: { type: Object, required: true }
  },
  { timestamps: true }
);

// Unique per employee per month
SalarySummarySchema.index({ employeeCode: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("SalarySummary", SalarySummarySchema);
