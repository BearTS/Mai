const { Collection } = require('discord.js')

module.exports = class PersonalizedCollections{
  constructor(array){
    if (!array) array = []
    for (const element of array){
      this[element] = new Collection()
    }
  }

  exists(collection, key){
    return this[collection] && this[collection].get(key) ? true : false
  }

  add(collection){
    if (this[collection]) throw new TypeError(`Collection named ${collection} already exist.`)

    this[collection] = new Collection()

    return this
  }

  getFrom(collection, key){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].get(key)
  }

  getFirst(collection){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].first()
  }

  getLast(collection){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].first()
  }

  getRandom(collection, value){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].random(value && typeof value === 'number' ? value : 1)
  }

  findFrom(collection, fn){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].find(fn)
  }

  setTo(collection, key, value){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].set(key, value)
  }

  deleteIn(collection, key){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].delete(key)
  }

}
