const celery = require('celery-node');
const config = require('config')
const renderer = require('./processors/renderer')

module.exports.startWorkers = async function () {
  let worker
  if (process.env.NODE_ENV === 'production') {
    worker = celery.createWorker(
      config.get('celeryBrokerProd'),
      config.get('celeryBackendProd')
    )
  } else if (process.env.NODE_ENV === 'development') {
    worker = celery.createWorker(
      config.get('celeryBroker'),
      config.get('celeryBackend')
    )
  }

  worker.register('renderer', async (storeName, storeAddress, storePhone, storeContacts, storeLogo, standardCoatingImage, expressingCoatingImage, hash, id, videoExt, isGreek) => {
    await new Promise((resolve, reject) => {
      renderer.render(storeName, storeAddress, storePhone, storeContacts, storeLogo, standardCoatingImage, expressingCoatingImage, hash, id, videoExt, isGreek, resolve, reject)
    })
    return 1
  })
      
  await worker.start();
  return worker
}