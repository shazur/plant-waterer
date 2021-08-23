module.exports = ({Gpio = require('onoff').Gpio, gpioNumbers}) => ({
    getPumps: () => gpioNumbers.map(num => new Gpio(num, 'high'))
})
