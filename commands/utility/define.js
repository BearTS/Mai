const { MessageEmbed } = require('discord.js')
const urban = require('relevant-urban')
const badwords = require('bad-words')
const { TextHelpers: { textTrunctuate }} = require(`${process.cwd()}/helper`)
const additionalBadWords = require(`${process.cwd()}/assets/json/filter.json`)
const filter = new badwords()
filter.addWords(...additionalBadWords)

module.exports = {
  name: 'define',
  aliases: ['urban','ud'],
  group: 'utility',
  description: 'Searches for your query on Urban Dictionary. Note: Using this on a nsfw channel disables the word profanity filter feature.',
  examples: ["urban [term]","define [term]"],
  parameters: [],
  run: async ( client, message, args) => {

    if (!args.length) {
      return message.channel.send( new MessageEmbed()
      .setAuthor(`Urban Dictionary`,`https://files.catbox.moe/kkkxw3.png`,`https://www.urbandictionary.com/`)
      .setTitle(`Definition of Best Girl`)
      .setURL('https://ao-buta.com/tv/?innerlink')
      .addField(`Definition`,`No arguing, Mai Sakurajima indeed is the best anime girl!`)
      .addField('Example(s)', '[Mai sakurajima] is the best girl around. No one could beat her, not even zero two.')
      .setColor('#e86222')
      .setFooter(`Submitted by Sakuta Azusagawa`))
    }

    if (filter.isProfane(args.join(' ')) && !message.channel.nsfw)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You cannot look-up for the definition of that term in a sfw channel!\n\nNot a profane word? Contact my developer through the command \`feedback\` and ask to whitelist the word!`)

    const defs = await urban(encodeURI(args.join(' '))).catch(()=> null)

    if (!defs)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, No definition found for **${args.join(' ')}**`)

    const { word, urbanURL, definition, example, author, thumbsup, thumbsdown } = defs

    return message.channel.send( new MessageEmbed()
    .setAuthor(`Urban Dictionary`,`https://files.catbox.moe/kkkxw3.png`,`https://www.urbandictionary.com/`)
    .setTitle(`Definition of ${word}`)
    .setURL(urbanURL)
    .addField(`Definition`, message.channel.nsfw ? textTrunctuate(definition) : textTrunctuate(filter.clean(definition),1000))
    .addField('Example(s)', example ? message.channel.nsfw ? textTrunctuate(example,1000) : textTrunctuate(filter.clean(example),1000) : 'N/A')
    .setColor('#e86222')
    .setFooter(`Submitted by ${message.channel.nsfw ? author : `${filter.clean(author)}\nProfane word? Contact my developer through the command \`feedback\` and ask to blacklist the word!`}`)
    )
  }
}
