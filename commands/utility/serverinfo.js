const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const constants = require('../../util/constants.js');

module.exports = {
  name: 'serverinfo',
  aliases: [ 'guild', 'server', 'serverstat', 'serverstats', 'guildstat', 'guildstats' ],
  group: 'utility',
  guildOnly: true,
  description: 'Displays the basic information of the server',
  examples: [
    'serverinfo'
  ],
  run: async (client, message) => message.channel.send(
    new MessageEmbed()
    .setColor('GREY')
    .setAuthor(`♨️ ${message.guild.name} Server Information`, message.guild.iconURL())
    .setFooter(`Server | ©️${new Date().getFullYear()} Mai`)
    .addFields([
      {
        name: '__**SERVER**__', inline: true,
        value: [
          `**Owner**:\u2000${await message.guild.members.fetch(message.guild.ownerID).then(x => x.user.tag)}`,
          `**Region**:\u2000${message.guild.region.split('')[0].toUpperCase() + message.guild.region.slice(1)}`,
          `**Verification Level**:\u2000${constants.verificationlvl[message.guild.verificationLevel]}`,
          `**Boost**:\u2000Level **${message.guild.premiumTier}** *(${message.guild.premiumSubscriptionCount} boosts)*`
        ].join('\n')
      },{
        name: '__**MEMBERS**__', inline: true,
        value: [
          `**Count**:\u2000${message.guild.memberCount}`,
          `**Vacancy**:\u2000${250000 - message.guild.memberCount}`,
          `**Percent Occupancy**:\u2000${(message.guild.memberCount/250000*100).toFixed(2)}%`
        ].join('\n')
      },{
        name: '__**ROLES**__', inline: true,
        value: [
          `**Count**:\u2000${message.guild.roles.cache.size - 1}`,
          `**Unused Slot**:\u2000${249 - message.guild.roles.cache.size}`,
          `**Percent Used**:\u2000${(message.guild.roles.cache.size/250*100).toFixed(2)}%`
        ].join('\n')
      },{
        name: '__**EMOJIS (Static)**__', inline: true,
        value: [
          `**Count**:\u2000${message.guild.emojis.cache.filter(x => !x.animated).size}`,
          `**Unused Slot**:\u2000${(50*(message.guild.premiumTier===3?5:message.guild.premiumTier+1))-message.guild.emojis.cache.filter(x=>!x.animated).size}`,
          `**Percent Used**:\u2000${message.guild.emojis.cache.filter(x=>!x.animated).size/(50*(message.guild.premiumTier===3?5:message.guild.premiumTier+1))*100}%`
        ].join('\n')
      },{
        name: '__**EMOJIS (Animated)**__', inline: true,
        value: [
          `**Count**:\u2000${message.guild.emojis.cache.filter(x => x.animated).size}`,
          `**Unused Slot**:\u2000${(50*(message.guild.premiumTier===3?5:message.guild.premiumTier+1))-message.guild.emojis.cache.filter(x=>x.animated).size}`,
          `**Percent Used**:\u2000${message.guild.emojis.cache.filter(x=>x.animated).size/(50*(message.guild.premiumTier===3?5:message.guild.premiumTier+1))*100}%`
        ].join('\n')
      },{
        name: '__**Channels**__', inline: true,
        value: [
          `**Count**:\u2000**Text**(${message.guild.channels.cache.filter(x=>x.type==='text').size})\u2000**Voice**(${message.guild.channels.cache.filter(x=>x.type==='voice').size})\u2000**Category**(${message.guild.channels.cache.filter(x=>x.type==='category').size})`,
          `**Unused Slot**:\u2000${500-message.guild.channels.cache.size}`,
          `**Percent Used**:\u2000${(message.guild.emojis.cache.size/500*100).toFixed(2)}%`
        ].join('\n')
      },{
        name: 'Created',
        value: moment(message.guild.createdAt).format('dddd, do MMMM YYYY')
      }
    ])
  )
};
