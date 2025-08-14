const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const SalarySummary = require("../models/SalarySummary");
const Candidate = require("../models/Candidate");
const generateSalarySlipPDF = async (req, res) => {
  const { phone, month, year } = req.query;

  if (!phone || !month || !year) {
    return res.status(400).json({ error: "phone, month, and year are required" });
  }

  const employeeData = await Candidate.findOne({ "personalDetails.phone": phone });
  if (!employeeData) {
    return res.status(404).json({ error: "Employee not found" });
  }

  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const salary = await SalarySummary.findOne({
    employeeCode: employeeData.code,
    month: monthKey,
  });
  if (!salary) {
    return res.status(404).json({ error: "Salary slip not found for this month" });
  }
  try {
    const employee = {
      ...employeeData.toObject(),
      ...salary.salaryDetails, // flatten salaryDetails fields to root
    }; // Pass employee object from client

    // Function to format currency
    const formatAmount = (val) =>
      isNaN(val) || val === null ? "₹0" : `₹${Math.round(val)}`;

    // Build HTML with inline CSS (taken from your SalarySlipTemplate.css)
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
${fs.readFileSync(path.join(process.cwd(), "public", "SalarySlipTemplate.css"), "utf-8")}
</style>
</head>
<body>
<div class="salary-container">
  <!-- Header -->
  <div class="salary-header-row">
    <div class="salary-header-left">
      <div class="company-name">Raymoon Services Private Limited</div>
      <div class="company-address">
        DLF Corporate Greens, Unit no. 807, 8th floor, sec 74A, Gurgaon 122004
      </div>
    </div>
    <div class="company-logo">
      <img src="https://hrms-dashboard-six.vercel.app/assets/logo-9a4af12d.png" alt="Company Logo" class="company-logo-img" />
    </div>
  </div>

  <!-- Title -->
  <div class="salary-title-row">
    <div class="salary-title-text">Salary Slip</div>
    <div class="salary-subtitle-text">
      Salary / Wages Advice for the Month: March 2024
    </div>
  </div>

  <!-- Employee Info -->
  <div class="salary-emp-info-grid">
    <div class="salary-emp-column">
      <div>Emp Code: ${employee["Employee Code"]}</div>
      <div>Emp Name: ${employee.Name}</div>
      <div>F/H Name: -</div>
    </div>
    <div class="salary-emp-column">
      <div>Designation: ${employee.Designation}</div>
      <div>Location: Gurgaon-FC5</div>
      <div>DOJ: ${employee["DOJ"] ?? "-"}</div>
    </div>
    <div class="salary-emp-column">
      <div>PF / UAN No: ${employee["PF/UAN"] ?? "-"}</div>
      <div>ESIC No: ${employee["ESIC No"] ?? "-"}</div>
      <div>Bank A/C No: ${employee["Bank A/C"] ?? "-"}</div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="salary-main-grid">
    <div class="main-grid-column">
      <strong>Rate of Salary / Wages</strong>
      <div>Basic: ${formatAmount(employee["Basic"])}</div>
      <div>HRA: ${formatAmount(employee["HRA"])}</div>
      <div>Retention: ${formatAmount(employee["Retention"] ?? employee["4 Hrs Retention"])}</div>
      <div>Other Allowances: ${formatAmount(employee["Other Allowances"])}</div>
    </div>

    <div class="main-grid-column">
      <strong>Earnings</strong>
      <div>Earned Basic: ${formatAmount(employee["Earned Basic"])}</div>
      <div>Earned HRA: ${formatAmount(employee["Earned HRA"])}</div>
      <div>Earned Retention: ${formatAmount(employee["Earn Retention"])}</div>
      <div>Earned OT: ${formatAmount(employee["Earn OT"])}</div>
      <div>Earned Extra Duty: ${formatAmount(employee["Earn Extra Duty"])}</div>
      <div>Earned Allowances: ${formatAmount(employee["Earn Other Allow"])}</div>
      ${employee["Attendance Bonus"] !== undefined ? `<div>Attendance Bonus: ${formatAmount(employee["Attendance Bonus"])}</div>` : ""}
      <strong>Total Earnings: ${formatAmount(employee["Earned Gross Pay"])}</strong>
    </div>

    <div class="main-grid-column">
      <strong>Deductions</strong>
      <div>PF (12%): ${formatAmount(employee["Emp PF"])}</div>
      <div>ESI (0.75%): ${formatAmount(employee["Emp ESI"])}</div>
      <div>LWF: ${formatAmount(employee["LWF"])}</div>
      <div>Other Deductions: ${formatAmount(employee["Other Deductions"] ?? 0)}</div>
      <strong>Total Deduction: ${formatAmount(employee["Total Deductions"])}</strong>
    </div>

    <div class="main-grid-column">
      <strong>Attendance / Leave</strong>
      <div>Days of Month: ${employee["Total Days"] ?? 31}</div>
      <div>Paid Days: ${employee["Total Paid Days"] ?? 0}</div>
      <div>OT Hrs: ${employee["OT Hours"] ?? 0}</div>
    </div>

    <div class="main-grid-column">
      <strong>Payment & Signature</strong>
      <div>Mode of Payment: ${employee["Payment Mode"] ?? "NEFT"}</div>
      <div>Net Pay: ${formatAmount(employee["Net Pay"])}</div>
      <div class="signature-box">Signature of Employee</div>
      <div class="salary-note">This is a computer-generated slip.</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="salary-footer-row">
    <div class="footer-item">Gross: ${formatAmount(employee["Earned Gross Pay"])}</div>
    <div class="footer-item-deductions">Total Deduction: ${formatAmount(employee["Total Deductions"])}</div>
    <div class="footer-net-salary">Net Salary: ${formatAmount(employee["Net Pay"])}</div>
  </div>
</div>
</body>
</html>
`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=salary-slip.pdf",
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};
module.exports = { generateSalarySlipPDF };