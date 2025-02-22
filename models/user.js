const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true });

userSchema.index({ name: 'text', email: 'text' });
module.exports = mongoose.model('User', userSchema);