const Gpio = require('onoff').Gpio
const {sleep} = require('./utils')

module.exports = ({pumpRelay = new Gpio(17, 'high'), waitUntilStartTime, wateringTime}) => {
    function waterThePlant() {
        return pumpRelay.read()
            .then(status => {
                const needsWater = true //shouldWater()
                if (status !== 0 && needsWater) {
                    console.log("starting pump")
                    pumpRelay.writeSync(0) // closes the circuit and starts the pump
                }
                return {
                    status: 'The plant is being watered.',
                }
            })
            .catch(error => {
                throw new Error(`There was an error getting the pump relay status: ${error}`)
            })
    }

    function stopWateringPlant() {
        return pumpRelay.read()
            .then(status => {
                if (status !== 1) {
                    console.log("stopping pump")
                    pumpRelay.writeSync(1) // opens the circuit and stops the pump
                }
                return {
                    status: 'The plant is not being watered.',
                }
            })
            .catch(error => new Error(`There was an error getting the pump relay status: ${error}`))
    }

    async function water() {
        return sleep(async () => {
            await waterThePlant()
            return sleep(async () => await stopWateringPlant(), wateringTime)
        }, waitUntilStartTime)
    }

    return {water, stopWateringPlant}
}
