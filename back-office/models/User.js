const { getWriteApi, getQueryApi } = require('../config/influxdb');
const { Point } = require('@influxdata/influxdb-client'); const bcrypt = require('bcryptjs');

const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = process.env.INFLUX_ORG;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;
class User {
    constructor(username, password, otherInfo = {}) {
        this.username = username;
        this.password = password;
        this.otherInfo = otherInfo;
    }


    static create(username, email, password) {
        console.log("post::", username, email, password);

        if (!username || !password || !email)
        {
            console.error('Missing required fields.');
            return Promise.resolve('Error Rg6');
        }

        return new Promise(async (resolve, reject) => {
            try
            {
                const queryApi = getQueryApi();
                let recordCount = 0;  // Initialize counter
                const query = `from(bucket:"${INFLUX_BUCKET}") 
                |> range(start: -1y) 
                |> filter(fn: (r) => r._measurement == "auth")
                |> filter(fn: (r) => r._field == "email" and r._value=="${email}")`;

                await queryApi.queryRows(query, {
                    next: (row, tableMeta) => {
                        recordCount++;
                    },
                    error: (error) => {
                        console.error(error);
                        resolve('Error Rg3');
                    },
                    complete: () => {
                        if (parseInt(recordCount) === 0)
                        {
                            this.createUser(email, username, password);
                            resolve(true);
                        } else
                        {
                            console.log(recordCount);
                            console.log('Error Rg2');
                            resolve('Error Rg2');
                        }
                    },
                });
            } catch (err)
            {
                console.error(`Error creating user: ${err}`);
                resolve('Error Rg4');
            }
        });
    }

    static async createUser(email, username, password) {


        try
        {

            const saltRounds = 10; // You can adjust this value
            const hashedPassword = await bcrypt.hash(password, saltRounds); 
            const writeApi = getWriteApi();

            const dummyUser = new Point('auth')
                .tag('password', hashedPassword)
                .stringField('username', username)
                .stringField('email', email);

            await writeApi.writePoint(dummyUser);
            await writeApi.close();
            console.log(hashedPassword);
            console.log(`User created successfully.`);
            return true;

        } catch (err)
        {
            console.error(`Error creating dummy user: ${err}`);
        }
    }

    static login(email, password) {


        return new Promise(async (resolve, reject) => {
            try
            {
                const queryApi = getQueryApi();
                const query = `from(bucket:"${INFLUX_BUCKET}") 
                    |> range(start: -1y) 
                    |> filter(fn: (r) => r._measurement == "auth")
                    |> filter(fn: (r) => r._field == "email" and r._value == "${email}")`;
             
                let user = null;
                let passwordMatch = false;

                let processedRows = 0;
                let totalRows = 0;

                await queryApi.queryRows(query, {
                    next: async (row, tableMeta) => {
                        totalRows++; // increase total rows for each row received

                        const record = tableMeta.toObject(row);
                        if (record._field === 'email')
                        {
                            user = record;
                            passwordMatch = await bcrypt.compare(password, record.password);

                            processedRows++; // increase processed rows after async operation is done
                            checkCompletion(); // Check if processing is done
                        }
                    },
                    error: (error) => {
                        console.error(error);
                        reject('QueryRows ERROR');
                    },
                    complete: () => {
                        checkCompletion(); // Check if processing is done
                    },
                });

                function checkCompletion() {
                    if (totalRows === processedRows)
                    { // Check if all rows are processed
                        if (user && passwordMatch)
                        {
                            resolve(user);
                        } else
                        {
                            reject('Password mismatch or user not found.');
                        }
                    }
                }
            } catch (err)
            {
                console.error(err);
                reject(err);
            }
        });
    }


}

module.exports = User;
