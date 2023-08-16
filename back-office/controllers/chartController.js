const Chart = require('../models/Chart'); 

exports.registerChart= async (req, res) => {

    const existingSensor = await Chart.findSensor(req.body.sensor, req.body.measurement);
    if (existingSensor)
    {

        return res.status(200).send(existingSensor);
    } else
    {
        return res.status(400).send('SENSOR  not exists.');
    }
};
 