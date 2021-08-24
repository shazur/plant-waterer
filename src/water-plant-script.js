const schedule = require('node-schedule')
const plantWaterer = require('./plantWaterer')
const pumpManager = require('./pumpManager')
const moistureManager = require('./moistureManager')
const axios = require('axios')
const gpioNumbers = [17]
const moistureChannels = [5]

const reportMoistureLevel = (moistureLevel, planterId) =>
    axios.get('https://shaharz.wixsite.com/my-site-3/_functions/report', {params: {...moistureLevel, gpio: planterId}})
        .catch(err => console.log("Reporting moisture level failed", err))

const shouldWaterPlant = () => {
    // Run every day at 7 a.m.
    return schedule.scheduleJob('0 7 * * *', async () => {
        return pumpManager({gpioNumbers}).getPumps().forEach((pump, planterId) => {
                moistureManager(moistureChannels[planterId]).getMoistureLevel((moistureLevel) => {
                    reportMoistureLevel(moistureLevel, planterId)
                    return plantWaterer({pumpRelay: pump, waitUntilStartTime: 3000, wateringTime: 40000}).water()
                })
            }
        )
    })
}

shouldWaterPlant()
