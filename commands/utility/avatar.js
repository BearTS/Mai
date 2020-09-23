const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'avatar',
  aliases: ['av','pfp'],
  guildOnly: true,
  group: 'utility',
  description: "Shows avatar of a given user",
  examples: ["avatar @user","avatar 521598384003395222"],
  parameters: ['user mention','user id'],
  run: async (client, message, args) => {

    const match = message.content.match(/\d{17,19}/);

    let member = match
                ? await message.guild.members.fetch(match[0]).catch(()=> null) || message.member
                : message.member

    return message.channel.send(new MessageEmbed()

    .setDescription(`[${
                      message.author.id === member.id
                      ? `Your`
                      : member.id === client.user.id
                        ? 'Oh? Here\'s my'
                        :`${member}'s`
                    } avatar](${
                      member.user.displayAvatarURL({format:'png',dynamic:true,size:1024})
                    })`)

    .setColor(member.displayColor
              ? member.displayColor
              : 'GREY')

    .setImage(member.user.displayAvatarURL({format:'png',dynamic:true,size:1024}))
    )
  }
}
