//types includes owo,rem,cute,lick,
const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const actions = require('./../../assets/json/actions.json')
const fetch = require('node-fetch')
const baseURI = 'https://rra.ram.moe/i/r?type=lewd'
const uri = 'https://rra.ram.moe'

module.exports.run = (bot,message,args) => {

  detectUserfromArgs(message).then(mentions => {

  	let embed = new RichEmbed().setColor(settings.colors.embedDefault)
    fetch(baseURI).then(res=>res.json()).then(json => {
          embed.setImage(uri+json.path)
          if (mentions.length<1){
      			embed.setDescription(`${message.member} licks on... himself?!`)
            .setImage(`https://i.imgur.com/${actions.disgust[Math.floor(Math.random()*(actions.disgust.length-1))]}.gif`)
      			return message.channel.send(embed)
      		}  else if (mentions.includes(`**me**`)){
        embed.setDescription(`${message.member} licks ${stringifyMentions(mentions)}`)
        return message.channel.send(embed).then(()=>{
           message.channel.send(`Nyaa..♡(｡￫ˇ艸￩) where are you...licking me...`)
        })
      } else {
        embed.setDescription(`${message.member} licks ${stringifyMentions(mentions)}`)
        return message.channel.send(embed)
      }
    })
  })
}

module.exports.help = {
  name: "lick",
  alias: [],
  group: 'action',
  description: 'Licks the user you mentioned!',
  examples: ['lick @MaiSakurajima MaiSakurajima','lick MaiSakurajima','lick @MaiSakurajima'],
  parameters: ['mention', 'name']
}

function stringifyMentions(output){
	if (output.length === 2){
		output = output.join(' and ')
	} else if (output.length > 2 ){
		let last = output.pop()
		output = output.join(', ')+", and "+last
	}
	return (output)
}

function detectUserfromArgs(message){
return new Promise((resolve,reject)=>{
	let members = []
	let output = []

//detect the mentions
	if (message.mentions.members.size>0){
		message.mentions.members.forEach(member => {
			if (!members.includes(member)){
			members.push(member)
			}
		})
	}

	args = []
	arg1 = message.content.split(/ +/)
	arg2 = message.cleanContent.split(/ +/)
	arg1.forEach(content => {
		if (arg2.includes(content)){
			args.push(content)
		}
	})

	//detect the names
	args.forEach(word => {
		let found = message.guild.members.find(m=> (m.displayName.toLowerCase() === word.toLowerCase()) || (m.user.username.toLowerCase() === word.toLowerCase()))
		if (found){
			if (!members.includes(found)){
				members.push(found)
			}
		}
	})

	//extract the id
	members.forEach(member=>{
		if (member.id === message.member.id){
		 return
		} else if (member.id === message.client.user.id) {
			output.push('**me**')
		} else
		output.push(`<@${member.id}>`)
	})

	resolve(output)
})
}
