const makeMoistureManager = require('../src/moistureManager')
const {expect} = require('chai')
const {stub} = require('sinon')

describe('moistureManager', function () {
    it('should get moisture level values for moisture sensor in the given channel', (done) => {
        const channel = 5
        const readings = [{rawValue: 0.5, value: 0.2}, {rawValue: 0.5, value: 0.2}]
        const sensor = {
            read: stub()
                .onFirstCall()
                .callsFake(cb => cb(null, readings[0]))
                .onSecondCall()
                .callsFake(cb => cb(null, readings[1]))
        }
        const mcpadc = {
            open: stub().callsFake((chnl, options, cb) => {
                if (chnl === channel) {
                    setTimeout(cb, 1)
                    return sensor
                }
                throw new Error(`Provided channel ${chnl} is not as expected - ${channel}`)
            })
        }
        const moistureManager = makeMoistureManager(channel, mcpadc, readings.length)

        moistureManager.getMoistureLevel(moistureLevel => {
            expect(moistureLevel).to.deep.equal({rawValue: 0.5, value: 0.2, soilDrynessPercentage: 50})
            done()
        })
    })
})
