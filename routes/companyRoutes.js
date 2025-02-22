const express = require('express');
const router = express.Router();
const { createCompany, getCompanyDetails } = require('../controllers/companyController');

router.post('/', createCompany);
router.get('/:companyId', getCompanyDetails);
module.exports = router;