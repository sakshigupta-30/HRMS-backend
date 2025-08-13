const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const SalarySummary = require("../models/SalarySummary");
const Candidate = require("../models/Candidate");
const { generateSalarySlipPDF } = require("../controllers/salarySlip");

// Helper to format currency
const formatAmount = (val) =>
  isNaN(val) || val === null ? "₹0" : `₹${Math.round(val)}`;

// GET /api/salarylip/pdf-html?employeeCode=...&month=...&year=...
router.get("/pdf", generateSalarySlipPDF);

module.exports = router;