const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const actions = require('./../../assets/json/actions.json')


module.exports.run = async (bot, message, args) => {


detectUserfromArgs(message).then(mentions => {


	let embed = new RichEmbed().setColor(settings.colors.embedDefault)
					.setImage(`https://i.imgur.com/${actions.hug[Math.floor(Math.random()*(actions.hug.length-1))]}.gif`)

		if (mentions.length<1){
			embed.setDescription(`You can't hug yourself, let me hug you instead, ${message.member}!`)
			return message.channel.send(embed)
		} else if (mentions.includes(`**me**`)){
			embed.setDescription(`${message.member} hugs ${stringifyMentions(mentions)}!`)
			return message.channel.send(embed).then(()=>{
				 message.channel.send(`ల(\*´= ◡ =｀\*) Such a warm hug..thank you~~ Nyaa~~`)
			})
		} else {
			embed.setDescription(`${message.member} hugs ${stringifyMentions(mentions)}!`)
			return message.channel.send(embed)
		}
})

}

module.exports.help = {
    	name: "hug",
			aliases: ["cuddle"],
			group: 'action',
			description: 'Hugs the user/s you mentioned!',
			examples: ['cuddle @MaiSakurajima MaiSakurajima','hug MaiSakurajima','hug @MaiSakurajima'],
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
