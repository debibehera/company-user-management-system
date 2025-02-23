// searchController.js
const User = require('../models/user');
const Company = require('../models/company');

const search = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        // Search Users
        const users = await User.aggregate([
            { $match: { $text: { $search: query } } },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            { $unwind: '$companyDetails' },
            {
                $graphLookup: {
                    from: 'companies',
                    startWith: '$companyDetails.parentCompanyId',
                    connectFromField: 'parentCompanyId',
                    connectToField: '_id',
                    as: 'parentHierarchy',
                    depthField: 'level'
                }
            }
        ]).limit(5);

        // Search Companies
        const companies = await Company.aggregate([
            { $match: { $text: { $search: query } } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'companyId',
                    as: 'associatedUsers'
                }
            },
            {
                $graphLookup: {
                    from: 'companies',
                    startWith: '$parentCompanyId',
                    connectFromField: 'parentCompanyId',
                    connectToField: '_id',
                    as: 'parentHierarchy',
                    depthField: 'level'
                }
            },
            { $limit: 5 }
        ]);

        res.json({
            users: users.map(user => ({
                name: user.name,
                email: user.email,
                role: user.role,
                company: {
                    name: user.companyDetails.name,
                    hierarchy: user.parentHierarchy.map(h => h.name).reverse()
                }
            })),
            companies: companies.map(company => ({
                name: company.name,
                hierarchyLevel: company.hierarchyLevel,
                hierarchy: company.parentHierarchy.map(h => h.name).reverse(),
                associatedUsers: company.associatedUsers.slice(0, 5).map(user => ({
                    name: user.name,
                    email: user.email,
                    role: user.role
                }))
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { search };
