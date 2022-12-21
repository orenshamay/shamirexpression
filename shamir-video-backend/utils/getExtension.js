function getExtension(str) {
    const splitted = str.split('.')
    return splitted[splitted.length - 1]
}

module.exports = getExtension