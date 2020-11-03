export const SESSION_STORAGE = 'sessionStorage'
export const LOCAL_STORAGE = 'localStorage'

const storages = [SESSION_STORAGE, LOCAL_STORAGE]

class Storage {
  constructor (key, storageType = SESSION_STORAGE) {
    if (!storageType.includes(storages)) {
      this.storageType = SESSION_STORAGE
    }
    this.key = key
    this.storageType = storageType
    this.init()
  }

  init () {
    if (!window[this.storageType].getItem(this.key)) {
      window[this.storageType].setItem(this.key, JSON.stringify({}))
    }
  }

  /**
   * Private method to get storage
   * @returns {Object} parsed storage
   */
  getStorage () {
    return JSON.parse(window[this.storageType].getItem(this.key))
  }

  /**
   * Private method to update storage with an object
   * @param {Object} obj
   */
  setStorage (obj) {
    window[this.storageType].setItem(this.key, JSON.stringify(obj))
  }

  setItem (key, value) {
    const previousStorage = this.getStorage()
    previousStorage[key] = value
    this.setStorage(previousStorage)
  }

  getItem (key) {
    const storage = this.getStorage()
    return storage[key]
  }

  clearStorage () {
    window[this.storageType].removeItem(this.key)
    this.init()
  }
}

export default Storage
