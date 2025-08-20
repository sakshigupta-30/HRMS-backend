const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fontkit = require("fontkit");
const nodemailer = require("nodemailer");
const Candidate = require("../models/Candidate");

async function generateOfferLetter({ name, designation, date, joiningDate, salary }) {
    // Load template
    const templatePath = path.join(__dirname, "offerletter.pdf");
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1]; // <-- second page
    pdfDoc.registerFontkit(fontkit);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const robotoRegularBytes = fs.readFileSync(path.join(__dirname, "Roboto-Regular.ttf"));
    const robotoMediumBytes = fs.readFileSync(path.join(__dirname, "Roboto-Medium.ttf"));
    // console.log(robotoRegularBytes, robotoMediumBytes);
    const robotoRegular = await pdfDoc.embedFont(robotoRegularBytes);
    const robotoMedium = await pdfDoc.embedFont(robotoMediumBytes);
    const fontSize = 10;
    firstPage.drawRectangle({
        x: 75,
        y: 690,
        width: 120,
        height: 15,
        color: rgb(1, 1, 1), // white
    });
    firstPage.drawRectangle({
        x: 78,
        y: 675,
        width: 120,
        height: 15,
        color: rgb(1, 1, 1), // white
    });
    secondPage.drawRectangle({
        x: 75,
        y: 332,
        width: 120,
        height: 15,
        color: rgb(1, 1, 1), // white
    });
    secondPage.drawRectangle({
        x: 107,
        y: 305,
        width: 120,
        height: 15,
        color: rgb(1, 1, 1), // white
    });
    secondPage.drawRectangle({
        x: 99,
        y: 290,
        width: 120,
        height: 15,
        color: rgb(1, 1, 1), // white
    });
    // ------- PAGE 1 -------
    firstPage.drawText(date||"N/A", { x: 80, y: 694, size: fontSize, font }); // "Date: _____"
    firstPage.drawText(name||"N/A", { x: 80, y: 679, size: fontSize, fontBold }); // "Dear: _______"
    firstPage.drawText(designation||"N/A", { x: 262, y: 645, size: fontSize + 1, robotoMedium }); // "position of _____"
    firstPage.drawText(joiningDate||"N/A", { x: 249, y: 583, size: fontSize + 1, robotoMedium }); // "date of appointment"
    firstPage.drawText(`${salary||"N/A"}`, { x: 238, y: 540, size: fontSize + 1, robotoMedium }); // "monthly NTH"

    // ------- PAGE 2 -------
    secondPage.drawText(name||"N/A", { x: 76, y: 335, size: fontSize, font }); // "Name: ______"
    //   secondPage.drawText("Raymoon Service Pvt Ltd (Gurgaon)", { x: 130, y: 360, size: fontSize, font }); // "Location"
    secondPage.drawText(joiningDate||"N/A", { x: 112, y: 309, size: fontSize, font }); // "Date of Joining"
    secondPage.drawText(designation||"N/A", { x: 100, y: 295, size: fontSize, font }); // "Designation"

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}


exports.sendEmailOfferLetter = async (req, res) => {
    try {
        const { employeeCode } = req.body;
        const employee = await Candidate.findOne({ code: employeeCode });
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        const name = employee.personalDetails.firstName + " " + employee.personalDetails.lastName;
        const designation = employee.professionalDetails.designation;
        const date = new Date().toLocaleDateString();
        const joiningDate = employee.professionalDetails.dateOfJoining || employee.professionalDetails.availableFromDate || new Date().toLocaleDateString();
        const salary = employee.professionalDetails.salary.actualSalary?.toLocaleString("en-IN")||employee.salary.actualSalary?.toLocaleString("en-IN") || "20,000";

        const pdfBytes = await generateOfferLetter({ name, designation, date, joiningDate, salary });

        // ---------------- Nodemailer Transport ----------------
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use SMTP config
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS, // your app password
            },
        });

        const mailOptions = {
            from: `"HR Team" <${process.env.EMAIL_USER}>`,
            to: employee.personalDetails.email, // candidate email
            subject: "Your Offer Letter",
            text: `Dear ${name},\n\nPlease find attached your offer letter for the role of ${designation}.\n\nBest Regards,\nHR Team`,
            attachments: [
                {
                    filename: "OfferLetter.pdf",
                    content: Buffer.from(pdfBytes), // attach buffer
                    contentType: "application/pdf",
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({message:"Offer letter sent successfully to " + employee.personalDetails.email});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Error sending offer letter"});
    }
};
