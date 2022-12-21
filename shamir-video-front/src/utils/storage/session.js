import { getExpiryStorage, updateExpiryStorage, createExpiryStorage, deleteStorage } from './methods'
import { UserSession } from '../models/UserSession'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_NAME = 'userSession'
const TTL = 5 * 60 * 60 * 1000

const sessionStorage = {
    init: () => {
        const storage = getExpiryStorage(STORAGE_NAME)
        console.log('init storage', storage)
        if (!storage) {
            const session = new UserSession(uuidv4())
            console.log('new session in init', session)
            createExpiryStorage(STORAGE_NAME, session, TTL)
            return session
        }
        return storage
    },

    get: () => getExpiryStorage(STORAGE_NAME),

    update: (value) => updateExpiryStorage(STORAGE_NAME, value),

    updateField: (key, value) => {
        const storageValue = getExpiryStorage(STORAGE_NAME)
        storageValue[key] = value
        updateExpiryStorage(STORAGE_NAME, storageValue)
    },

    delete: () => deleteStorage(STORAGE_NAME),
}

export default sessionStorage
