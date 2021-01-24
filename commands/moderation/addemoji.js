module.exports = {
  name: 'addemoji',
  aliases: [],
  guildOnly: true,
  permissions: ['MANAGE_EMOJIS'],
  clientPermissions: ['MANAGE_EMOJIS'],
  group: 'moderation',
  description: 'Add an emoji to the server via the supplied link',
  examples: ['addemoji https://some-random-website/theimage.png emojiname'],
  parameters: ['URL', 'emoji name'],
  run: async (client, message, [ url, name]) => {

    if (!url || !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, please provide a valid image link!`)

    return message.guild.emojis.create(url, name ? name : 'emoji')
            .then((emoji) => message.channel.send(`Successfully created emoji **${emoji.name}** | ${emoji}`))
              .catch((err) =>  message.channel.send(`<:cancel:767062250279927818> | ${message.author}, ${err.message.replace(`Invalid Form Body\nimage:`,'')}.`))

  }
}
