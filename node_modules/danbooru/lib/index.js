const resources = require('./resources')
const constants = require('./constants')
const booru = require('./booru')

class Danbooru extends booru {}

for (const { prototype } of resources) {
  const descriptors = Object.getOwnPropertyDescriptors(prototype)
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === 'constructor' || typeof descriptor.value !== 'function')
      continue
    Object.defineProperty(Danbooru.prototype, key, descriptor)
  }
}

Danbooru.data = constants.data
Danbooru.headers = constants.headers
Danbooru.status = constants.status

module.exports = Danbooru
