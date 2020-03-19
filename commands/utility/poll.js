const {RichEmbed} = require('discord.js');
const settings = require('./../../botconfig.json');

module.exports.run = (bot, message, args) => {
  const pollChannel = message.guild.channels.find(c => c.name === `poll`)
  if (!pollChannel) return message.channel.send(`ERROR: No poll channel detected. Create one with the name ${"`poll`"}.`)
  if (args.length<1) return message.channel.send(`ERROR: No parameters included. Please add the question and the choices.`)
  const paramParser = async (args) => {
  return new Promise((resolve,reject)=>  {
      let question;
      let choices = []
      let error;
      let choice = args.join(' ').split('#').slice(1)
      if (choice.length<1)  error = `No Choices Detected! Make sure to include choices. Mark each choice with (#)`
      if (choice.length<3)  error = `Please include at least 2 choices!`
      if (choice.length>10)  error = `Poll only accepts a maximumm of 10 choices at the moment.`
      question = args.join(' ').replace('#'+(choice.join('#')),"")
      for (let i = 0;i<choice.length;i++){
        if (choice[i]!==' ') {
        choices.push(choice[i])
        }
      }
      resolve(result = {
        question: (!error) ? question: null,
        choices: (!error) ? choices : null,
        error: error
        })
      })

  }

  paramParser(args).then(result=>{
    if (result.error===undefined){
      const emojilist = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];
      const cancelEmoji = '❌';
      var timer = 300000;
      var o;
      var selection = '';
      for (o = 0; o < result.choices.length; o++){
        selection += emojilist[o]+": `"+result.choices[o]+"`\n\n";
      }
      const poll = new RichEmbed()
      .setAuthor(`${result.question}`)
      .setColor(settings.colors.embedDefault)
      .setDescription(`*React on the corresponding emoji to vote*.\n*Poll ends in **${timer / 1000 / 60} minutes***.\n***${message.member.displayName}** may force-end this poll anytime by reacting with ${cancelEmoji}*.\n\n${selection}`)
      .setFooter(`Asked by: ${message.author.username}`)
        pollChannel.send(poll).then(async (msg) =>{
          const collector = await msg.createReactionCollector((reaction,user) => (emojilist.includes(reaction.emoji.name) || cancelEmoji.includes(reaction.emoji.name)));
          for (let i = 0; i < result.choices.length; i++) await msg.react(emojilist[i]);
          msg.react(cancelEmoji)

          let timeout = setTimeout(function() {
              return collector.stop('timeout');
          }, timer)

          collector.on('collect', async (r,user) => {

            if ((r.emoji.name === "❌") && (r.users.last().id === message.author.id)) {
                return collector.stop(`cancelled`)
            }
          })

          collector.on('end',async (collected,reason) =>{
          if(msg.deleted) message.channel.send(`The poll has been deleted. Results has been nullified`)
          var results = '';
          for (let y=0; y<result.choices.length;y++){
            results += collected.find(m => m.emoji.name === emojilist[y]).count-1+" users voted for "+"`"+result.choices[y]+"`\n\n";
          }
          const embed = new RichEmbed()
          .setAuthor(`Poll Result - ${result.question}`)
          .setColor(settings.colors.embedDefault)
          .setDescription(results);
          if(reason==='cancelled'){
            msg.edit(`**${message.member.displayName}** terminated the poll. Here are the results!`,embed).then(msg=>msg.clearReactions())
          } else {
            msg.edit(`Results are up!`,embed).then(msg=>msg.clearReactions())
          }
        })
      })
    } else return message.channel.send(`ERROR: ${result.error}`)
  })
  // .catch((err)=>{
  //   console.log(err)
  //   return message.channel.send(`ERROR: A problem occured during the creation of the POLL.`)
  // })

}


module.exports.help = {
  name: "poll",
  aliases: ["survey"],
	group: 'utility',
	description: 'Start a quick poll that ends in 5 minutes.',
	examples: ['poll What is the best anime of 2018? #Darling in the franxx #Seishun Buta Yarou #Boarding School Juliet','poll are you contented with the server\'s activity? #yes #no'],
	parameters: ['question','choices not less than 2']
  }
