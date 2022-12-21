const { customAlphabet } = require('nanoid')
const config = require('config')

module.exports = function (length = 12) {
    return customAlphabet(config.get('alphabet') || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length) ()
}