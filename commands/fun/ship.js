const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'ship',
  aliases: [],
  group: 'fun',
  description: 'Love calculator? Anyone?',
  parameters: [],
  run: async (client, message, [ first , second ]) => {

    const embed = new MessageEmbed()

    const verdict = (percentage) => [
        'Not a slightest chance. You should give up.'
      , 'You are more likely to get hit by a lightning than you two ever coming together'
      , 'If there\'s a chance.. Why not?', 'You should be married now!'
      , 'Both of you are definitely soulmates'
      , 'Fate has decided'
    ][Math.floor(percentage / 20)]

    const title = (percentage) => [
        'God has given up on you '
      , 'In other words, still no chance '
      , 'You make an average pair!'
      , 'Onwards! To the church! '
      , 'I knew it! You make a unique pair!'
      , 'PERFECT MATCH. The love powerlevel is over 9000 '
    ][Math.floor(percentage / 20)]

    const color = (percentage) => [
        percentage > 50
        ? 255 - Math.floor(((percentage - 50) * 2 * 255) / 100)
        : 255
      , percentage < 50
        ? Math.floor((percentage * 2 * 255) / 100)
        : 255
      , 0
    ]

    const emoji = (rate) => [
        '\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️'
    ][Math.floor(rate / 10)]

    let percentage = null

    if (!first) {
      for (const id of message.guild.members.cache.filter(m => !m.user.bot).keys())
        first = first
                ? (parseInt(message.member.id) + parseInt(id)) % 101 > first
                  ? id
                  : first
                : id

      if (!first)
        return message.channel.send(`<:cancel:767062250279927818> | ${message.author}! There isn't any human on your server!`)

        percentage = (parseInt(message.member.id) + parseInt(first)) % 101

        embed.setAuthor(`${message.author.tag}'s highest shipmeter rating!`)

          .setDescription(`${
              emoji(percentage)
            }\n\n${
              verdict(percentage)
            }\n\n${
              message.author
            }'s highest affection meter belongs to <@${
              first
            }> (${
              message.guild.members.cache.get(first).user.tag
            }) at **${
              percentage
            }**%`
          )

          .setColor(color(percentage))

          .setTitle(title(percentage))

      return message.channel.send(embed)
    }

    if (!first.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}! The supplied argument is neither an ID nor a mention!`)

    first = await message.guild.members.fetch(first.match(/\d{17,19}/)[0])
              .then(member => member.id)
                .catch(()=>null)

    if (!first)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}! The supplied ID is not a valid Discord User ID, or that member is not in this server!`)

    if (second && second.match(/\d{17,19}/)) {
    second = await message.guild.members.fetch(second.match(/\d{17,19}/)[0])
                    .then(member => member.id)
                      .catch(() => null)
    }

    if (!second || !second.match(/\d{17,19}/)){
      percentage = (parseInt(message.member.id) + parseInt(first)) % 101

      embed.setAuthor(`${message.author.tag}'s shipmeter rating with ${message.guild.members.cache.get(first).user.tag}`)

          .setDescription(`${
              emoji(percentage)
            }\n\n${
              verdict(percentage)
            }\n\nThe couple's compatibility reading is at **${
              percentage
            }**%`)

          .setColor(color(percentage))

          .setTitle(title(percentage))

      return message.channel.send(embed)

    }
    percentage = (parseInt(first) + parseInt(second)) % 101

    embed.setAuthor(`${message.guild.members.cache.get(first).user.tag}'s shipmeter rating with ${message.guild.members.cache.get(second).user.tag}`)

        .setDescription(`${
            emoji(percentage)
          }\n\n${
            verdict(percentage)
          }\n\nThe couple's compatibility reading is at **${
            percentage
          }**%`)

        .setColor(color(percentage))

        .setTitle(title(percentage))

    return message.channel.send(embed)
  }
}
