const timeout = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
    sleep: async (fn, ms, ...args) => {
        await timeout(ms)
        return fn(...args)
    }
}
