const mcpadc = require('mcp-spi-adc');
const completelyWet = 395;
const completelyDry = 780;

function getSensorReadings(sensor) {
    return new Promise((resolve, reject) => {
        sensor.read((readError, reading) => {
            if (readError) {
                return reject(new Error(`There was an error getting the sensor reading:
                    ${readError}`));
            }
//console.log("reading sensor, value is", reading)
            return resolve(reading);
        });
    });
}

function getMoistureLevel() {
    const readingPromises = [];
    let readings = {};
    readings.rawValues = [];
    readings.values = [];

    return new Promise((resolve, reject) => {
        const sensor = mcpadc.open(5, {speedHz: 20000}, (error) => {
            if (error) {
                return reject(new Error(`There was an error accessing the sensor: ${error}`))
            }

            let iterator = 50; // Just need a large number of readings to try for better accuracy

            while (iterator >= 0) {
                readingPromises.push(getSensorReadings(sensor)
                    .then(reading => {
                        readings.rawValues.push(reading.rawValue);
                        readings.values.push(reading.value);
                    }).catch(error => {
                        return reject(error);
                    })
                );

                iterator--;
            }

            return Promise.all(readingPromises).then(() => {
                const averageRawValue = readings.rawValues.reduce((a, b) => a + b, 0) / 50;
                const averageValue = readings.values.reduce((a, b) => a + b, 0) / 50;

                // Set the value to a percentage based on the max reading
                return resolve({
                    rawValue: averageRawValue,
                    value: averageValue,
                    soilDrynessPercentage: averageRawValue > 0 ? ((averageRawValue / completelyWet) * 100).toFixed(0) : 0,
                });
            });
        });
    });
}

async function shouldWater() {
    const moistureLevel = await getMoistureLevel()
    // Adjust this value based on your sensor and the needs of your plant
    // Value represents a percentage
    return moistureLevel <= 45
}

module.exports = shouldWater
