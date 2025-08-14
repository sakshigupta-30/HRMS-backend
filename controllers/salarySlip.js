
const path = require("path");
const puppeteer = require("puppeteer-core"); // ✅ use puppeteer-core
const fs = require("fs");
const SalarySummary = require("../models/SalarySummary");
const Candidate = require("../models/Candidate");
const chromium = require("chrome-aws-lambda"); // ✅ serverless chromium
const salarySlipStyles = fs.readFileSync(
  path.join(__dirname, "SalarySlipTemplate.css"),
  "utf-8"
);
// Helper to get month name from month number
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "long" });
};
const generateSalarySlipPDF = async (req, res) => {
  const { phone, month, year, employeeCode } = req.query;

  if ((!phone && !employeeCode) || !month || !year) {
    return res
      .status(400)
      .json({ error: "phone, month, and year are required" });
  }

  let employeeData;
  if (employeeCode) {
    employeeData = await Candidate.findOne({ code: employeeCode });
  } else {
    employeeData = await Candidate.findOne({
      "personalDetails.phone": phone,
    });
  }
  if (!employeeData) {
    return res.status(404).json({ error: "Employee not found" });
  }

  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const salary = await SalarySummary.findOne({
    employeeCode: employeeData.code,
    month: monthKey,
  });
  if (!salary) {
    return res
      .status(404)
      .json({ error: "Salary slip not found for this month" });
  }

  try {
    const employee = {
      ...employeeData.toObject(),
      ...salary.salaryDetails,
    };

    const formatAmount = (val) =>
      isNaN(val) || val === null ? "₹0" : `₹${Math.round(val)}`;

     const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>${salarySlipStyles}</style>
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
      Salary / Wages Advice for the Month: ${getMonthName(month)} ${year}
    </div>
  </div>

  <!-- Employee Info -->
  <div class="salary-emp-info-grid">
    <div class="salary-emp-column">
      <div>Emp Code: ${employee.code}</div>
      <div>Emp Name: ${employee.Name}</div>
      <div>F/H Name: -</div>
    </div>
    <div class="salary-emp-column">
    <div>Designation: ${employee.Designation}</div>
    <div>Location: Gurgaon-FC5</div>
    <div>DOJ: ${employee.availableFrom ? employee.availableFrom.toISOString().slice(0, 10) : "-"}</div>
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

    // ✅ Launch chromium compatible with Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    const pdfFileName = `${
      employee.code || "EMP"
    }_${employee.Name || ""}_${month}_${year}_SalarySlip.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${pdfFileName}`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error generating PDF", err: error.message });
  }
};

module.exports = { generateSalarySlipPDF };
