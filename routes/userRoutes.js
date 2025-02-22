const express = require('express');
const router = express.Router();
const {  registerUser, getUserDetails } = require('../controllers/userController');

router.post('/',registerUser);
router.get('/:userId', getUserDetails);
module.exports = router;