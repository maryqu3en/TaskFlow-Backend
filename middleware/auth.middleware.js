const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(`Token: ${token}`);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Decoded token: ${JSON.stringify(decoded)}`);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            console.log('No user found with this token');
            throw new Error();
        }
        console.log(`User found: ${JSON.stringify(user)}`);
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.log(`Error in auth middleware: ${error}`);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
