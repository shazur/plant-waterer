const schedule = require('node-schedule')
const plantWaterer = require('./plantWaterer')
const pumpManager = require('./pumpManager')
const moistureManager = require('./moistureManager')
const {moistureChannels, gpioNumbers, wateringTime} = require('./config')
const axios = require('axios')

const reportMoistureLevel = (moistureLevel, planterId) =>
    axios.get('https://shaharz.wixsite.com/my-site-3/_functions/report', {params: {...moistureLevel, gpio: planterId}})
        .catch(err => console.log("Reporting moisture level failed", err))

const shouldWaterPlant = () => {

    // Run every 2 days at 22:00 - '0 22 */2 * *'
    schedule.scheduleJob({hour: 12, minute: 54}, () =>
        pumpManager({gpioNumbers}).getPumps().forEach((pump, planterId) =>
            plantWaterer({pumpRelay: pump, waitUntilStartTime: 3000, wateringTime: wateringTime[planterId]}).water()
        )
    )
    //Run every hour at minute 10 (1:10, 2:10, ...)
    schedule.scheduleJob({minute: 55}, () => {
        moistureChannels.forEach((channel, planterId) =>
            moistureManager(channel).getMoistureLevel((moistureLevel) =>
                reportMoistureLevel(moistureLevel, planterId)
            ))
    })
}

shouldWaterPlant()
