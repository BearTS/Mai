module.exports = (data, collector) => {

  const add = (user) => {
    if (data.some( p => p.id === user.id)) return null
    data.push({
      name: user.tag,
      id: user.id,
      score: 0
    })
    return
  }

  return new Promise( resolve => {
    setTimeout(() => resolve(data), 30000)
    collector.on('collect', async (reaction, user) => add(user))
  })
}
