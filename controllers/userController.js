const User = require('../models/user');
const registerUser = async (req, res) => {
    try {
        const { name, email, companyId } = req.body;
        const user = await User.create({ name, email, companyId });
        res.status(201).json({ userId: user._id, companyId: user.companyId, role: user.role });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('companyId').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, getUserDetails };