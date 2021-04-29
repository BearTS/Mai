const { MessageEmbed } = require('discord.js');
const { inspect      } = require('util');

const fetch = require('node-fetch');

module.exports = {
  name            : 'eval',
  aliases         : [],
  ownerOnly       : true,
  group           : 'owner',
  requiresDatabase: false,
  rankcommand     : false,
  description     : 'Evaluate arbitrary Javascript.',
  parameters      : [ 'Javascript Code' ],
  examples        : [ 'eval 1+1' ],
  run             : async (message, language, args) => {
    const { STRING, ARRAY } = message.client.services.UTIL;
    const code = args.join(' ').split(/[\`]+[\w]*/).join('').trim();
    try {
      let promise, output, bin, download, type, color;
      let evaled = eval(code);
      let raw    = evaled;
      if (evaled instanceof Promise){
        message.channel.startTyping();
        promise = await evaled
        .then(res => { return { resolved: true, body: inspect(res, { depth: 0 })};})
        .catch(err => { return { rejected: true, body: inspect(err, { depth: 0 })};});
      };
      if (typeof evaled !== 'string'){
        evaled = inspect(evaled, { depth: 0 });
      };
      if (promise){
        output = STRING.clean(promise.body)
      } else {
        output = STRING.clean(evaled)
      };
      if (promise?.resolved){
        color = 'GREEN'
        type = 'Promise (Resolved)'
      } else if (promise?.rejected){
        color = 'RED'
        type = 'Promise (Rejected)'
      } else {
        color = 0xe620a4
        type = (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1)
      };
      const elapsed    = Math.abs(Date.now() - message.createdTimestamp);
      const embed      = new MessageEmbed().setColor(color)
      .addField('\\📥 Input',`\`\`\`js\n${STRING.truncate(STRING.clean(code),1000)}\`\`\``)
      .setFooter(`Type: ${type}\u2000•\u2000Evaluated in ${(elapsed / 1000).toFixed(2)}s.`);
      if (output.length > 1000){
        const headers = { 'Content-Type': 'text/plain' };
        const options = { method: 'POST', body: output, headers };
        const hastebn = await fetch('https://hastebin.com/documents', options)
        if (hastebn.status === 200){
          const { key } = await hastebn.json();
          const channel = await message.client.channels.fetch(message.client.channels.uploadch).catch(err => err);
                bin     = `https://hastebin.com/${key}.js`;
          if (channel){
            download = await channel.send({ files: [{ attachment: Buffer.from(output), name: 'evaled.txt' }]})
            .then(message => download = message.attachments.first().url)
            .catch(() => {});
          };
        };
      };
      message.channel.stopTyping();
      const field1 = output.length > 1000 ? `\`\`\`fix\nExceeded 1000 characters\nCharacter Length: ${output.length}\`\`\`` : `\`\`\`js\n${output}\n\`\`\``;
      const field2 = `${bin ? `[\`📄 View\`](${bin})` : '\u200b'} • ${download ? `[\`📩 Download\`](${download})` : '\u200b'}`;
      return message.channel.send(embed.addFields([{ name:'\\📤 Output', value: field1 },{ name: '\u200b', value: field2 }].splice(0, Number(output.length > 1000) + 1)));
    } catch (err) {
      const stacktrace = ARRAY.joinAndLimit(err.stack.split('\n'),900,'\n');
      const value = [
        '```xl',
        stacktrace.text.split(process.cwd()).join('root'),
        stacktrace.excess ? `\nand ${stacktrace.excess} lines more!` : '',
        '```'
      ].join('\n');
      message.channel.stopTyping();
      return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setFooter(`${err.name}\u2000•\u2000Evaluated in ${Math.abs((Date.now() - message.createdTimestamp) / 1000).toFixed(2)}s.`)
        .addFields([
          { name: '\\📥 Input', value: `\`\`\`js\n${STRING.truncate(STRING.clean(code),1000,'\n...')}\`\`\``  },
          { name: '\\📤 Output', value }
        ])
      );
    };
  }
};
