const express = require('express');

const app = express();

const bodyParser = require('body-parser');
 
const path = require('path');
 

const User = require('./models/User');
const Chart = require('./models/Chart');
 



app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());


const cors = require('cors');

const allowedOrigins = ['http://192.168.1.14:8080', 'http://localhost:8080', 'http://localhost:8081'];


const corsOptions = {

    origin: function (origin, callback) {
        console.log("origin",origin);
        // If the origin is in the list of allowed origins, or the request is a same-origin request (no origin), it's allowed.
        if (allowedOrigins.indexOf(origin) !== -1 || !origin)
        {
            callback(null, true);
        } else
        {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
//app.use(cors({ origin: ['http://localhost:8080'], }))
app.use(cors(corsOptions))
//app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());


// Login user route
// Login user route
app.post('/login', (req, res) => {  // Removed 'async' since we're using .then and .catch

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
});

 
// Register user route
app.post('/register', async (req, res) => {
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
        case 'Error Rg1': // Consider changing this error code to something else as it's not used in the User.create method
        case 'Error Rg6':
            return res.status(202).json({ success: '❌ Missing required fields.' });
        case true:
            return res.status(201).json({ success: '🎉 User created successfully.' });
        default:
            return res.status(500).json({ success: '❌ Unknown error.' });
    }
});
 

// Register user route
app.post('/chart', async (req, res) => {

 
    // Check if user already exists
    const existingSensor = await Chart.findSensor(req.body.sensor, req.body.measurement);
    if (existingSensor)
    {
        
        return res.status(200).send(existingSensor);
    } else
    {
        return res.status(400).send('SENSOR  not exists.');
    }


});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
