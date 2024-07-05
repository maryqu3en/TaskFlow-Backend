const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const auth = require('../middleware/auth.middleware');
const { registerRules, loginRules, validate } = require('../middleware/validateFields');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;