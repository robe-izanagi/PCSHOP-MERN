const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/login', authController.adminLogin);

router.post('/register', authController.registerUser);
router.get('/verify-email', authController.verifyEmail); // ?token=...


router.post('/google', authController.googleAuth);

module.exports = router;
