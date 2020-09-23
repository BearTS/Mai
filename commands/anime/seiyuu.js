const { MessageEmbed } = require('discord.js')
const {
    Seiyuu
  , AniListQuery: query
  , TextHelpers: { textTrunctuate, joinArray }
} = require('../../helper.js')

module.exports = {
  name: 'seiyuu'
  , aliases: [
    'voice'
    , 'va'
  ]
  , cooldown: {
    time: 10000
    , msg: 'Oops! You are going to fast! Please slow down to avoid being rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , group: 'anime'
  , description: 'Search for seiyuu\'s on your favorite anime characters!'
  , examples: [
    'seiyuu Takahashi Rie'
    , 'voice Amamiya Sora'
  ]
  , parameters: [
    'search query'
  ]
  , run: async ( client, message, args) => {

    const search = args.length
                  ? args.join(' ')
                  : 'Seto Asami'

    let mainpage = await message.channel
                          .send(new MessageEmbed()
                                .setColor('YELLOW')
                                .setDescription(`\u200B\nSearching for character named **${
                                  search
                                }** on <:anilist:719460833838759967> [Anilist](https://anilist.co 'Anilist Homepage').\n\u200B`)
                                .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
                            )

    let res = await query(Seiyuu, { search })


    if (
      res.errors
      && res.errors.some(
        ({ message }) => message !== 'Not Found.'
      )
    ) return mainpage.edit(
        '<:cancel:712586986216489011> | Oops '
      + message.author.toString()
      + '! An unexpected error has occured!\n\n'
      + '\`\`\`xl\n'
      + res.errors.map(
          ({ message }) => '• ' + message
        ).join('\n')
      + '\`\`\`'
    , { embed: null})
    ? null
    : message.channel.send(
        '<:cancel:712586986216489011> | Oops '
      + message.author.toString()
      + '! An unexpected error has occured!\n\n'
      + '\`\`\`xl\n'
      + res.errors.map(
          ({ message }) => '• ' + message
        ).join('\n')
      + '\`\`\`'
    )


    if (
      res.errors
      && res.errors.some(
        ({ message }) => message === 'Not Found.'
      )
    ) return mainpage.edit(
        '<:cancel:712586986216489011> | '
      + message.author.toString()
      + ', I couldn\'t find Voice Actor **'
      + search
      + '** on <:anilist:719460833838759967> AniList'
    , { embed: null })
    ? null
    : message.channel.send(
      '<:cancel:712586986216489011> | '
    + message.author.toString()
    + ', I couldn\'t find Voice Actor **'
    + search
    + '** on <:anilist:719460833838759967> AniList'
    )


    const elapsed = Date.now() - message.createdTimestamp

    res = res.data.Staff

    const ch = await charahyperlink(res.characters.nodes)
    const an = await hyperlinkify(res.staffMedia.nodes)

    const embed = new MessageEmbed()

      .setAuthor(`${res.name.full}${
          res.name.native
          ? ` • ${res.name.native}`
          :''}`
        , null, res.siteUrl)

      .setThumbnail(res.image.large)

      .setColor('GREY')

      .setDescription(`${
          res.language
        }\n\n${
          res.description
          ? textTrunctuate(res.description.replace(/(<([^>]+)>)/ig,''), 1000, `...[Read More](${res.siteUrl})`)
          : ''
        }`)

      .addField(`${res.name.full} voiced these characters`, ch)

      .addField(`${res.name.full} is part of the staff of these anime`, an)

      .setFooter(`Anilist.co • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)

    return await mainpage.edit(embed).catch(()=>null)
           ? null
           : message.channel.send(embed).then(()=>null)

  }
}


async function charahyperlink(arr){
  if (!arr.length) return `None Found`

  let res = ''

  arr.forEach( ({ name: { full }, siteUrl }) =>{
    let toAdd = ` • [${full}](${siteUrl})`
    if (res.length + toAdd.length > 1000) {
      return
    }
    res += toAdd
  })

  return res
}

async function hyperlinkify(arr){
  if (!arr.length) return `None Found`

  let res = ''

  arr.forEach( ({ title: { romaji }, siteUrl }) => {
    let toAdd = ` • [${romaji}](${siteUrl})`
    if (res.length + toAdd.length > 1000) {
      return
    }
    res += toAdd
   })

  return res

}
