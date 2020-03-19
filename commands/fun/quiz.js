const settings = require('./../../botconfig.json');
const {addGamesJoined, addGamesStarted, addGamesWon, addGamesSurrendered} = require('./../../utils/quiztool/profileFunctions.js')
const activity = new Set();
const {RichEmbed} = require('discord.js')
const version = '0.1.2'

module.exports.run = (bot, message, args) => {

  if(isActiveonThisChannel(message)) return message.channel.send(`Error: Cannot start multiple instances of Quiz.`)
  const clientPerm = message.channel.permissionsFor(message.client.user)
  if (!clientPerm.has('MANAGE_ROLES','MANAGE_MESSAGES','MANAGE_MESSAGES','MANAGE_WEBHOOKS')) return message.react('👎').then(()=>message.channel.send(`Im missing some permissions, make sure I have the proper permissions!`)).catch(console.error)

  parse(args).then(arginfo => {
    const collectPlayers = new RichEmbed().setAuthor(`Quiz Beta ${version}`).setDescription(`**Instructions**\nAnswer the following questions properly.\nFirst to reach 5 points wins.\n\n**Additional Commands**\n\`skip\` - vote to skip the current question. Skips when votes reach certain number.\n\`quit\` - Leave the current quiz session. Automatically results in a loss.\n\`score\` - Display all current scores of the players who joined.\n\n**Chosen Category**\n${arginfo.icr ? 'Random':arginfo.category}\n\n**Chosen Difficulty**\n${arginfo.idr ? 'Random' : arginfo.difficulty}`).setFooter(`React ✔️ to join.`).setColor(settings.colors.embedDefault)

    players = [{user:message.author.name,id:message.author.id,score:0,started:true}]

    message.channel.send(collectPlayers).then( async msg => {
      msg.react('✔️')
      const collector = msg.createReactionCollector((reaction,user) => reaction.emoji.name === '✔️' && !user.bot)
      setTimeout(()=>{collector.stop('timeout')},30000) //reset this
      collector.on('collect', async (r) => {
        if (!players.find(m=>m.id===r.users.last().id)) {
          players.push({user:r.users.last().username,id:r.users.last().id,score:0,started:false})
        }
        await r.remove(r.users.last().id)
      })
      collector.on('end',(collected,reason)=>{
        if (!msg.deleted){
          msg.delete()
        }
        if (collected.first()===undefined){
          removeActivity(message)
          return message.channel.send(`❌ No users attempted to join the quiz session. Quiz Session Cancelled`)
        }
        if (players.length<4){
          removeActivity(message)
          return message.channel.send(`❌ Not enough users joined the session before session start. (Need ${4-players.length} players more! Quiz Session Cancelled)`)
        }
        const joins = players.filter(m=>m.started===false)
        joins.forEach( async player => {addGamesJoined(message,player)})
        addGamesStarted(message,players.find(m=>m.started===true))

        let incrementor = 0
        let noresponse = 0
        let skipcount = []

        const quiz = async args => {
          parse(args).then(parsed => {

            incrementor++

            let question = require(`./../../assets/quiz/${parsed.category}/${parsed.difficulty}.json`)
            let current = question.data[Math.floor(Math.random()*(question.data.length-1))]
            const embed = new RichEmbed().setAuthor(`Question #${incrementor}. ${current.category} | ${current.difficulty}`).setColor(settings.colors.embedDefault).addField("Question",current.question).setFooter(`⏳ Time alloted: ${current.time/1000} seconds. | This Question is submitted by: ${current.createdBy}`)
            if (current.isMultipleChoice){
              embed.addField(`Choices`,`\`${current.choices.join('`\n`')}\``)
            }
            if (current.hasImageURL){
              embed.setImage(current.imageURL)
            }
            message.channel.send(embed).then(async embedded =>{
              const scanner = await embedded.channel.createMessageCollector(response => (!response.author.bot))
              const timer = await setTimeout(()=>{scanner.stop('timeout')},current.time)

                scanner.on('collect', m => {
                if (!players.find(i => i.id === m.channel.messages.last().author.id)) return

                noresponse = 0
                if (current.correctAnswer.includes(m.content.toLowerCase())){
                  let player = players.find(i=>i.id===m.channel.messages.last().author.id)
                  player.score = player.score + 1
                  if (player.score > 4) {
                    let pointsToAdd = Math.floor(Math.random()*10)+35;
                    let pointsToSubtract = Math.floor(Math.random()*5)+5;
                    addGamesWon(message,player,pointsToAdd).then(()=>{
                      lostPlayer = players.filter(i=>i.id!==player.id)
                      lostPlayer.forEach(async p => {addGamesLost(message,p,pointsToSubtract)})
                      })
                      scanner.stop('finsihed')
                      return message.channel.send(`🏆 **${player.user}** won this quiz session, earning **${pointsToAdd}** points! Congratulations!`)
                  } else scanner.stop('answered')
                  return message.channel.send(`**${m.channel.messages.last().author}** got the correct answer! Next Question coming up!`)
                } else if (m.content.toLowerCase() === 'skip'){
                  if (!skipcount.includes(m.channel.messages.last().author.id)){
                    skipcount.push(m.channel.messages.last().author.id)
                    if (skipcount.length>Math.ceil(players.length/2)){
                      scanner.stop('skipped')
                      return message.channel.send(`**${m.channel.messages.last().author.tag}** has voted to skip the question. Quorum reached, skipping...`)
                    } else message.channel.send(`**${m.channel.messages.last().author.tag}** has voted to skip the question. ${(Math.ceil(players.length/2)+1)-skipcount.length} votes left to skip.`)
                  }
                } else if (m.content.toLowerCase() === 'score'){
                  let embed = new RichEmbed()
                  .setColor(settings.colors.embedDefault)
                  .setAuthor(`Current Quiz Session Scores 🏆`)
                  .setTimestamp()
                  players.sort(function(a,b){
                    return (b.score-a.score)
                  })
                  let name = ''
                  let scores = ''
                  const length = (players.length<11) ? players.length : 10;
                  for (let x=0;x<length;x++){
                      name += `#${x+1} - **`+players[x].user+"**\n\n"
                      scores += "**"+players[x].score+"**\n\n"
                    }
                  embed.addField(`Player`,textTruncate(name),true).addField(`Score`,scores,true)
                  message.channel.send(embed)
                } else if (m.content.toLowerCase() === 'quit'){
                  let p = m.channel.messages.filter(i=>i.content === "quit").last()
                  players.splice(players.indexOf(players.find(i => i.id===p.author.id)),1)
                  let pointsToSubtract = Math.floor(Math.random()*5)+10;
                  message.channel.send(`**${p.member.displayName}** has left the game! Lost ${pointsToSubtract} points!`)
                  .then(()=>{
                  addGamesSurrendered(message,{id:p.author.id},pointsToSubtract)
                  if (players.length<2){
                    let pointsToAdd = Math.floor(Math.random()*10)+35;
                    addGamesWon(message,players[0],pointsToAdd)
                    message.channel.send(`Not Enough Players left\n\n🏆 **${players[0].user}** won this quiz session, earning **${pointsToAdd}** points! Congratulations!`)
                    scanner.stop('finsihed')
                  }
                  })
                }
              })
              scanner.on('end',(c,reas)=>{
                skipcount = []
                if (c.size<1){
                  noresponse++
                  message.channel.send(`Seems like nobody attempted to answer the quiz. Moving on...`)
                  if (noresponse>9){
                    removeActivity(message)
                    return message.channel.send(`Terminating quiz, I'm not recieveing any more answers.\n\nAll users that has joined the quiz will recieve a loss penalty.`)
                  }
                  setTimeout(()=>{quiz(args)},5000)
                } else if (reas==='finsihed'){
                  clearTimeout(timer)
                  return removeActivity(message)
                } else if (reas==='answered'){
                  clearTimeout(timer)
                  setTimeout(()=>{quiz(args)},5000)
                } else if (reas === 'skipped'){
                  clearTimeout(timer)
                  setTimeout(()=>{quiz(args)},5000)
                } else if (reas === 'timeout'){
                  clearTimeout(timer)
                  setTimeout(()=>{quiz(args)},5000)
                  message.channel.send(`Seems like nobody got the answer. Moving on...`)
                }
              })
            })
          })
        }

        try {
          quiz(args)
        } catch (err){
          return message.channel.send(err)
        }
      })
    })
  })
}



module.exports.help = {
  name: "quiz",
  aliases: ['trivia', 'quiz', 'q'],
	group: 'fun',
	description: 'Start a quiz session. Won\'t start\nunless specific number of players join.\nType `?quiz categories` to find the\navailable category the quiz can offer.',
	examples: ['quiz emoji easy','quiz anime hard'],
	parameters: ['category','difficulty']
}

function isActiveonThisChannel(message){
    if (activity.has(message.channel.id)){
      return true
    }
    activity.add(message.channel.id)
    return false
}//checks if the channel has active quiz session, returns boolean, answering the function name

function removeActivity(message){
    return (activity.delete(message.channel.id))
}//remove activity allowing new instance of quiz to be generated

function parse(args){
  return new Promise((resolve,reject)=>{
    const diffArray = ["easy", "medium"]
    const categArray = ["anime","emoji"]
    let diff = diffArray.filter(difficulty => args.includes(difficulty))
    let categ = categArray.filter(category => args.includes(category))
    let isDifficultyRandom = false
    let isCategoryRandom = false
    if (diff.length!==0){
      if (diff.legth>1){
      diff = diff[0]
    } else diff = diff.toString()
  } else {
    diff = diffArray[Math.floor(Math.random()*(diffArray.length-1))]
    isDifficultyRandom = true
  }
  if (categ.length!==0) {
    if (categ.length>1){
      categ = categ[0]
    }else categ = categ.toString()
  } else {
    categ = categArray[Math.floor(Math.random()*(categArray.length-1))]
    isCategoryRandom = true
  }
    let parsedInfo = {
      category: categ,
      difficulty : diff,
      idr: isDifficultyRandom,
      icr: isCategoryRandom
    }
   resolve(parsedInfo)
  })
}

function textTruncate(str,length,ending){
  if (length == null) {
      length = 20;
  }
  if (ending == null) {
      ending = '...';
  }
  if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
  } else {
      return str;
    }
}
