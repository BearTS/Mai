const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const articles = require('./../../assets/json/articles.json')
const current = new Set()

module.exports.run = (bot,message,args) => {

if (args.length===0)  return message.channel.send('Error: Please include a query to search with.').then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

let results = articles.filter(r=>r.searchQuery.includes(args.join(' ')))

if (results.length===0) return message.channel.send(`Sorry ${message.member.displayName}, there were no articles found for ${args.join(' ')}`)

if (current.has(message.author.id)) return message.channel.send(`**${message.member.displayName}**, you still have an existing article that was not terminated. Please terminate that article before proceeding to read another.`)

let results_length = (results.length<11) ? results.length : 10;

let titles='';

for (let i=0;i<results_length;i++){
  titles += `${i+1}. ${results[i].data[0].title}\n\n`
}

let embed = new RichEmbed()
.setColor(settings.colors.embedDefault)
.setAuthor(`Top ${results_length} articles matching ${args.join(' ')}.`)
.setDescription(titles)
.setFooter(`React on the corresponding number to view article.`)

message.channel.send(embed).then(async (msg)=>{
  const emojilist = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];
  const collector = await msg.createReactionCollector((reaction,user)=>user.id===message.author.id)
  let validReactions = []
  for (let i=0;i<results_length;i++) {
    await msg.react(emojilist[i])
    await validReactions.push(emojilist[i])
  }
  msg.react('❌')
  let selectedArticle;

  let timeout = setTimeout(()=>{
    return collector.stop('timeout')
  },120000)

  collector.on('collect',async (r,user)=>{

    if (validReactions.includes(r.emoji.name)){
      let index = validReactions.indexOf(r.emoji.name)
      selectedArticle = results[index]
      return collector.stop('foundOne')
    }
    else if (r.emoji.name==='❌'){
      return collector.stop('cancelled')
    }
  })

  collector.on('end',async (collected,reason) => {
    if (reason==='timeout') return msg.edit(`Timeout error. No response detected`).then(msgs=>msgs.clearReactions()).catch()
    if (reason==='cancelled') return msg.edit(`Cancelled.`).then(msgs=>msgs.clearReactions()).catch()
    current.add(message.author.id)
    return new Promise((resolve,reject)=>{
      let n = 0
      const embedder = (selectedArticle) => {
        let articleEmbed = new RichEmbed().setColor(settings.colors.embedDefault)
        .setAuthor(selectedArticle.data[n].title)
        .setFooter(`Page ${n+1} of ${selectedArticle.data.length}`)

        if ((!selectedArticle.sfw)&&(!msg.channel.nsfw)){
          articleEmbed.setDescription(`This is a NSFW article, please move to NSFW channel to view this post.`)
        } else {
          articleEmbed.setDescription(selectedArticle.data[n].description)
          .setImage(selectedArticle.data[n].imageURL)
        }
        return articleEmbed
      }
      if (((!selectedArticle.sfw)&&(!msg.channel.nsfw))){
        current.delete(message.author.id)
        return resolve(msg.edit(embedder(selectedArticle)).then(msgs=>msgs.clearReactions()).catch())
      } else {
        msg.edit(embedder(selectedArticle)).then(async(interactiveMessage)=>{
          await interactiveMessage.clearReactions()
          const reactioncollector = await interactiveMessage.createReactionCollector((reaction, user) => user.id === message.author.id)
          let reactions = ['◀', '▶', '❌'];
          for (let i = 0; i < reactions.length; i++) await interactiveMessage.react(reactions[i]);

          let timeOut = setTimeout(()=>{
            return reactioncollector.stop('timeout');
          },120000)

          reactioncollector.on('collect',async(r)=>{
            if (r.emoji.name === '◀') {
                if (!(n<1)){
                  clearTimeout(timeOut)
                  n--;
                  await interactiveMessage.edit(embedder(selectedArticle))
                }
              } else if (r.emoji.name === '▶'){
                if (n<(selectedArticle.data.length-1)){
                clearTimeout(timeOut)
                n++;
                await interactiveMessage.edit(embedder(selectedArticle))
              }
            } else if (r.emoji.name === "❌"){
                reactioncollector.stop('terminated')
              }
                await r.remove(message.author.id);
            })

          reactioncollector.on('end', async (collected,reason)=>{
              current.delete(message.author.id)
              interactiveMessage.clearReactions()
              if (reason==='timeout'){
                return resolve(interactiveMessage.edit(`Article reading Timed-out!`))
              } else if (reason==='terminated') {
                return resolve(interactiveMessage.edit(`Article reading ended!`))
              }
          })
        })
      }
    })
  })
})

}

module.exports.help = {
  name: "read",
  aliases: [],
	group: 'utility',
	description: 'Read some anime articles.',
	examples: ['read zombie'],
	parameters: ['tag, query']
}
