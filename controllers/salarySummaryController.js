// controllers/salarySummaryController.js
const SalarySummary = require("../models/SalarySummary");

/**
 * @desc Save salary summaries from Excel upload
 * @route POST /api/salary-summary
 */
exports.saveSalarySummary = async (req, res) => {
  try {
    const { summaries } = req.body;
    // summaries should be an array: [{ employeeCode, month, salaryDetails }, ...]

    if (!summaries || !Array.isArray(summaries)) {
      return res.status(400).json({ message: "Invalid or missing data" });
    }

    let savedRecords = [];

    for (let summary of summaries) {
      const { employeeCode, month, salaryDetails } = summary;

      if (!employeeCode || !month || !salaryDetails) {
        continue; // skip invalid rows
      }

      // Upsert (insert or update if exists)
      const record = await SalarySummary.findOneAndUpdate(
        { employeeCode, month },
        { salaryDetails },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      savedRecords.push(record);
    }

    res.status(200).json({
      message: "Salary summaries saved successfully",
      data: savedRecords
    });
  } catch (error) {
    console.error("Error saving salary summaries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get salary summaries for a specific month or all
 * @route GET /api/salary-summary?month=2025-08
 */
exports.getSalarySummary = async (req, res) => {
  try {
    const { month } = req.query;
    let filter = {};

    if (month) {
      filter.month = month; // Format: YYYY-MM
    }

    const summaries = await SalarySummary.find(filter).sort({ employeeCode: 1 });

    res.status(200).json(summaries);
  } catch (error) {
    console.error("Error fetching salary summaries:", error);
    res.status(500).json({ message: "Server error" });
  }
};
