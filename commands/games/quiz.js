const { MessageEmbed } = require('discord.js')
const { collect, start, loadquestionnaire, save } = require('../../utils/quiz/phase1.js')
const { default: { prefix } } = require('../../settings.json')

module.exports = {
  config: {
    name: 'quiz',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'games',
    description: 'A fun anime quiz game for Discord',
    examples: [],
    parameters: []
  },
  run: async ( client, message, [ difficulty, maxscore ] ) => {

    let status = client.quiz.get(message.channel.id)

    if (status) return message.channel.send(error(`Quiz already in session!`))

    status = client.quiz.set(message.channel.id,{ channel: message.channel.id })

    let data = [{
      name: message.author.username,
      id: message.author.id,
      score: 0
    }]

    let quits = []
    let idlecount = 0

    const val_diff /*Valid difficulty*/ = ['easy', 'medium', 'hard']

    if (!difficulty || !val_diff.includes(difficulty.toLowerCase())) {

      difficulty = 'random'

    }

    if (!maxscore || isNaN(maxscore) || maxscore < 5 || maxscore > 20) {

      maxscore = 5

    }

    maxscore = Math.ceil(maxscore)

    const prompt = await message.channel.send( new MessageEmbed()
      .setColor('GREY')
      .setAuthor('Anime Quiz 2.0.1')
      .setDescription(`Answer each questions under the time given. First to reach ${maxscore} points will be declared the winner!`)
      .addField('Instructions',`
      ⭕ To vote to skip the current question, kindly type \`skip\`. This will toggle skip vote that will automatically skip the question if the vote reaches quorum.
      ⭕ To leave the session, just type \`quit\`, \`exit\` or \`surrender\`. After this, I will not accept your answers anymore and your game will be marked as surrendered.
      ⭕ Your progress is saved and can be viewed through \`${prefix}quizrank\` for individual progress and \`${prefix}quizleaderboard\` for score leaderboard in the server.
      `)
      .addField('\u200B',`**Difficulty**:\n${difficulty}`,true)
      .addField('\u200B',`**Category**:\nanime`,true)
      .addField('\u200B','React `✔️` to join')
      .setFooter('Requires 2 or more players to start. Removing reactions does not remove you from the game.')
    )

    prompt.react('✔️')

    let collector = prompt.createReactionCollector((reaction,user) => reaction.emoji.name === '✔️' && !user.bot && !data.some( p => p.id === user.id))

    data = await collect(data, collector)

    if (data.length < 2) {

      client.quiz.delete(message.channel.id)
    try {
        return prompt.edit(error(`Insuffecient Players`))
    } catch (err) {
        return message.channel.send(error(`Insuffecient Players`))
    }

    }

    //load all questionnaire

    const questionnaire = await loadquestionnaire(difficulty)

    //start quiz

    incrementor = 0

    const run = async () => {

      const { question, qData: { time, correctAnswer }, inc } = await start(questionnaire, message, loadquestionnaire, difficulty, incrementor)

      incrementor = inc

      const skippers = []

      const msg = await message.channel.send(question)

      const timeout = setTimeout(()=> collect.stop('TIMEOUT'), time)

      const collect = message.channel.createMessageCollector( message => !message.author.bot && data.some( p => p.id === message.author.id))

      collect.on('collect', ( { content, author: { id, tag } } ) => {

        idlecount = 0

        if (correctAnswer.includes(content.toLowerCase())) {

        clearTimeout(timeout)

        const player = data.find( d => d.id === id)

        player.score++

        if (player.score === maxscore) return collect.stop('MAXSCORE_REACHED')

        return collect.stop('RECEIVED_CORRECT_ANSWER')

      } else if (content.toLowerCase() === 'skip') {

        if (skippers.includes(id)) return

        skippers.push(id)

        const quota = Math.floor(data.length / 2)

        if (skippers.length < quota) return message.channel.send(`**${tag}** has voted to skip the question. ${quota - skippers} votes more to skip!`)

        return collect.stop('SKIPPED')

      } else if (['quit', 'surrender', 'exit'].includes(content.toLowerCase())) {

        message.channel.send(`**${tag}** has left the session`)

        data.splice(data.indexOf(data.find(p => p.id === id)), 1)

        quits.push(id)

        if (data.length === 1) return collect.stop('NO_PLAYERS_LEFT')

        }

      })

      collect.on('end', async ( messages, reason ) => {

        if (!messages.size) idlecount++

        switch(reason){
          case 'TIMEOUT':
            if (idlecount === 10) {

              client.quiz.delete(message.channel.id)
              return message.channel.send(error(`Quiz session will be terminated. I didn't received any input for the last 10 questions. This session will not be recoreded.`))

            }
            message.channel.send(`Nobody got the correct answer! Generating another question...`)

            setTimeout(() => run(), 5000)

          break
          case 'RECEIVED_CORRECT_ANSWER':

            const { score } = data.find(c => c.id === messages.last().author.id)

            message.channel.send(`**${messages.last().member.displayName}** got the correct answer! Current Points **${score}/${maxscore}**.\n\nGenerating another question...`)

            setTimeout(() => run(), 5000)

          break
          case 'SKIPPED':

            message.channel.send(`Skipping the question...`)

            setTimeout(() => run(), 5000)

          break
          case 'NO_PLAYERS_LEFT':

            client.quiz.delete(message.channel.id)
            points_earned = Math.floor(Math.random() * 15) + (parseInt(maxscore) * 2) + (10 * data.length + quits.length)
            points_lost = Math.floor( 0.3 * (Math.random() * 15) + (parseInt(maxscore) * 2))
            message.channel.send(`No more players left: **${data[0].name}** won this session! ${data[0].name} earned **${points_earned}** points. Losers will have their points reduced by **${points_lost}**`)
            await save(data, quits, data[0], points_earned, points_lost, message)

          break
          case 'MAXSCORE_REACHED':

            client.quiz.delete(message.channel.id)
            points_earned = Math.floor(Math.random() * 15) + (parseInt(maxscore) * 2) + (10 * data.length + quits.length)
            points_lost = Math.floor( 0.3 * (Math.random() * 15) + (parseInt(maxscore) * 2))
            message.channel.send(`**${data[0].name}** won this session! ${data[0].name} earned **${points_earned}** points. Losers will have their points reduced by **${points_lost}**`)
            await save(data, quits, data[0], points_earned, points_lost, message)

          break
        }
      })

    }

    try {
      run ()
    } catch (err) {
      return console.log('An unexpected error occured\n' + err)
    }
}
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
