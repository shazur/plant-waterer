const pumpManager = require('../src/pumpManager')
const {expect} = require('chai')

describe('pumpManager', () => {
    it("should return initialized pump relays according to the passes gpio's", () => {
        class fakeGpio {
            constructor(gpio, direction) {
                this.gpio = gpio
                this.direction = direction
            }
            read() {}
            writeSync() {}
        }
        const gpioNumbers = [17, 21]

        const pumps = pumpManager({gpioNumbers, Gpio: fakeGpio}).getPumps()

        expect(pumps.length).to.equal(2)
        pumps.forEach((pump, index) => {
            expect(pump.read).not.to.be.undefined
            expect(pump.writeSync).not.to.be.undefined
            expect(pump.gpio).to.equal(gpioNumbers[index])
            expect(pump.direction).to.equal('high')
        })
    })
})
