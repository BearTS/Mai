const { MessageEmbed } = require('discord.js')

module.exports = (client, error, message, command) => {

  if (!client.config.debug) return

  const debugchannel = client.channels.cache.get(client.config.debug)

  const timezone = 9 //+ 9 UTC is JPT

  const offset = ( new Date().getTimezoneOffset() - (-timezone * 60)) * 60000

  if (!debugchannel) return console.log(bug)

  if (message){

    let path = error.stack.split('\n').find(e => e.match(/\s+at\s+module.exports\s+\([\s\S]+\)/))

    let [dir, line, col ] = path ? path.replace(process.cwd(),'').replace(/\(|\)/g,'').split(/\s+at\s+module.exports\s/)[1].split(':') : [null,null,null]

    return debugchannel.send(
      new MessageEmbed()
      .setColor('RED')
      .setTitle('🛠️ Oh! A bug that needs fixing!')
      .addField('Executor', message.author.tag, true)
      .addField('From', message.guild.name + ' server.',true)
      .addField('Date', `\`${parseDate(new Date(Date.now() + offset).toLocaleString('ja-JP',{ timezone: 'Asia/Tokyo'}).split(/:|\s|\//))}\``, true)
      .addField('Error Type', error.name, true)
      .addField('Error Message', error.message, true)
      .addField('Command Used', command ? `\`${client.config.prefix}${command}\`` : 'Unknown', true)
      .addField('Stack Trace',`\`\`\`xl\n${error.stack.split('\n').splice(0,5).join('\n').split(process.cwd()).join('MAIN_PROCESS')}\n\n${error.stack.split('\n').length > 5 ? `...and ${error.stack.split('\n').length - 5} lines more.` : ''}\n\`\`\``)
      .addField('\u200b', dir && line && col ? `View which line went wrong directly on [Github](https://github.com/maisans-maid/Mai/tree/master${dir.replace('\\','/')}#L${line}).`: '\u200b', true)
      .addField('\u200b', dir && line && col ? `File in question:\u2000\`root${dir}\`\nLine:\u2000${line}\nColumn:\u2000${col}` : '\u200b', true)
      .setFooter(`Bug Reporter | ©️${new Date().getFullYear()} Mai`)
    )

  }

  debugchannel.send(
    new MessageEmbed()
    .setColor('RED')
    .setTitle('🛠️ Oh! A bug that needs fixing!')
    .addField('Date', `\`${parseDate(new Date(Date.now() + offset).toLocaleString('ja-JP',{ timezone: 'Asia/Tokyo'}).split(/:|\s|\//))}\``)
    .addField('Error type', error.name, true)
    .addField('Error Message', error.message, true)
    .addField('Stack Trace', `\`\`\`xl\n${error.stack.split('\n').splice(0,5).join('\n').split(process.cwd()).join('MAIN_PROCESS')}\n\n${error.stack.split('\n').length > 5 ? `...and ${error.stack.split('\n').length - 5} lines more.` : ''}\n\`\`\``)
    .setFooter(`Bug Reporter | ©️${new Date().getFullYear()} Mai`)
  )

}

function parseDate([m, d, y, h, min, s, a]){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const weeks = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return `${weeks[new Date( parseInt(y), m - 1, d ).getDay()]} ${months[m - 1]} ${d} ${parseInt(y)} ${h == 0 ? 12 : h > 12 ? h - 12 : h }:${min}:${s} ${a ? a : h < 12 ? 'AM' : 'PM'} JST`
}
