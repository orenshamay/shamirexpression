const { createLogger, transports, format } = require('winston')
const path = require('path')

module.exports = function (module) {
  return makeLogger(module.filename)
}

function makeLogger (mod) {
  return (logger = createLogger({
    level: 'debug',
    defaultMeta: { service: path.basename(mod) },
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.json(),
      format.printf(
        (debug) =>
          `${JSON.stringify({
            timestamp: debug.timestamp,
            level: debug.level,
            service: debug.service,
            message: debug.message
          })}`
      )
    ),
    transports: [
      new transports.Console({ level: 'debug' }),
      new transports.File({ filename: 'debug.log', level: 'debug' })
    ]
  }))
}
