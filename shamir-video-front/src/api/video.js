import { api } from '.'

export function createVideoJob(data, uploadProgressCallback) {
    // const formData = getFormData(data)
    const formData = data
    // return new Promise(resolve => setTimeout(resolve({
    //     data: { taskId: 0 }
    // }), 1000))
    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: uploadProgressCallback
    })
}

export function getVideoJob(jobId) {
    // return new Promise(resolve => setTimeout(resolve({
    //     data: {
    //         status: "finished",
    //         progress: 10
    //     }
    // }), 3000))
    return api.get(`/status/${jobId}`)
}

export function getVideoJobFiles(jobId, ext) {
    // return new Promise(resolve => setTimeout(resolve({
    //     data: {
    //         status: "finished",
    //         progress: 10
    //     }
    // }), 3000))
    return api.get(`/files/${jobId}?ext=${ext}`)
}

