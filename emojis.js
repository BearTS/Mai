
const emojis = {
  left: { custom: '712581829286166579', default: '◀' },
  right: { custom: '712581873628348476', default: '▶' },
  cancel: { custom: '712586986216489011', default: '❌' },
}

module.exports = {
  pointleft: ({ emojis: { cache } }) => {
    const emoji = cache.get(emojis.left.custom)
    return emoji ? emoji : emojis.left.default
  },
  pointright: ({ emojis: { cache } }) => {
    const emoji = cache.get(emojis.right.custom)
    return emoji ? emoji : emojis.right.default},
  cancel: ({ emojis: { cache } }) => {
    const emoji = cache.get(emojis.cancel.custom)
    return emoji ? emoji : emojis.cancel.default
  }
}
