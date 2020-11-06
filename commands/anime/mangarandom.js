const { MessageEmbed } = require('discord.js');
const { decode } = require('he');

const {
  TextHelpers: { textTrunctuate, joinArray },
  LocalDatabase: { mangaDB },
  AniListQuery: query
} = require('../../helper');

const months = [
  '', 'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];

const fm = { MANGA: 'Manga', NOVEL: 'Light Novel', ONE_SHOT: 'One Shot Manga'};


module.exports = {
  name: 'mangarandom',
  aliases: [
    'mangarand'
  ],
  cooldown: {
    time: 10000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  },
  group: 'anime',
  description: 'Generates a random manga recommendation. Recommends a Hentai if used on a nsfw channel.',
  clientPermissions: [
    'EMBED_LINKS'
  ],
  examples: [
    'mangarandom'
  ],
  parameter: [],
  run: async ( client, message ) => {

    message.channel.startTyping()

    const { ids: { al: id }} = message.channel.nsfw
    ? mangaDB.filter(a => a.isAdult)[Math.floor(Math.random() * mangaDB.filter(a => a.isAdult).length)]
    : mangaDB.filter(a => !a.isAdult)[Math.floor(Math.random() * mangaDB.filter(a => !a.isAdult).length)]

    const { errors , data } = await query(`query ($id: Int) { Media(id: $id){ siteUrl id idMal isAdult format startDate { year month day } chapters volumes genres studios(isMain:true){ nodes{ name siteUrl } } coverImage{ large color } description title { romaji english native userPreferred } } }`, { id })

    // If errored due to ratelimit error
    if (errors && errors.some(x => x.status === 429))
    return message.channel.send(
      new MessageEmbed()
      .setAuthor('Oh no! Mai has been rate-limited', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      .setDescription(
        `**${message.member.displayName}**, please try again in a minute.\n\n`
        + `If this error occurs frequently, please contact **Sakurajimai#6742**.`
      ).setColor('RED')
      .setFooter(`Random Recommendations | \©️${new Date().getFullYear()} Mai`)
    )

    // If errored due to validation errors
    if (errors && errors.some(x => x.status === 400))
    return message.channel.send(
      new MessageEmbed()
      .setAuthor('Oops! A wild bug 🐛 appeared!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      .setDescription(
        `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`
        + `Please contact **Sakurajimai#6742** for a quick fix.\n`
        + `You can make an issue on the [repository](${client.config.github}) or [join](https://support.mai-san.ml/) Mai's dev server instead.`
      ).setColor('RED')
      .setFooter(`Random Recommendations | \©️${new Date().getFullYear()} Mai`)
    )

    // If errored due to other reasons
    if (errors)
    return message.channel.send(
      new MessageEmbed()
      .setAuthor('Oops! An unexpected error occured!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      .setDescription(
        `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`
        + `This might be an issue on Anilist's end. Please try again in a minute\n`
        + `If this doesn't resolve in few hours, you may contact **Sakurajimai#6742**`
        + `You can also make an issue on the [repository](${client.config.github}) or [join](https://support.mai-san.ml/) Mai's dev server instead.`
      ).setColor('RED')
      .setFooter(`Random Recommendations | \©️${new Date().getFullYear()} Mai`)
    )

    const media = data.Media;

    return message.channel.send(
      new MessageEmbed()
      .setColor(media.coverImage.color)
      .setAuthor(textTrunctuate(`${media.title.romaji || media.title.english || media.title.native} | ${fm[media.format]}`, null, media.siteUrl))
      .setDescription((media.studios.nodes || []).slice(0,1).map( x => `[${x.name}](${x.siteUrl})`).join(''))
      .addField(
        'Other titles',
        `**Native**: ${media.title.native || 'None'}.\n`
        + `**Romanized**: ${media.title.romaji || 'None'}.\n`
        + `**English**: ${media.title.english || 'None'}.`
      )
      .addField('Genres', (media.genres || ['','']).reduce((acc,curr,i) => {
        if (!acc || !curr) return ''

        if (media.genres.length === 2) return `${acc} and ${curr}.`

        if (i === media.genres.length - 1) return `${acc}, and ${curr}.`

        return `${acc}, ${curr}`}) || '\u200b'
      )
      .addField('Started', `\u200b${months[media.startDate.month || 0]} ${media.startDate.day || ''} ${media.startDate.year || ''}`, true)
      .addField('Chapters', media.chapters || 'Unknown', true)
      .addField('Volumes', media.volumes || 'Unknown', true)
      .setFooter(`Random Recommendations | \©️${new Date().getFullYear()} Mai`)
      .setThumbnail(media.coverImage.large)
      .addField('\u200b', `\u200b${textTrunctuate(decode((media.description || '').replace(/<br><br>/g,'\n')), 1000, ` […Read More](https://myanimelist.net/anime/${media.idMal}).`)}`)
    ).then(() => message.channel.stopTyping())
  }
}
