const search = async (req, res) => {
    try {
        const query = req.query;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const users = await User.aggregate([
            {
              $match: { $text: { $search: query } }, // Text search on name and email
            },
            {
              $lookup: {
                from: 'companies', // Join with the Company collection
                localField: 'companyId',
                foreignField: '_id',
                as: 'company',
              },
            },
            {
              $unwind: '$company', // Unwind the joined company array
            },
            {
              $project: {
                name: 1,
                email: 1,
                role: 1,
                company: {
                  name: '$company.name',
                  parentCompany: '$company.parentCompanyId',
                },
              },
            },
            {
              $limit: 5, // Limit to 5 users
            },
          ]);
          const companies = await Company.aggregate([
            {
              $match: { $text: { $search: query } }, // Text search on name
            },
            {
              $lookup: {
                from: 'users', // Join with the User collection
                localField: 'users',
                foreignField: '_id',
                as: 'users',
              },
            },
            {
              $project: {
                name: 1,
                hierarchyLevel: 1,
                users: {
                  $slice: ['$users', 5], // Limit to 5 users
                },
              },
            },
            {
              $limit: 5, // Limit to 5 companies
            },
          ]);
         
         const formattedUsers = users.map((user) => ({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    company: {
                      name: user.companyId.name,
                      parentCompany: user.companyId.parentCompanyId
                        ? user.companyId.parentCompanyId.name
                        : null,
                    },
                  }));
              
         const formattedCompanies = companies.map((company) => ({
                    name: company.name,
                    hierarchy: company.hierarchyLevel,
                    users: company.users.slice(0, 5).map((user) => ({
                      name: user.name,
                      email: user.email,
                      role: user.role,
                    })),
                  }));
      res.status(200).json( { users: formattedUsers, companies: formattedCompanies });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { search };
