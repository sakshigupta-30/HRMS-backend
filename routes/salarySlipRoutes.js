const express = require("express");
const router = express.Router();
const SalarySummary = require("../models/SalarySummary");

router.post("/upload", async (req, res) => {
  try {
    await SalarySummary.insertMany(req.body); // Expecting summary array
    res.status(200).json({ message: "Summary uploaded successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
