const express = require('express');
const router = express.Router();

const chartController = require('../controllers/chartController');

router.post('/chart', chartController.registerChart); 

module.exports = router;