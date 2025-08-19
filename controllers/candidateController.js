const XLSX = require('xlsx');
const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');

// Helper to generate next employee code (RAY001, RAY002, ...)
const getNextEmployeeCode = async () => {
  const lastCandidate = await Candidate.findOne({
    isEmployee: true,
    code: { $regex: /^RAY\d+$/ }
  }).sort({ code: -1 }).lean();

  if (!lastCandidate || !lastCandidate.code) {
    return "RAY001";
  }

  const lastNum = parseInt(lastCandidate.code.replace("RAY", ""));
  const nextNum = (lastNum || 0) + 1;
  return `RAY${String(nextNum).padStart(3, "0")}`;
};

// Bulk upload candidates from Excel file
exports.bulkUploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let successCount = 0;
    let errors = [];

    const validDesignations = ['Picker&Packar', 'SG', 'HK'];

    for (const [index, row] of rows.entries()) {
      if (!row['NAME'] || !row['Designation']) {
        errors.push({ row: index + 2, error: 'Missing NAME or Designation' });
        continue;
      }

      const [firstName, ...rest] = row['NAME'].split(' ');
      const lastName = rest.join(' ');
      const phone = row['Phone'].trim();
      const designation = row['Designation'].trim();
      const agency = row['Agency'].trim();

      if (!validDesignations.includes(designation)) {
        errors.push({ row: index + 2, error: `Invalid Designation: ${designation}` });
        continue;
      }

      let availableFromDate = null;
      if (row['DoJ']) {
        const parsedDate = new Date(row['DoJ']);
        if (!isNaN(parsedDate)) {
          availableFromDate = parsedDate;
        } else {
          errors.push({ row: index + 2, error: 'Invalid DoJ date format' });
          continue;
        }
      }

      const payload = {
        personalDetails: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone
        },
        professionalDetails: {
          designation,
          agency,
          availableFrom: availableFromDate,

        },
        salary: {
          basic: parseFloat(row['Basic']) || 0,
          hra: parseFloat(row['HRA']) || 0,
          retention: parseFloat(row['4 Hrs Retention']) || 0,
          otherAllowances: parseFloat(row['Other Allowances']) || 0,
          actualSalary: parseFloat(row['Actual Salary']) || 0,
        },
        bankDetails: {
          accountNumber: row['Account Number'] || '',
          ifsc: row['Ifsc'] || ''
        },
        client: {
          name: row['Client Name'] || '',
          location: row['Location'] || '',
        },
        code: row['CODE'] || await getNextEmployeeCode(),
        status: 'Selected',
        isEmployee: true,
      };

      try {
        const candidate = new Candidate(payload);
        await candidate.save();
        successCount++;
      } catch (err) {
        errors.push({ row: index + 2, error: err.message });
      }
    }

    res.status(200).json({
      message: `Bulk upload complete, successfully added ${successCount} candidates.`,
      errors,
    });
  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ error: 'Failed to process bulk upload' });
  }
};
// Add a new candidate manually
exports.addCandidate = async (req, res) => {
  try {
    const data = req.body;
    if (data.professionalDetails?.currentJobTitle) {
      data.professionalDetails.designation = data.professionalDetails.currentJobTitle;
      delete data.professionalDetails.currentJobTitle;
    }
    if (!data.professionalDetails) data.professionalDetails = {};
    data.professionalDetails.agency = data.professionalDetails.agency || '';
    if (!data.client) {
      console.warn("No client assigned for this employee.");
    }

    if (data.status === 'Selected') {
      const count = await Candidate.countDocuments({ isEmployee: true });
      data.isEmployee = true;
      data.empId = `EMP${(count + 1).toString().padStart(3, '0')}`;

      if (!data.code) {
        data.code = await getNextEmployeeCode();
      }
    }
    const existing = await Candidate.findOne({ 'personalDetails.phone': data.personalDetails.phone });
    if (existing) {
      return res.status(400).json({ error: 'A candidate with this phone number already exists.' });
    }
    const candidate = new Candidate(data);
    await candidate.save();

    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    console.error('Error adding candidate:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = `This ${field} already exists. Please use a different value.`;
      if (field.includes('email')) errorMessage = 'A candidate with this email already exists.';
      else if (field.includes('phone')) errorMessage = 'A candidate with this phone number already exists.';
      else if (field === 'code') errorMessage = 'This code already exists. Please use a different code.';
      return res.status(400).json({ error: errorMessage });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => {
        if (err.kind === 'required') return `${err.path} is required`;
        if (err.kind === 'enum') return `${err.path} must be one of: ${err.enumValues.join(', ')}`;
        return err.message;
      });
      return res.status(400).json({ error: messages.join('. ') });
    }

    res.status(500).json({ error: 'Unable to add candidate. Please try again later.' });
  }
};

// Get all candidates with pagination and optional filters
exports.getCandidates = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.isEmployee !== undefined) {
      filters.isEmployee = req.query.isEmployee === 'true';
    }

    const candidates = await Candidate.find(filters)
      .sort({ code: 1 })
      .skip(skip)
      .limit(limit);

    const totalCandidates = await Candidate.countDocuments(filters);

    res.json({
      candidates,
      totalCandidates, // ✅ Added
      totalPages: Math.ceil(totalCandidates / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a candidate
exports.updateCandidate = async (req, res) => {
  try {
    const data = req.body;

    if (data.professionalDetails?.department) {
      delete data.professionalDetails.department;
    }
    if (data.professionalDetails?.currentJobTitle) {
      data.professionalDetails.designation = data.professionalDetails.currentJobTitle;
      delete data.professionalDetails.currentJobTitle;
    }

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    res.json({ message: 'Candidate updated successfully', candidate });
  } catch (error) {
    console.error('Error updating candidate:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = `This ${field} already exists. Please use a different value.`;
      if (field.includes('email')) errorMessage = 'A candidate with this email already exists.';
      else if (field.includes('phone')) errorMessage = 'A candidate with this phone number already exists.';
      else if (field === 'code') errorMessage = 'This code already exists. Please use a different code.';
      return res.status(400).json({ error: errorMessage });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => {
        if (err.kind === 'required') return `${err.path} is required`;
        if (err.kind === 'enum') return `${err.path} must be one of: ${err.enumValues.join(', ')}`;
        return err.message;
      });
      return res.status(400).json({ error: messages.join('. ') });
    }

    res.status(500).json({ error: 'Unable to update candidate. Please try again later.' });
  }
};

// Delete candidate by ID or temp-code
exports.deleteCandidate = async (req, res) => {
  try {
    const id = req.params.id;

    if (id.startsWith('temp-')) {
      const deletedCandidate = await Candidate.findOneAndDelete({ code: id });
      if (!deletedCandidate) {
        return res.status(404).json({ error: 'Candidate not found with temp code' });
      }
      return res.json({ message: 'Temp candidate deleted successfully' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid candidate ID format' });
    }

    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found. It may have already been deleted.' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Unable to delete candidate. Please try again later.' });
  }
};

// Update candidate status and promote to employee
exports.updateCandidateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    candidate.status = status;

    if (status === 'Selected' && !candidate.isEmployee) {
      candidate.isEmployee = true;
      const count = await Candidate.countDocuments({ isEmployee: true });
      candidate.empId = `EMP${(count + 1).toString().padStart(3, '0')}`;
    }

    await candidate.save();
    res.status(200).json({ message: 'Status updated successfully', candidate });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Candidate.find({ isEmployee: true }).sort({ code: 1 });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};
// Check Aadhaar uniqueness controller
exports.checkAadhar = async (req, res) => {
  try {
    const { aadharNo: aadhaarNumber } = req.params;
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ error: "Invalid Aadhaar number." });
    }

    const existing = await Candidate.findOne({ "personalDetails.aadhaarNumber": aadhaarNumber });
    if (existing) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking Aadhaar:', error);
    res.status(500).json({ error: 'Failed to check Aadhaar.' });
  }
};