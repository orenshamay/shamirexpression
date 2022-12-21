const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const celery = require('celery-node');
const renderer = require('../processors/renderer')
const { createClient } = require('redis')
const generateId = require('../utils/generateId');
const logger = require('../logger')(module)
const axios = require('axios');
const reverseString = require('../utils/reverseString');
const getExtension = require('../utils/getExtension');

const inputFolder = 'temp/raw-frames';
const outputFolder = 'temp/edited-frames';
const inputFile = 'input.mov';

// celery client init
let client
if (process.env.NODE_ENV === 'production') {
    client = celery.createClient(
        config.get("celeryBrokerProd"),
        config.get("celeryBackendProd")
    )
} else if (process.env.NODE_ENV === 'development') {
    client = celery.createClient(
        config.get("celeryBroker"),
        config.get("celeryBackend")
    )
}

// init redis client
const client_r = createClient({
    port: 6379,
    host: "redis",
})
client_r.connect()

function moveFilesToJob (id, storeLogo, standardCoatingImage, expressingCoatingImage) {
    if (storeLogo) storeLogo.mv(`./static/${id}/${storeLogo.name}`)
    standardCoatingImage.mv(`./static/${id}/${standardCoatingImage.name}`)
    expressingCoatingImage.mv(`./static/${id}/${expressingCoatingImage.name}`)
}

/**
 * Creates job's folder and mocks it with input video
 * @param id 
 */

 async function createDirs (id, hash) {
    if (!fs.existsSync('./static')) {
        await fs.mkdir('./static')
    }
    if (!fs.existsSync(`./static/${id}`)) {
        await fs.mkdir(`./static/${id}`)
        await fs.mkdir(`./static/${id}/temp`)
        await fs.mkdir(`./static/${id}/${inputFolder}`)
        await fs.mkdir(`./static/${id}/${outputFolder}`)
        // await fs.copyFile(`./templates/${hash}/${hash}.mov`, `./static/${id}/${hash}.mov`)
    }
    if (!fs.existsSync(`./static/${id}/temp`)) await fs.mkdir(`./static/${id}/temp`)
    if (!fs.existsSync(`./static/${id}/${inputFolder}`)) await fs.mkdir(`./static/${id}/${inputFolder}`)
    if (!fs.existsSync(`./static/${id}/${outputFolder}`)) await fs.mkdir(`./static/${id}/${outputFolder}`)
}

module.exports.startJob = async function (req, res) {
    try {
        let { storeName, storeAddress, storePhone, storeContacts, url, rtl, isGreek } = req.body
        console.log('startJob', req.body)
        // rtl - (Right to Left) param for the hebrew text
        if (rtl) {
            storeName = reverseString(storeName)
            storeAddress = reverseString(storeAddress)
        }
        
        const { storeLogo, standardCoatingImage, expressingCoatingImage } = req.files

        // generating task_id (id now)
        const id = generateId()
        const videoExt = getExtension(url)

        if (!fs.existsSync('./templates')) {
            await fs.mkdir('./templates')
        }

        const hash = url.match(/(?<=_)[0-9A-Fa-f]{10}(?=.)/g)[0]
        // const hash = 'absfdsfds2'
        const isExists = fs.readdirSync('./templates/').indexOf(`${hash}`)
        if (isExists === -1) {
            await fs.mkdir(`./templates/${hash}`)
            const templatesPath = path.resolve('./', 'templates', `${hash}`, `${hash}.${videoExt}`)
            const writer = fs.createWriteStream(templatesPath)
            const video = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })

            video.data.pipe(writer)
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
            })
        }

        await createDirs(id, hash)
        moveFilesToJob (id, storeLogo, standardCoatingImage, expressingCoatingImage)
        const task = client.sendTask("renderer", [storeName, storeAddress, storePhone, storeContacts, storeLogo, standardCoatingImage, expressingCoatingImage, hash, id, videoExt, isGreek], {}, id)

        return res.status(200).json({
            message: 'Rendering process has been successfully runned, here is task id...',
            taskId: task.taskId
        })
    } catch (e) {
        console.log(e)
        logger.error('Error in renderer: ', e)
        return res.status(500).json({
            message: 'Problems with running rendering process...',
        })
    }
}

module.exports.jobStatus = async function (req, res) {
    try {
        const { id } = req.params
        let status = await client.asyncResult(id).status()
        let progress

        if (status === null) {
            progress = await client_r.get(id)
            status = 'PENDING'
            if (status === 'Error') {
                status = 'ERROR'
                progress = 'Error'
                await client_r.sendCommand(['DEL', id])
            }
        }

        if (status === "SUCCESS") {
            progress = "Done"
            await client_r.sendCommand(['DEL', id])
        }

        return res.status(200).json({
            message: 'Here is rendering status...',
            status,
            progress
        })
    } catch (e) {
        console.log(e)
        logger.error('Error in getting status of rendering: ', e)
        return res.status(500).json({
            message: 'Problems with getting process status...'
        })
    }
}

module.exports.getFiles = async function (req, res) {
    try {
        const { id } = req.params
        const { ext } = req.query
        if (ext === 'gif') {
            // sending gif
            const link = path.resolve(`./static/${id}/ShamirGlacierExpression.gif`)

            return res.status(200).sendFile(link, { headers: { 'Content-Type': 'image/gif' }})
        } else if (ext === 'mov') {
            // sending mov
            const link = path.resolve(`./static/${id}/ShamirGlacierExpression.mov`)

            return res.status(200).sendFile(link, { headers: { 'Content-Type': 'video/mov' }})
        } else if (ext === 'mp4') {
            // sending mp4
            const link = path.resolve(`./static/${id}/ShamirGlacierExpression.mp4`)

            return res.status(200).sendFile(link, { headers: { 'Content-Type': 'video/mp4' }})
        } else {
            return res.status(400).json({
                message: 'Bad request: you should point out correct extension, accepted: { mov, gif }'
            })
        }

    } catch (e) {
        console.log(e)
        logger.error('Error in getting files: ', e)
        return res.status(500).json({
            message: 'Problems with getting files...'
        })
    }
}

module.exports.deleteDir = async function (req, res) {
    try {
        const { id } = req.params
        if (fs.existsSync(`./static/${id}`)) {
            await fs.remove(`./static/${id}`)
        }
        return res.status(200).json({
            message: 'Job directory has been successfully deleted'
        })
    } catch (e) {
        logger.error('Error in deleting job dir: ', e)
        return res.status(500).json({
            message: 'Problems with deleting job directory...'
        })
    }
}
