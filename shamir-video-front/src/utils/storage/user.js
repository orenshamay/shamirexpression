import { getStorage, updateStorage, deleteStorage } from './methods'
import User from '../models/User'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_NAME = 'user'

const userStorage = {
    init: (initialValues) => {
        const storage = getStorage(STORAGE_NAME)
        if (!storage) {
            const user = Object.assign(new User(), initialValues)
            user.id = uuidv4()
            updateStorage(STORAGE_NAME, user)
            return user
        }
        return storage
    },

    get: () => getStorage(STORAGE_NAME),


    update: (value) => updateStorage(STORAGE_NAME, value),
    updateField: (key, value) => {
        const storageValue = getStorage(STORAGE_NAME)
        storageValue[key] = value
        updateStorage(STORAGE_NAME, storageValue)
    },

    delete: () => deleteStorage(STORAGE_NAME),
}

export default userStorage
