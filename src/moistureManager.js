const completelyWet = 0
const completelyDry = 1

module.exports = (channel = 5, mcpadc = require('mcp-spi-adc'), iterator = 50) => {
    function getSensorReadings(sensor, cb) {
        sensor.read((readError, reading) => {
            if (readError) {
                return cb(new Error(`There was an error getting the sensor reading:
                    ${readError}`))
            }
            return cb(null, reading)
        })
    }

    function getMoistureLevel(onComplete) {
        const readings = {rawValues: [], values: []}

        const sensor = mcpadc.open(channel, {speedHz: 20000}, error => {
            if (error) {
                throw new Error(`There was an error accessing the sensor: ${error}`)
            }
            let currentCallNumber = iterator
            while (currentCallNumber > 0) {
                getSensorReadings(sensor, (err, reading) => {
                    if (err) {
                        throw err
                    }
                    readings.rawValues.push(reading.rawValue)
                    readings.values.push(reading.value)
                })
                currentCallNumber--
            }
        })
        setTimeout(() => {
            const averageRawValue = readings.rawValues.reduce((a, b) => a + b, 0) / iterator
            const averageValue = readings.values.reduce((a, b) => a + b, 0) / iterator
            onComplete({
                rawValue: averageRawValue,
                value: averageValue,
                soilDrynessPercentage: averageRawValue > 0 ? ((averageRawValue / completelyDry) * 100) : 0,
            })
        }, 1)
    }

    async function shouldWater() {
        const moistureLevel = await getMoistureLevel()
        // Adjust this value based on your sensor and the needs of your plant
        // Value represents a percentage
        return moistureLevel <= 45
    }

    return {getMoistureLevel, shouldWater}
}
