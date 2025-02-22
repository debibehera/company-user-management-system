const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    hierarchyLevel: { type: Number, default: 1 }
}, { timestamps: true });

companySchema.index({ name: 'text' });
module.exports = mongoose.model('Company', companySchema);