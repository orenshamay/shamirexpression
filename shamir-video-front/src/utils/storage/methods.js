const getStorage = (storageName) => {
    const string = localStorage.getItem(storageName)
    if (!string || string.length === 0) return null
    return JSON.parse(string)
}

const updateStorage = (storageName, value) => {
    const string = JSON.stringify(value)
    localStorage.setItem(storageName, string)
}

const deleteStorage = (storageName) => {
    localStorage.removeItem(storageName)
}

const getExpiryStorage = (storageName) => {
    const storage = getStorage(storageName)
    if (!storage) return null
    const now = new Date()
    if (now.getTime() > storage.expiry) {
        localStorage.removeItem(storageName)
        return null
    }
    return storage.value
}

const updateExpiryStorage = (storageName, value) => {
    const storage = getStorage(storageName)
    storage.value = value
    const string = JSON.stringify(storage)
    localStorage.setItem(storageName, string)
}

const createExpiryStorage = (storageName, value, ttl) => {
    const now = new Date()
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(storageName, JSON.stringify(item))
}

export {
    getStorage,
    updateStorage,
    deleteStorage,
    getExpiryStorage,
    updateExpiryStorage,
    createExpiryStorage
}
