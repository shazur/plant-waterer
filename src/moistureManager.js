const completelyDry = 1

module.exports = (channel = 5, mcpadc = require('mcp-spi-adc')) => {
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

        const sensor = mcpadc.open(channel, {speedHz: 20000}, error => {
            if (error) {
                throw new Error(`There was an error accessing the sensor: ${error}`)
            }
            setTimeout(() =>
                    getSensorReadings(sensor, (err, {value, rawValue}) => {
                        if (err) {
                            throw err
                        }
                        onComplete({
                            rawValue,
                            value,
                            soilDrynessPercentage: rawValue > 0 ? ((value / completelyDry) * 100) : 0,
                        })
                    })
                , 100)
        })

    }

    async function shouldWater() {
        const moistureLevel = await getMoistureLevel()
        // Adjust this value based on your sensor and the needs of your plant
        // Value represents a percentage
        return moistureLevel <= 45
    }

    return {getMoistureLevel, shouldWater}
}
