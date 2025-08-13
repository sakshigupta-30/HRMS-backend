module.exports = ({ employee, salarySlip, month, year }) => ({
  content: [
    { text: "Raymoon Services Private Limited", style: "header" },
    { text: "DLF Corporate Greens, Unit no. 807, 8th floor, sec 74A, Gurgaon 122004", style: "subheader" },
    { text: `Salary Slip for ${month}/${year}`, style: "title" },
    {
      columns: [
        [
          { text: `Emp Code: ${employee.code}` },
          { text: `Emp Name: ${employee.personalDetails.firstName} ${employee.personalDetails.lastName}` },
        ],
        [
          { text: `Designation: ${employee.professionalDetails.designation}` },
          { text: `Location: Gurgaon-FC5` },
        ],
      ],
      margin: [0, 10, 0, 10],
    },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            { text: "Earnings", bold: true },
            { text: "Deductions", bold: true },
            { text: "Attendance", bold: true },
          ],
          [
            [
              `Basic: ₹${salarySlip["Basic"] ?? 0}`,
              `HRA: ₹${salarySlip["HRA"] ?? 0}`,
              `Retention: ₹${salarySlip["Retention"] ?? 0}`,
              `Other Allowances: ₹${salarySlip["Other Allowances"] ?? 0}`,
              `Earned Basic: ₹${salarySlip["Earned Basic"] ?? 0}`,
              `Earned HRA: ₹${salarySlip["Earned HRA"] ?? 0}`,
              `Earned Retention: ₹${salarySlip["Earn Retention"] ?? 0}`,
              `Earned OT: ₹${salarySlip["Earn OT"] ?? 0}`,
              `Earned Extra Duty: ₹${salarySlip["Earn Extra Duty"] ?? 0}`,
              `Earned Allowances: ₹${salarySlip["Earn Other Allow"] ?? 0}`,
              `Total Earnings: ₹${salarySlip["Earned Gross Pay"] ?? 0}`,
            ].join("\n"),
            [
              `PF (12%): ₹${salarySlip["Emp PF"] ?? 0}`,
              `ESI (0.75%): ₹${salarySlip["Emp ESI"] ?? 0}`,
              `LWF: ₹${salarySlip["LWF"] ?? 0}`,
              `Other Deductions: ₹${salarySlip["Other Deductions"] ?? 0}`,
              `Total Deduction: ₹${salarySlip["Total Deductions"] ?? 0}`,
            ].join("\n"),
            [
              `Days of Month: ${salarySlip["Total Days"] ?? 31}`,
              `Paid Days: ${salarySlip["Total Paid Days"] ?? 0}`,
              `OT Hrs: ${salarySlip["OT Hours"] ?? 0}`,
            ].join("\n"),
          ],
        ],
      },
      margin: [0, 10, 0, 10],
    },
    {
      columns: [
        { text: `Net Pay: ₹${salarySlip["Net Pay"] ?? 0}`, bold: true },
        { text: "This is a computer-generated slip.", alignment: "right", italics: true },
      ],
    },
  ],
  styles: {
    header: { fontSize: 16, bold: true },
    subheader: { fontSize: 10, margin: [0, 0, 0, 5] },
    title: { fontSize: 13, bold: true, margin: [0, 10, 0, 10] },
  },
});