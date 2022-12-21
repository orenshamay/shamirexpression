export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })


export const getBase64AndBlobImage = (imageId) => new Promise((resolve, reject) => {
    const img = document.getElementById(imageId)
    console.log('getBase64AndBlobImage', img)
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
        console.log('getBase64AndBlobImage toBlob', blob)
        const base64 = canvas.toDataURL()
        resolve({ base64, blob })
    }, 'image/png')
})
