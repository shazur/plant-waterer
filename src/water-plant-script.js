const schedule = require('node-schedule')
const plantWaterer = require('./plantWaterer')
const pumpManager = require('./pumpManager')
const moistureManager = require('./moistureManager')
const axios = require('axios')
const gpioNumbers = [17]
const moistureChannels = [5, 6, 7]

const reportMoistureLevel = (moistureLevel, planterId) =>
    axios.get('https://shaharz.wixsite.com/my-site-3/_functions/report', {params: {...moistureLevel, gpio: planterId}})
        .catch(err => console.log("Reporting moisture level failed", err))

const shouldWaterPlant = () => {
    // Run every 2 days at 22:00
    schedule.scheduleJob('0 22 */2 * *', () =>
        pumpManager({gpioNumbers}).getPumps().forEach(pump =>
            plantWaterer({pumpRelay: pump, waitUntilStartTime: 3000, wateringTime: 40000}).water()
        )
    )
    //Run every hour at minute 10 (1:10, 2:10, ...)
    schedule.scheduledJobs({minute: 10}, () => {
        moistureChannels.forEach((channel, planterId) =>
            moistureManager(moistureChannels[planterId]).getMoistureLevel((moistureLevel) =>
                reportMoistureLevel(moistureLevel, planterId)
            ))
    })
}

shouldWaterPlant()
