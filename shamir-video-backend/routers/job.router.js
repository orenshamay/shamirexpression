const { Router } = require('express')
const router = new Router()
const renderer = require('../controllers/renderer')

// upload video and images to edit, should return celery job id
router.post('/upload', renderer.startJob)

// return status of rendering
router.get('/status/:id', renderer.jobStatus)

// return files by its extension
router.get('/files/:id', renderer.getFiles)

// deletes job directory
router.delete('/:id', renderer.deleteDir)


module.exports = router