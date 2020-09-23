module.exports = {
  name: 'reverse'
  , aliases: []
  , group: 'fun'
  , description: 'Reverse the supplied text'
  , examples: []
  , parameters: []
  , run: async (client, message, args) => {

    if (!args.length)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}! Please specify the text to reverse!`)

    return message.channel.send(args.join(' ').split('').reverse().join(''))

  }
}
