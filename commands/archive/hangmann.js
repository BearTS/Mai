const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');

module.exports.run = async (bot, message, args) => {
  const hangs = [
    `\`\`\`
/---|
|
|
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|   |
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|  /|
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|  /|\\
|
|
\`\`\`
`, `\`\`\`
/---|
|   o
|  /|\\
|  /
|
\`\`\`
`, `\`\`\`
/---|
|   o ~ GAME OVER!
|  /|\\
|  / \\
|
\`\`\`
`
  ]
  const messages = ['WATASHI GA MOTETE NO DOSUNDA']
  let status = 0
  let current = replaceWithBlanks(messages[status])
  let guessed = []



  let mainmessage = `${hangs[status]}\n\`\`\`${current.join(' ')}\`\`\`\n\`\`\`Bad Guesses:\n${guessed.join(' ')}\`\`\``
  message.channel.send(mainmessage).then(async msg => {
    const collector = await msg.channel.createMessageCollector(response => (!response.author.bot))
      collector.on('collect', m => {
        if (m.content.split('').length>1) return;
        if (guessed.includes(m.content.toUpperCase())) return;
        scanmessage(m.content.toLowerCase(),current,messages[0]).then(res => {
          if (!res.changed){
            status++
            guessed.push(m.content.toUpperCase())
            msg.channel.send(`${hangs[status]}\n\`\`\`${current.join(' ')}\`\`\`\n\`\`\`Bad Guesses:\n${guessed.join(' ')}\`\`\``)
            if (status===6) {
              collector.stop()
            }
            return;
          } else {
          current = res.after
          msg.channel.send(`${hangs[status]}\n\`\`\`${current.join(' ')}\`\`\`\n\`\`\`Bad Guesses:\n${guessed.join(' ')}\`\`\``)
          if (!current.includes('_')){
            message.channel.send(`Congratulations!!!`)
             collector.stop(' ')
           }
          return;
        }
      })
    })
  })
}

module.exports.help = {
  name: "hangman",
  aliases: [],
	group: 'games',
	description: 'start an instance of hangman',
	examples: ['hangman'],
	parameters: []
  }

function replaceWithBlanks(message){
  const letters = message.split('')
  const symbols = [' ', '?', '!', '-', '#', ':']
  let output = []
  letters.forEach(letter=>{
    if (!symbols.includes(letter)) letter = '_'
    output.push(letter)
  })
  return (output)
}

function scanmessage(letter,current,message){
  return new Promise((resolve,reject)=>{
    const letters = message.toLowerCase().split('')
    let indexes = []
    for (let i = 0; i < letters.length; i++){
      if (letters[i] === letter) indexes.push(i)
    }
    indexes.forEach(num => {
      current[num] = letter.toUpperCase()
    })

    let changed = (indexes.length===0) ? false : true
    resolve({
      changed: changed,
      after: current
    })
  })
}
