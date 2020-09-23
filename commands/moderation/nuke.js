module.exports = {
  name: 'nuke',
  aliases: ['clearall'],
  guildOnly: true,
  permissions: ['MANAGE_MESSAGES','MANAGE_CHANNELS'],
  clientPermissions: ['MANAGE_CHANNELS'],
  group: 'moderation',
  description: 'Removes all messages in the channel (Deletes the old channel and makes a copy of it with permissions intact)',
  examples: [],
  parameters: [],
  run: async ( client, message) => {

    await message.channel.send(`This will remove all conversations in this channel. Continue?`)

    collector = message.channel.createMessageCollector( res => message.author.id === res.author.id )

    const continued = await new Promise( resolve => {
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
      collector.on('collect', (message) => {
        if (['y','yes'].includes(message.content.toLowerCase())) resolve(true)
        if (['n','no'].includes(message.content.toLowerCase())) resolve(false)
      })
      collector.on('end', () => resolve(false))
    })

    if (!continued)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, cancelled the nuke command!`)

    await message.channel.send(`The nuke has been deployed. This channel will be wiped off the face of discord in 10`)

    return setTimeout(()=>{

      message.channel.clone()
        .then(() => message.channel.delete().catch(()=>null))
          .catch(()=> null)

    }, 10000)
  }
}
