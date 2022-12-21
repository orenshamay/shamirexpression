// Import dependencies
const Jimp = require("jimp");
const fs = require("fs-extra");
const path = require('path')
const ffmpeg = require('ffmpeg');
const ffmpegFluent = require('fluent-ffmpeg')
const pathToFfmpeg = require("ffmpeg-static");
const util = require('util');
const { createClient } = require('redis')
const logger = require('../logger')(module)

const exec = util.promisify(require('child_process').exec);
const ploniWhiteFont = `${path.dirname(__filename)}/assets/PloniWhite.fnt`
const ploniBlackFont = `${path.dirname(__filename)}/assets/PloniBlack.fnt`
const calibriGreekWhite = `${path.dirname(__filename)}/assets/CalibriGreekWhite.fnt`
const calibriGreekBlack = `${path.dirname(__filename)}/assets/CalibriGreekBlack.fnt`

// Video editor settings
const videoEncoder = 'h264';
const outputFileName = 'ShamirGlacierExpression';
const outputGif = 'ShamirGlacierExpression.gif'

const inputFolder = 'temp/raw-frames';
const outputFolder = 'temp/edited-frames';

let currentProgress = 0;
let inputFile = 'input.mov';

// init redis client
const client_r = createClient({
    port: 6379,
    host: "redis",
})
client_r.connect()

module.exports.render = async function(storeName, storeAddress, storePhone, storeContacts, storeLogo, standardCoatingImage, expressingCoatingImage, hash, id, videoExt, isGreek, resolve, reject) {
    try {
        let isLogo
        storeLogo ? isLogo = true : isLogo = false


        // 1. Create temporary folders
        console.log('Initialize temp files')
        client_r.set(id, 'Initialize temp files')

        inputFile = `${hash}.${videoExt}`

        // 2. Decode MP4 video and resize it to width 1080 if it needs and height auto (to keep the aspect ratio)
        console.log('Decoding')
        client_r.set(id, 'Decoding')
        if (!fs.existsSync(`./templates/${hash}/${inputFolder}`)) {
            await fs.mkdir(`./templates/${hash}/temp`)
            await fs.mkdir(`./templates/${hash}/temp/raw-frames`)
            await exec(`"${pathToFfmpeg}" -i ./templates/${hash}/${inputFile} -vf scale=1080:-1 ./templates/${hash}/${inputFolder}/%d.png`)
        }

        // 3. Edit each frame
        console.log('Rendering')
        client_r.set(id, 'Rendering')
        const frames = fs.readdirSync(`./templates/${hash}/${inputFolder}`)
        console.log('frames: ', frames.length)

        // importing images
        let importedLogo, importedStandard, importedExpressing
        const framePic = await Jimp.read(`./templates/${hash}/${inputFolder}/${1}.png`)
        let importedLogoPromise
        if (isLogo) {
            importedLogoPromise = Jimp.read(`${path.resolve(`./static/${id}/${storeLogo.name}`)}`)
            .then(logo => {
                logo
                    .resize(96,96)
                    .write(`./static/${id}/${storeLogo.name}`)
                importedLogo = logo
                return logo
            })
        }
        const importedStandardPromise = Jimp.read(`${path.resolve(`./static/${id}/${standardCoatingImage.name}`)}`)
            .then(standard => {
                const height = framePic.bitmap.height
                const width = (height / 4) * 3
                standard
                    .resize(width, height)
                    .write(`./static/${id}/${standardCoatingImage.name}`);
                importedStandard = standard
                return standard
            })
            .catch(err => {
                console.log('Error: ', err)
                throw err
            })
        
        const importedExpressingPromise = Jimp.read(`${path.resolve(`./static/${id}/${expressingCoatingImage.name}`)}`)
            .then(expressing => {
                const height = framePic.bitmap.height
                const width = (height / 4) * 3
                expressing
                    .resize(width, height)
                    .write(`./static/${id}/${expressingCoatingImage.name}`)
                importedExpressing = expressing
                return expressing
            })
            .catch(err => {
                console.log('Error: ', err)
                throw err
            })

        isLogo ? await Promise.all([importedLogoPromise, importedStandardPromise, importedExpressingPromise]) : await Promise.all([importedStandardPromise, importedExpressingPromise])
        // importing fonts
        let fontStoreName, fontStoreAddress, fontStorePhone, fontStoreContacts

        // костылим греческий
        let whiteFontPath, blackFontPath
        if (isGreek) {
            whiteFontPath = calibriGreekWhite
            blackFontPath = calibriGreekBlack
        } else {
            whiteFontPath = ploniWhiteFont
            blackFontPath = ploniBlackFont
        }

        const fontProm1 = Jimp.loadFont(whiteFontPath).then(font => fontStoreName = font)
        const fontProm2 = Jimp.loadFont(blackFontPath).then(font => fontStoreAddress = font)
        const fontProm3 = Jimp.loadFont(blackFontPath).then(font => fontStorePhone = font)
        const fontProm4 = Jimp.loadFont(blackFontPath).then(font => fontStoreContacts = font)

        await Promise.all([fontProm1, fontProm2, fontProm3, fontProm4])
        
        const framePromises = []

        for (let frameCount = 1; frameCount <= frames.length; frameCount++) {

            // Check and log progress
            checkProgress(frameCount, frames.length, id, client_r)

            if ( (frameCount >= 20 && frameCount <= 108) || (frameCount >=609 && frameCount <= 752) || (frameCount >= 753 && frameCount <= 876) || (frameCount >= 1465)) {
                // Read the current frame
                let frame = Jimp.read(`./templates/${hash}/${inputFolder}/${frameCount}.png`)

                // Modify frame
                frame = await modifyFrame(frame, frameCount , storeName, storeAddress, storePhone, storeContacts, importedLogo, importedStandard, importedExpressing, fontStoreName, fontStoreAddress, fontStorePhone, fontStoreContacts, reject)

                // Save the frame
                const writePromise = frame.writeAsync(`./static/${id}/${outputFolder}/${frameCount}.png`)
                framePromises.push(writePromise)
            } else {
                fs.copyFile(`./templates/${hash}/${inputFolder}/${frameCount}.png`, `./static/${id}/${outputFolder}/${frameCount}.png`)
            }
        }

        await Promise.all(framePromises)

        // 4. Encode video from PNG frames to MP4 (no audio)
        console.log('Encoding')
        client_r.set(id, 'Encoding')
        await exec(`"${pathToFfmpeg}" -r 30 -start_number 1 -i ./static/${id}/${outputFolder}/%d.png -vcodec ${videoEncoder} -r 30 -pix_fmt yuv420p ./static/${id}/temp/no-audio.${videoExt}`)

        // 5. Copy audio from original video
        console.log('Adding audio')
        client_r.set(id, 'Adding audio')
        await exec(`"${pathToFfmpeg}" -i ./static/${id}/temp/no-audio.${videoExt} -i ./templates/${hash}/${inputFile} -c copy -map 0:v:0 -map 1:a:0? ./static/${id}/${outputFileName}.${videoExt}`)

        // 6. Making a gif
        console.log('Creating a gif')
        client_r.set(id, 'Creating a gif')
        ffmpegFluent(`./static/${id}/${outputFileName}.${videoExt}`)
            .outputOption("-vf", "scale=1080:-1:flags=lanczos,fps=15")
            .save(`./static/${id}/${outputGif}`)

        // 6. Remove temp folder
        console.log('Cleaning up')
        client_r.set(id, 'Cleaning up')
        await fs.remove(`./static/${id}/temp`)
        if (isLogo) await fs.remove(`./static/${id}/${storeLogo.name}`)
        await fs.remove(`./static/${id}/${standardCoatingImage.name}`)
        await fs.remove(`./static/${id}/${expressingCoatingImage.name}`)
        // await fs.remove(`./static/${id}/${inputFile}`)

        client_r.set(id, 'Done')
        resolve(`${id} done`)


    } catch (e) {
        logger.error('Error in render: ', e)
        await fs.remove(`./static/${id}`)
        client_r.set(id, 'Error')
        reject(e)
        // await fs.remove(`./static/${id}/temp`)
        // await fs.remove(`./static/${id}/${outputFileName}.${videoExt}`)
        // await fs.remove(`./static/${id}/${outputGif}`)
    }

}

async function getDuration () {
    let duration = 1
    const process = new ffmpeg(`${inputFile}`)
    await process.then(function (video) {
        duration = video.metadata.duration.seconds
    })
    return duration
}

/**
 * Edit frame
 * Compisites frame with requested images
 * Also adds text
 * @param frame
 */
const modifyFrame = async (
        frame,
        index,
        storeName = '',
        storeAddress = '',
        storePhone = '',
        storeContacts = '',
        importedLogo,
        importedStandard,
        importedExpressing,
        fontStoreName,
        fontStoreAddress,
        fontStorePhone,
        fontStoreContacts,
        reject
) => {
    try {
        // Calculate the new height for 9:16 aspect ratio based on the current video width
        // let newHeight = 16 * frame.bitmap.width / 9

        // Video height must be an even number
        // newHeight = newHeight % 2 === 0 ? newHeight : (newHeight + 1)


        // Create new image width current width, new height and white background
        const videoWidth = 1080
        const videoHeight = 608

        // getting Frame
        let newImage = new Jimp(videoWidth, videoHeight)

        // Center the video in the current image
        newImage.composite(await frame, 0, 0)
    
        // print storeName
        if (index >= 20 && index <= 108) {
            newImage.print(fontStoreName, 0, 5*(videoHeight / 100), {
                text: storeName,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
            }, videoWidth, videoHeight)

            // newImage.composite(fontStoreName, 0, 5*(videoHeight / 100))
            // newImage = newImage.getBuffer(Jimp.MIME_PNG,  async (err, buffer) => {
            //     if (err) console.log(err);
            //     return buffer; //Buffer
            // });
        }

        // print standard coating image
        if (index >= 609 && index <= 752) {
            newImage.composite(importedStandard, 0, 0)
        }

        // print expressing coating image
        if (index >= 753 && index <= 876) {
            newImage.composite(importedExpressing, videoWidth - ((videoHeight / 4) * 3), 0)
        }

        // print storeAddress, storePhone, storeEmail???storeWebsite???
        if (index >= 1465) {
            // 90, 80 (96*96)
            if (importedLogo) newImage.composite(importedLogo, 90*(videoWidth / 100), 80*(videoHeight / 100))
            newImage.print(fontStoreAddress, 0, 45*(videoHeight / 100), {
                text: storeAddress,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
            }, videoWidth, videoHeight)
            newImage.print(fontStorePhone, 0, 60*(videoHeight / 100), {
                text: storePhone,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
            }, videoWidth, videoHeight)
            newImage.print(fontStoreContacts, 0, 75*(videoHeight / 100), {
                text: storeContacts,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
            }, videoWidth, videoHeight)
        }

        return newImage
    } catch (e) {
        logger.error('Error in modifyFrame: ', e)
        client_r.set(id, 'Error')
        reject(e)
    }
}

/**
 * Calculate the processing progress based on the current frame number and the total number of frames
 * @param currentFrame
 * @param totalFrames
 */
 const checkProgress = (currentFrame, totalFrames, id, client_r) => {
    const progress = currentFrame / totalFrames * 100
    if (progress > (currentProgress + 10)) {
        const displayProgress = Math.floor(progress)
        const progressStatus = `Progress: ${displayProgress}%`
        console.log(progressStatus)
        currentProgress = displayProgress
        client_r.set(id, progressStatus)
    }
};