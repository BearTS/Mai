const { MessageEmbed, Collection } = require('discord.js')
const { Quiz: { collectPlayers, loadQuestions, sendQuestion }} = require(`${process.cwd()}/helper`)


module.exports = {
  name: 'quiz',
  aliases: [],
  guildOnly: true,
  group: 'games',
  description: 'A fun anime quiz game for Discord',
  examples: [],
  parameters: [],
  run: async ( client, message, [ difficulty, maxscore ]) => {

    if (client.collections.exists('quiz', message.channel.id))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, An existing quiz session is active on this channel!`)

    client.collections.setTo('quiz', message.channel.id, {})

    let data = [{
      name: message.author.tag,
      id: message.author.id,
      score: 0
    }]

    let quits = []
    let idlecount = 0
    let questionNumber = 1

    const emoji = client.emojis.cache.get('720912993155809350')

    difficulty = difficulty && ['easy','medium','hard'].includes(difficulty.toLowerCase()) ? difficulty : 'random'
    maxscore = maxscore && !isNaN(maxscore) && maxscore > 4 && maxscore < 21 ? Math.ceil(maxscore) : 5

    const prompt = await message.channel.send( new MessageEmbed()
      .setColor('GREY')
      .setAuthor('Anime Quiz 2.0.1')
      .setDescription(`Answer each questions under the time given. First to reach ${maxscore} points will be declared the winner!`)
      .addField('Instructions',`
      \\⭕ To vote to skip the current question, kindly type \`skip\`. This will toggle skip vote that will automatically skip the question if the vote reaches quorum.
      \\⭕ To leave the session, just type \`quit\`, \`exit\` or \`surrender\`. After this, I will not accept your answers anymore and your game will be marked as surrendered.
      \\⭕ Your progress is saved and can be viewed through \`${client.config.prefix}quizrank\` for individual progress and \`${client.config.prefix}quizleaderboard\` for score leaderboard in the server.
      `)
      .addField('\u200B',`**Difficulty**:\n${difficulty}`,true)
      .addField('\u200B',`**Category**:\nanime`,true)
      .addField('\u200B',`React ${emoji} to join`)
      .setFooter('Requires 2 or more players to start. Removing reactions does not remove you from the game.')
    )

    prompt.react(emoji)

    data = await collectPlayers(data, prompt.createReactionCollector((reaction, user) => reaction.emoji.id === '720912993155809350' && !user.bot ))

    if (data.length < 2) {
      client.collections.deleteIn('quiz', message.channel.id)
      return await prompt.edit( new MessageEmbed().setColor('RED').setDescription(`\u200b\n\u2000\u2000<:cancel:712586986216489011> | Unable to start quiz - Insuffecient Players.\n\u200b`)).catch(()=>null) ? null : await message.channel.send(new MessageEmbed().setColor('RED').setDescription(`\u200b\n\u2000\u2000<:cancel:712586986216489011> | Unable to start quiz - Insuffecient Players.\n\u200b`)).then(()=>null)
    }

    let questions = loadQuestions(difficulty)

    const run = async () => {

      if (!questions.length) questions = loadQuestions(difficulty)
      const skippers = []
      const [{ time, correctAnswer }, qn] = await sendQuestion({questions, questionNumber, message})
      questionNumber = qn

      const collector = message.channel.createMessageCollector( message => !message.author.bot && data.some( p => p.id === message.author.id))
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), time)

      collector.on('collect', message => {
        idlecount = 0

      })


    }

    setInterval(()=> run() , 5000)

  }
}
