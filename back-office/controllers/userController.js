const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {

    // Register user route
 
        const { username, email, password } = req.body;

        // Check for required fields
        if (!username || !email || !password)
        {
            return res.status(400).send('Input required.');
        }

        const result = await User.create(username, email, password);
        console.log(result);

        switch (result)
        {
            case 'Error Rg2':
                return res.status(203).json({ success: '❌ User already exists.' });
            case 'Error Rg1':
            case 'Error Rg6':
                return res.status(202).json({ success: '❌ Missing required fields.' });
            case true:
                return res.status(201).json({ success: '🎉 User created successfully.' });
            default:
                return res.status(500).json({ success: '❌ Unknown error.' });
        }
  
};

exports.loginUser = async (req, res) => {

 
        const { username, email, password } = req.body;

        User.login(username, password)
            .then(existingUser => {
                if (existingUser)
                {
                    return res.status(201).json({ success: '🎉 User authenticated successfully.' });
                } else
                {
                    return res.status(400).json({ success: '❌ Authentication failed.' });
                }
            })
            .catch(error => {
                console.error("Login error:", error);
                return res.status(500).send(error);
            });
 
};
