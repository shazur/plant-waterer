const pumpManager = require('./pumpManager')
const plantWaterer = require('./plantWaterer')
const {gpioNumbers} = require('./config')

const stopEverything = () =>
    pumpManager({gpioNumbers}).getPumps().forEach((pump, planterId) => {
        plantWaterer({pumpRelay: pump, waitUntilStartTime: 3000, wateringTime: 4000}).stopWateringPlant()
    })

stopEverything()
