const Company = require('../models/company');
const createCompany = async (req, res) => {
    try {
        const { name, parentCompanyId } = req.body;
        let hierarchyLevel = 1;
        if (parentCompanyId) {
            const parentCompany = await Company.findById(parentCompanyId);
            if (!parentCompany) return res.status(400).json({ error: 'Parent company not found' });
            hierarchyLevel = parentCompany.hierarchyLevel + 1;
        }
        const company = await Company.create({ name, parentCompanyId, hierarchyLevel });
        res.status(201).json({ companyId: company._id, hierarchyLevel: company.hierarchyLevel });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const getCompanyDetails = async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId).populate('parentCompanyId').lean();
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createCompany, getCompanyDetails };