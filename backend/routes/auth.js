const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/login', authController.adminLogin);

router.post('/register', authController.registerUser);

router.post('/google', authController.googleAuth);

module.exports = router;
