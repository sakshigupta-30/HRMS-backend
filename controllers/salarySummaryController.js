const SalarySummary = require("../models/SalarySummary");

// Save or update salary summary for one employee and month
exports.saveSalarySummary = async (req, res) => {
  try {
    const { employeeCode, month, salaryDetails } = req.body;
    if (!employeeCode || !month || !salaryDetails) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const salarySummary = await SalarySummary.findOneAndUpdate(
      { employeeCode, month },
      { employeeCode, month, salaryDetails },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(salarySummary);
  } catch (err) {
    res.status(500).json({ error: "Failed to save salary summary", detail: err.message });
  }
};

exports.getSalarySummary = async (req, res) => {
  try {
    const { employeeCode, month } = req.query;
    if (!employeeCode || !month) {
      return res.status(400).json({ error: "Missing employeeCode or month" });
    }

    const salarySummary = await SalarySummary.findOne({ employeeCode, month });
    if (!salarySummary) return res.status(404).json({ error: "Not found" });

    res.json(salarySummary);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch salary summary" });
  }
};
