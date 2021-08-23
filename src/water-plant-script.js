const schedule = require('node-schedule')
const plantWaterer = require('./plantWaterer')
const {water} = plantWaterer({waitUntilStartTime: 3000, wateringTime: 40000})

const shouldWaterPlant = () => {
    // Run every day at 7 a.m.
    return schedule.scheduleJob('0 7 * * *', async () => {
        return water()
    })
}

shouldWaterPlant()
