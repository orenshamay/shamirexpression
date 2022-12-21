const STORAGE_NAME = 'shamirStorage'

const useLocalStorage = () => {
    const getStorage = () => {
        const string = localStorage.getItem(STORAGE_NAME)
        if(!string || string.length === 0 ) return {}
        return JSON.parse(string)
    }
    
    const updateStorage = (key, value) => {
        const storage = getStorage()
        storage[key] = value
        localStorage.setItem(storage)
    }

    const deleteStorage = () => {
        localStorage.removeItem(STORAGE_NAME)
    }

    return [getStorage, updateStorage, deleteStorage]
}

export default useLocalStorage