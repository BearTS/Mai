const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

checkPermissions(message).then((err)=>{

  if (err) return message.react('👎').then(()=>message.reply(err.err)).catch(console.error)

  message.guild.fetchBans().then(bans => {
    if (bans.size===0) return message.channel.send(`No user has been banned in this channel`).then(()=>{ message.react('👎')})

    fetchIfHasID(Number(args[0])).then(async(member)=>{
      if (member.err) return message.react('👎').then(()=>message.reply(user.err)).catch(console.error)

      if (member) {
        if (!bans.has(member)) return message.channel.send('This user is not banned in this server!').then(()=>{ message.react('👎')})

        const banned = bans.get(member).user;
        const warn = await message.channel.send(`Are you sure you want to unban **${banned.tag}** \`(y/n)\`?`)
        const msgs = await message.channel.send.awaitMessages(res => res.author.id === message.author.id,{
          mac: 1,
          time: 30000
        })

        if (!msgs.size || !['y','yes'].includes(msgs.first().content.toLowerCase())) return warn.edit('Aborting operation')

        await message.guild.unban(banned, `${message.author.tag}`)

        return await message.channel.send(`Successfully unbanned **${banned.tag}**!`)
      }

      fields = []
      bans.array().forEach(banned => fields.push({title: banned.user.tag, content: banned.reason}))

      showEmbed({
        title: "",
        fields: fields
      }).then(embed=>{
        return message.channel.send(`Select the user ID to be banned!`,embed)
      })
    })
  })
})



}

module.exports.help = {
  name: 'unban',
  aliases: [],
	group: 'moderator',
	description: 'Remove bans from this server',
	examples: ['unban 67382736501'],
	parameters: ['id']
}

function fetchIfHasID(member){
  return new Promise((resolve,reject)=>{
    if (isNaN(member)) resolve({err:`The argument provided is not a valid user ID`})
    if (/[0-9]+$/g.test(member) && member.length === 18) resolve(member)

  })
}


function showEmbed(fields){
  return new Promise((resolve,reject) =>{
      const embed = new RichEmbed()
      .setColor(settings.colors.embedDefault)
      .setTitle(fields.title)
      .setTimestamp()
      fields.fields.forEach(field => embed.addField(field.title,field.content,true))
      resolve(embed)
  })
}

function checkPermissions(message){
  return new Promise ((resolve,reject)=>{
    client = message.guild.members.find(g=>g.id===message.client.user.id)
    author = message.member

    //lets check the permissions of the client first
    if (!client.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, I don't have the permission to unban members!`})

    //let's check the permissions of the author next

    if (!author.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, you don't have the permission to unban members!`})

    resolve(false)
    })
  }
