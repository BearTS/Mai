const { TextHelpers: { timeZoneConvert }} = require('../../helper')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'clear',
  aliases: ['delete','slowprune','sd','delete','slowdelete'],
  guildOnly: true,
  permissions: ['MANAGE_MESSAGES'],
  clientPermissions: ['MANAGE_MESSAGES'],
  group: 'moderation',
  description: 'Delete messages from this channel. Will not delete messages older than two (2) weeks.',
  examples: ['delete [quantity]'],
  parameters: ['amount of messages'],
  run: async (client, message, [ quantity ]) => {

    if (!quantity || isNaN(quantity) || quantity < 2 || quantity > 100)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`)

    return message.channel.bulkDelete(Number(quantity), true)
      .then( async messages =>  {

        let data = `Messages Cleared on ![](${message.guild.iconURL({size: 32})}) **#${message.channel.name}** (${message.channel.id}) --**${message.guild.name}** (${message.guild.id})--\r\n\r\n`
        for (const message of messages.array().reverse())
          data+= `[${timeZoneConvert(message.createdAt)}] ${message.author.tag} (${message.author.id}) : ${message.content}\r\n\r\n`

        const url = await client.channels.cache.get(client.uploadchannel)
                            .send({ files: [{ attachment: Buffer.from(data), name: "bulkDelete.txt" }]})
                              .then((message)=> [message.attachments.first().url, message.attachments.first().id])
                                .catch(()=>[' ',null])

        return message.channel.send(`Successfully deleted **${messages.size}** messages from this channel!`, new MessageEmbed().setColor('GREY').setDescription(`[\`📄 View\`](${url ? `https://txt.discord.website/?txt=${url[0].match(/\d{17,19}/)[0]}/${url[1]}/bulkDelete` : url[0]}) • [\`📩 Download\`](${url[0]})`))
    })
  }
}
