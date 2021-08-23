const schedule = require('node-schedule')
const plantWaterer = require('./plantWaterer')
const pumpManager = require('./pumpManager')

const shouldWaterPlant = () => {
    // Run every day at 7 a.m.
    return schedule.scheduleJob('0 7 * * *', async () => {
        return pumpManager({gpioNumbers: [17]}).getPumps().forEach(pump =>
            plantWaterer({pumpRelay: pump, waitUntilStartTime: 3000, wateringTime: 40000}).water()
        )
    })
}

shouldWaterPlant()
