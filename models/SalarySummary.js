const mongoose = require('mongoose');

const SalarySummarySchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  absent: Number,
  weekOff: Number,
  holiday: Number,
  leave: Number,
  compOff: Number,
  workingOnHoliday: Number,
  totalPaidDays: Number,
  ot: Number,
}, { timestamps: true });

module.exports = mongoose.model('SalarySummary', SalarySummarySchema);
