const mongoose = require("mongoose");

const AdvancePaymentSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    year: { type: Number, required: true },
    employeeCode: { type: String, required: true, unique:true }, // Format: "YYYY-MM"
    month: { type: String, required: true }, // Format: "YYYY-MM"
    amount: { type: Number, required: true, min: 0 },
    comments: { type: String, default: "" },
  },
  { timestamps: true }
);

// Unique constraint: each worker can have only one advance payment per month
AdvancePaymentSchema.index({ worker: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("AdvancePayment", AdvancePaymentSchema);