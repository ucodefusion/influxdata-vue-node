require('dotenv').config();

const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');

// Connection configurations
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const url = process.env.INFLUX_URL;

const client = new InfluxDB({ url, token });

// Function to get the Write API
function getWriteApi() {
    return client.getWriteApi(org, bucket);
}

// Function to get the Query API
function getQueryApi() {
    return client.getQueryApi(org);
}

module.exports = {
    getWriteApi,
    getQueryApi,
    Point, // exporting Point if you need to use it outside this module
};
