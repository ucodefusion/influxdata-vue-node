const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';  // Please use a better secret in production

exports.hashPassword = async (password) => {
     

    if (!password)
    { 
        return null;
    
    }else{

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
    }
};

exports.verifyPassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

exports.generateToken = (username) => {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
    try
    {
        return jwt.verify(token, SECRET_KEY);
    } catch (err)
    {
        return null;
    }
};

exports.authenticate = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied: No Token Provided!');

    try
    {
        const decoded = exports.verifyToken(token);
        req.user = await User.login(decoded.username);
        next();
    } catch (err)
    {
        res.status(400).send('Invalid Token');
    }
};
