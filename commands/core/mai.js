const { safe, nsfw } = require('../../assets/json/mai.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "mai",
    aliases: ['bestgirl'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: ['ATTACH_FILES'],
    cooldown: null,
    group: "core",
    description: "Mai is the best girl and there's no denying it! Using this command in a nsfw channel automatically toggles the nsfw feature of this command.",
    examples: [],
  	parameters: []
  },
  run: async (client, message) => {

    if (message.channel.nsfw) return message.channel.send( new MessageEmbed().setColor('RED').setImage(nsfw[Math.ceil(Math.random() * (nsfw.length))]))

    return message.channel.send( new MessageEmbed().setColor('GREY').setImage(safe[Math.ceil(Math.random() * (safe.length))]))

  }
}


/* updater

{  const danbooru = new Danbooru()
  const res = await danbooru.posts({ tags: 'sakurajima_mai' , limit: 200, page: 4})
  console.log(res.length)
  await res.forEach( pic => {
    if (typeof pic !== 'object') return
    if (!pic.large_file_url) return
    if (pic.rating === 's'){
      if (mai.safe.includes(pic.large_file_url)) return
      mai.safe.push(pic.large_file_url)
    } else {
      if (mai.nsfw.includes(pic.large_file_url)) return
      mai.nsfw.push(pic.large_file_url)
    }
  })
  writeFile("./assets/json/mai.json", JSON.stringify(mai, null, 2), (err) =>{
  if (err) return console.log(err)
  console.log('Success')
});}

*/
