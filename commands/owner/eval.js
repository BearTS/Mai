module.exports.run = (client ,message,args) => {

  try {
      const code = clean(message.content).split(/ +/).slice(1).join(' ');
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, {depth:0});
        message.channel.send(loglength(`Logging output:\n\`\`\`xl\n${evaled}\`\`\``));
    } catch (err) {
      message.channel.send(`Error: \`\`\`xl\n${err}\n\`\`\``);
    }
}

module.exports.config = {
  name: "eval",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "owner",
  description: "Evaluate JS code",
  examples: [`eval 1+1`],
  parameters: ["jscode"],
  ownerOnly: true
}


function clean(text) {
			if (typeof text === 'string') {
				text = text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
			}

			return text;
		}

function loglength(text){
  if (typeof text !== 'string') return (`Error: \`\`\`xl\nThe output of the code is in invalid format.\n\`\`\``)
  if (text.length>2000) return (`Error:\`\`\`xl\nDiscordAPIError: Invalid Form Body\ncontent: Must be 2000 or fewer in length.\n\`\`\``)
  if (text.length<1) return (`Error:\`\`\`xl\nDiscordAPIError: Cannot send an empty message.\n\`\`\``)
  return text
}
