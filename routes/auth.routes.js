const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');

// create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

// login user
router.post('/users/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).send({ message: 'Unable to login. Check your credentials and try again.' });
    }
});

// logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;