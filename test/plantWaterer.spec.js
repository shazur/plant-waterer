const makePlantWaterer = require('../src/plantWaterer')
const {stub, assert} = require('sinon')

describe('plantWaterer', () => {
    it('Assuming pump starts off, should start watering and then stop', async () => {
        let currentStatus = 1
        const pumpRelay = {
            read: stub().callsFake(() => Promise.resolve(currentStatus)),
            writeSync: stub().callsFake(status => {
                currentStatus = status
            })
        }
        const plantWaterer = makePlantWaterer({pumpRelay, waitUntilStartTime: 1, wateringTime: 1})

        await plantWaterer.water()

        assert.calledTwice(pumpRelay.writeSync)
        assert.calledWith(pumpRelay.writeSync.firstCall, 0)
        assert.calledWith(pumpRelay.writeSync.secondCall, 1)
    })
})
