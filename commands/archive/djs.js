const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')


module.exports = {
  name: 'djs',
  aliases: [],
  group: 'utility',
  description: 'Query the Discord.js documentation',
  examples: ['djs Client#guilds', 'djs Collection#get --src=collection'],
  parameters: ['query'],
  run: async( client, message, [ query, src ]) => {


    if (!query)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please provide your query`)

    src = src && src.startsWith('--src=') ? src.replace('--src=','') : 'stable'


    const res = await new Promise((resolve)=>{
      const timeout = setTimeout(()=> resolve({status:503,error:'Service Unavailable',message:'Couldn\'t reach the DJS docs.'}), 10000)
      fetch(`https://djsdocs.sorta.moe/v2/embed?src=${src}&q=${encodeURI(query).replace('#','.')}`)
        .then(res => res.json())
          .then(res => resolve(res))
            .catch(()=>resolve({error:'Service Unavailable', message: 'Couldn\'t reach the DJS docs.'}))
    })

    if (!res || res.error)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, ${res.message}`)

    return message.channel.send( new MessageEmbed(res)
                                  .setColor('GREY')
                                  .setFooter(`Powered by: Discord.js`)


    )
  }
}
