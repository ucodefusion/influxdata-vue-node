const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const allowedOrigins = ['http://192.168.1.14:8080', 'http://localhost:8080', 'http://localhost:8081'];

const corsOptions = {
    origin: function (origin, callback) {
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

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const chartRoutes = require('./routes/chartRoutes');

app.use(userRoutes);
app.use(chartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
