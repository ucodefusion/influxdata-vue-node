const { getWriteApi, getQueryApi } = require('../config/influxdb');
 
class Chart {
  
 
 
    static async findSensor(Sensor, Measurement) {
        try
        {
            const queryApi = getQueryApi();
            const query = `from(bucket:"Power") 
            |> range(start: -1y) 
            |> filter(fn: (r) => r._measurement == "${Measurement}")
            |> filter(fn: (r) =>  r.sensor_id == "${Sensor}")`;



            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']; // Add more colors if necessary

            const results = [];
            const datasets = [{
                data: [], label: 'voltage',
                borderColor: '#3498db',
                fill: false
            }, {
                data: [], label: 'current',
                borderColor: '#2ecc71',
                    fill: false
                }, {
                data: [], label: 'power',
                borderColor: '#f39c12',
                    fill: false
                }];
            const labels = []; let currentColorIndex = 0;
            await new Promise((resolve, reject) => {
                queryApi.queryRows(query, {
                    next: (row, tableMeta) => {
                        const dataArray = tableMeta.toObject(row);


                        console.log(dataArray);
                        const label = new Date(dataArray._time).toLocaleDateString();

                        // Push the label if it's not already present
                        if (!labels.includes(label))
                        {
                            labels.push(label);
                        }



                        if (dataArray._field == 'voltage'){ 
                        datasets[0].data.push(dataArray._value);
                    }

                        if (dataArray._field == 'current')
                        { 
                            datasets[1].data.push(dataArray._value);
                        }

                        if (dataArray._field == 'power')
                        { 
                            datasets[2].data.push(dataArray._value);
                        }

                    },


                    error: (error) => {
                        console.error(error);
                        console.log('Sensor ERROR');
                        reject(error);  // Reject the promise on error
                    },
                    complete: () => {
                        results.push({
                            labels: labels,
                            datasets: datasets
                        });
                        console.log('Sensor SUCCESS'); resolve();  // Resolve the promise on completion
                    },

                });
            });

            console.log(results);
            return results;

        } catch (err)
        {
            console.error(err);
            return null;
        }
    }

 
}

module.exports = Chart;
