const AdvancePayment = require('../models/AdvancedPayment');
const SalarySummary = require('../models/SalarySummary');
const Candidate = require('../models/Candidate');

// Create a new advance payment
exports.createAdvancePayment = async (req, res) => {
  try {
    const { employeeCode, year, month, amount, comments } = req.body;
    if (!employeeCode || !year || !month || !amount) {
      return res.status(400).json({ error: 'employeeCode, year, month, and amount are required.' });
    }

    // Check if salary for this month is already built
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const salaryExists = await SalarySummary.findOne({ employeeCode, month: monthKey });
    if (salaryExists) {
      return res.status(400).json({ error: 'Cannot assign advance for a month whose salary is already built.' });
    }

    // Check if employee exists
    const employee = await Candidate.findOne({ code: employeeCode });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Save advance payment
    const advance = new AdvancePayment({
      employeeCode,
      year,
      month,
      amount,
      comments,
      createdBy: req.user ? req.user?.id : null,
    });
    await advance.save();
    res.status(201).json({ message: 'Advance payment assigned successfully.', advance });
  } catch (error) {
    console.error('Error creating advance payment:', error);
    res.status(500).json({ error: 'Failed to assign advance payment.' });
  }
};

// Get all advances for an employee (optionally filter by year/month)
exports.getAdvancePayments = async (req, res) => {
  try {
    const { employeeCode, year, month } = req.query;
    const filter = {};
    if (employeeCode) filter.employeeCode = employeeCode;
    if (year) filter.year = year;
    if (month) filter.month = month;

    const advances = await AdvancePayment.find(filter).sort({ createdAt: -1 });
    res.status(200).json(advances);
  } catch (error) {
    console.error('Error fetching advances:', error);
    res.status(500).json({ error: 'Failed to fetch advance payments.' });
  }
};

// Delete advance payment
exports.deleteAdvancePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const advance = await AdvancePayment.findByIdAndDelete(id);
    if (!advance) {
      return res.status(404).json({ error: 'Advance payment not found.' });
    }
    res.json({ message: 'Advance payment deleted.' });
  } catch (error) {
    console.error('Error deleting advance:', error);
    res.status(500).json({ error: 'Failed to delete advance payment.' });
  }
};