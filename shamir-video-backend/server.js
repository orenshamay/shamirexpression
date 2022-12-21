const express = require('express')
const config = require('config')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const jobRouter = require('./routers/job.router')
const logger = require('./logger')(module)
const { startWorkers } = require('./celery')

const app = express()
let PORT
let OUTPUT_SERVER

if (process.env.NODE_ENV === 'development') {
    PORT = config.get('portDev') || 5005
    process.env.HOST = 'localhost'
    process.env.ADDRESS = `http://${process.env.HOST}:${PORT}`
    OUTPUT_SERVER = `...App has been started on ${process.env.ADDRESS} in ${process.env.NODE_ENV} mode on port ${PORT}...`
} else if (process.env.NODE_ENV === 'production') {
    PORT = config.get('portProd') || 5000
    process.env.HOST = 'HOSTNAME.com'
    process.env.ADDRESS = `http://${process.env.HOST}`
    OUTPUT_SERVER = `...App has been started on ${process.env.ADDRESS} in ${process.env.NODE_ENV} mode on port ${PORT}...`
}

app.use(cors())
app.use(fileUpload({}))
app.use(express.static('static'))
app.use(express.json({ extended: true }))
app.use('/api', jobRouter)
app.use('/ping',(req,res) => { res.status(200).send({message: "pong"}) })

async function start () {
    try {
      // app.close(5005)
      app.listen(PORT, () => console.log(OUTPUT_SERVER))
      await startWorkers()
    } catch (e) {
      console.log('Server Error: ', e.message)
      process.exit(1)
    }
}
  
start()