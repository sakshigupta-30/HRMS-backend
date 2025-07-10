const Candidate = require('../models/Candidate');

// Add a new candidate
exports.addCandidate = async (req, res) => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();
        res.status(201).json({ message: 'Candidate added successfully' });
    } catch (error) {
        console.error('Error adding candidate:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let errorMessage = `This ${field} already exists. Please use a different value.`;
            if (field.includes('email')) errorMessage = 'A candidate with this email already exists.';
            else if (field.includes('phone')) errorMessage = 'A candidate with this phone number already exists.';
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

// Get all candidates
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({}).sort({ applicationDate: -1 });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single candidate
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
        res.json(candidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a candidate
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
        res.json({ message: 'Candidate updated successfully', candidate });
    } catch (error) {
        console.error('Error updating candidate:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let errorMessage = `This ${field} already exists. Please use a different value.`;
            if (field.includes('email')) errorMessage = 'A candidate with this email already exists.';
            else if (field.includes('phone')) errorMessage = 'A candidate with this phone number already exists.';
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

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return res.status(404).json({ error: 'Candidate not found. It may have already been deleted.' });
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ error: 'Unable to delete candidate. Please try again later.' });
    }
};
