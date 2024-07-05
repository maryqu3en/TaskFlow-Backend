const User = require('../models/user.model');
const { generateToken, deleteToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        const token = await generateToken(user);
        res.send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        await deleteToken(token);
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};
