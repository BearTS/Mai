const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");
const ImageRegex = /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/gi;

module.exports.run = (bot,message,args) => {

	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`Sorry, you don't have the permission to delete messages!`)
	
  let firstArg = args[0]
  let type = args.slice(1)

  getCount(firstArg).then(count => {
    if (count.err) return message.react('👎').then(()=>{message.reply(count.err)})

    validate(type).then(async (types,err)=>{
      if (types.err) return message.react('👎').then(()=>{message.reply(types.err)})

      if (types==='all') {
        try {
          const messages = await message.channel.fetchMessages({limit:count,before:message.id})
          await message.channel.bulkDelete(messages,true)
          return message.channel.send(`**${message.member.displayName}** successfully deleted ${messages.size} ${messages.size == 1 ? 'message!' : 'messages!'}`).then(()=>{message.react('👍')})
        } catch (err) {
          console.log(err)
          return message.channel.send(`These messages are too old to be deleted! I can only delete messages within two weeks!`).then(()=>{message.react('👎')})
        }
      }

      if (types==='image' || types==='pics' || types==='images'){
      try {
        const messages = await message.channel.fetchMessages({
          limit: count,
          before: message.id
        })

        const attachments = messages.filter(m => ImageRegex.test(m.content))
        const urls = messages.filter(m => m.attachments.size > 0)

        const flushable = attachments.concat(urls)

        if (flushable.size == 0) return message.channel.send(`**${message.author.username}**, there were no images to prune in the last ${count} messages!`).then(()=>{message.react('👎')})

        await message.channel.bulkDelete(flushable,true)

        const m = await message.channel.send(`**${message.author.username}** successfully deleted **${flushable.size}** ${flushable.size == 1 ? 'image!' : 'images!'}`)
      } catch (err) {
        console.log(err)
        message.channel.send(`Images are too old to be deleted! I can only delete messages within two weeks!`)
      }
}

      if (types.includes('bot') || types.includes('bots')) {
        try {
         const messages = await message.channel.fetchMessages({
            limit: count,
            before: message.id
          })

          const flushable = messages.filter(m => m.author.bot)


          if (flushable.size == 0) return message.channel.send(`**${message.author.username}**, there were no bot messages to prune in the last ${count} messages!`).then(()=>{message.react('👎')})
          await message.channel.bulkDelete(flushable,true)

          const m = await message.channel.send(`**${message.author.username}** successfully deleted **${flushable.size}** ${flushable.size == 1 ? 'bot message!' : 'bot messages!'}`)
        } catch (err) {
          console.log(err)
          message.channel.send(`Messages are too old to be deleted! I can only delete messages within two weeks!`)
        }
      }

      if (types.includes('codeblocks') || type.includes('code')){
        try {
          messages = await message.channel.fetchMessages({
            limit: count,
            before: message.id
          })

          let type1 = messages.filter(m=>m.content.startsWith('````'))
          let type2 = messages.filter(m=>m.content.includes('````'))
          const flushable = type1.concat(type2)

          if (flushable.size == 0) return message.channel.send(`**${message.author.username}**, there were no codeblocks to prune in the last ${count} messages!`).then(()=>{message.react('👎')})

          await message.channel.bulkDelete(flushable,true)

          const m = await message.channel.send(`**${message.author.username}** successfully deleted **${flushable.size}** ${flushable.size == 1 ? 'codeblock!' : 'codeblocks!'}`)
        } catch (err) {
          console.log(err)
          message.channel.send(`Codes are too old to be deleted! I can only delete messages within two weeks!`)
        }
      }

      if (types.includes('attachments') || type.includes('attachment') || type.includes('files') || type.includes('file')){
        try {
          const messages = await message.channel.fetchMessages({
            limit: count,
            before: message.id
          })
          const flushable =  messages.filter(m => m.attachments.length > 0)

          if (flushable.size == 0)  return message.channel.send(`**${message.author.username}**, there were no attachments to prune in the last ${count} messages!`).then(()=>{message.react('👎')})

          await message.channel.bulkDelete(flushable,true)

          const m = await message.channel.send(`**${message.author.username}** successfully deleted **${flushable.size}** ${flushable.size == 1 ? 'attachment!' : 'attachments!'}`)
        } catch (err) {
          console.log(err)
          message.channel.send(`Attachments are too old to be deleted! I can only delete messages within two weeks!`)
        }
      }

      if (type.includes('embeds') || types.includes('embed')){
        try {
          const messages = await message.channel.fetchMessages({
            limit: count,
            before: message.id
          })

          const flushable = messages.filter(m => m.embeds.length > 0)

          if (flushable.size == 0)  return message.channel.send(`**${message.author.username}**, there were no embeds to prune in the last ${count} messages!`).then(()=>{message.react('👎')})

          await message.channel.send(flushable,true)

          const m = await message.channel.send(`**${message.author.username}** successfully deleted **${flushable.size}** ${flushable.size == 1 ? 'embed!' : 'embeds!'}`)
      } catch (err) {
          console.log(err)
          message.channel.send(`Embeds are too old to be deleted! I can only delete messages within two weeks!`)
        }
      }

      if (type.includes('me') || type.includes('embed')){
        try {
          const messages = await message.channel.fetchMessages({
            limit: count,
            before: message.id
          })

          const flushable = messages.filter(m => m.author.id === message.author.id)

          if (flushable.size == 0)  return message.channel.send(`**${message.author.username}**, you have no messages to prune in the last ${count} messages!`).then(()=>{message.react('👎')})

          await message.channel.bulkDelete(flushable,true)

          const m = await message.channel.send(`**${message.author.username}** successfully deleted **${flushable.size + 1}** ${flushable.size == 1 ? 'personal message!' : 'personal messages!'}`)
        }
        catch (err) {
          console.log(err)
          message.channel.send(`Your personal messages are too old to be deleted! I can only delete messages within two weeks!`)
        }
      }


    })
  })





}

module.exports.help = {
  name: 'clear',
  aliases: ['delete','slowprune','sd','delet','slowdelete'],
	group: 'moderator',
	description: 'delete messages from this channel.',
	examples: ['delete all 50','clear bot 99'],
	parameters: ['category','number']
}

function getCount(count){
  return new Promise((resolve,reject)=>{
    if (count===undefined) resolve({err:`Please specify the number of messages to be deleted`})
    if (isNaN(Number(count))) resolve({err:`${count} is not a valid number!`})
    if (!(Number(count) < 100 && Number(count) > 0)) resolve({err:'I can\'t delete more than 99 messages at once!'})
    resolve(Number(count))
  })
}

function validate(type){
  return new Promise((resolve,reject)=>{

    if (type.length<1) resolve({err:`Please enter a valid type of message!\n\`all\` \`images\` \`bots\` \`codeblocks\` \`embeds\``})

    const validTypes = ['all','images', 'pics', 'image', 'bots', 'bot', 'codeblocks', 'code', 'attachments', 'attachment', 'files', 'file', 'embeds', 'embed', 'me']

    let accepted = type.filter(m=>validTypes.includes(m))

    if (accepted.length === 0) resolve({err:`Please enter a valid type of message!\n${`all` `images` `bots` `codeblocks` `embeds`}`})

    if (accepted.length > 1) resolve({err:`Please enter only one valid type of message! Multiple types are not supported`})

     resolve(accepted.toString())
  })
}
