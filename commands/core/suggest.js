const { MessageEmbed } = require("discord.js");

module.exports = {
  config:{
    name: "suggest",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown:{
      time: 60 * 60 * 24,
      msg: "You are only allowed to use this command once a day!"
    },
    group: "core",
  	description: 'Suggest something for the server.',
  	examples: ['suggest Please remove some inactive members.....'],
  	parameters: ['suggestion content']
  },
  run: ( client, message, args ) => {

    if (!message.guild.channels.cache.find(c => c.name === 'suggestions')) {

      return message.channel.send(new MessageEmbed()
        .setColor('RED')
        .setDescription('\u200B\n#suggestions channel not found!\n\u200B'))

    }

    if (!args.length) return message.react('👎').then(()=>message.channel.send(new MessageEmbed().setColor('RED').setDescription(`No Message Included. This constitutes a spam, thus you won't be able to use this command again today.`)))

    let channel = message.guild.channels.cache.find(c => c.name === 'suggestions')

    const embed = new MessageEmbed()
    .setTitle(`${message.member.displayName}'s suggestion`)
    .setColor('YELLOW')
    .setDescription(args.join(' '))
    .setThumbnail(message.author.displayAvatarURL({format:'png',dynamic:true,size:1024}))
    .addField('Status','Under Review')

    channel.send(embed).then(async (m)=>{
      await message.react('🇸')
      await message.react('🇪')
      await message.react('🇳')
      await message.react('🇹')
      await m.react('⬆')
      await m.react('⬇')
    })
  }
}
