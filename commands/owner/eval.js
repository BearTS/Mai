const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { inspect } = require('util')

module.exports = {
  name: 'eval',
  aliases: [],
  ownerOnly: true,
  group: 'owner',
  description: 'Evaluates arbitrary Javascript',
  examples: ['eval 1+1'],
  parameters: ['jscode'],
  run: async ( client, message, args ) => {

    try {
      const code = args.join(' ')
      let evaled = eval(code)
      let raw = evaled

      if (typeof evaled !== 'string')
        evaled = inspect(evaled, {depth:0})

      const ret = clean(evaled).replace(client.config.token, 'PRIVATE_TOKEN')
      const MAX_CHARS = 3 + 2 + ret.length + 3

      let elapsed = Date.now() - message.createdTimestamp
      const result = new MessageEmbed()
                      .setColor('GREY')
                      .addField('\\📥 Input',`\`\`\`js\n${clean(code)}\`\`\``)
                      .setFooter(`Type: ${(typeof raw).substr(0, 1).toUpperCase() + (typeof raw).substr(1)} • Evaluated in ${elapsed}ms.`)

      if (MAX_CHARS > 1024) {
        const res = await fetch(`https://hastebin.com/documents`, {
          method: "POST",
          body: ret,
          headers: { "Content-Type": "text/plain" }
        });
        const url = await client.channels.cache.get(client.uploadchannel)
                            .send({ files: [{ attachment: Buffer.from(ret), name: "evaled.txt" }]})
                              .then((message)=> message.attachments.first().url)
                                .catch(()=>null)

        const paste = res.ok ? `https://hastebin.com/${await res.json().then((json)=> json.key)}.js` : null

        return message.channel.send( result.addField('\\📤 Output',`\`\`\`fix\nExceeded 1024 characters\nCharacter length: ${MAX_CHARS}\n\`\`\`\n[\`📄 View\`](${paste}) • [\`📩 Download\`](${url})`))
                                .catch(()=>null)
      }

      const msg = await message.channel.send( result.addField('\\📤 Output',`\`\`\`xl\n${ret}\`\`\``))
                              .catch(()=>null)

      if (!(raw instanceof Promise)) return null

      const promise = await raw
                              .then((res) => { return { status: 'ok', body: inspect(res, { depth:0 })}})
                                .catch((err) => { return { status: 'fail', body: inspect(err, {depth:0 })}})

      elapsed = Date.now() - message.createdTimestamp

      result.spliceFields(1,1,{ name: '\\📤 Output', value: `\`\`\`xl\nPromise { <${promise.status === 'ok' ? 'resolved' : 'rejected'}> }\n\`\`\``})
            .setFooter(`Type: Promise(${promise.status === 'ok' ? 'Fulfilled' : 'Rejected'}) • Evaluated in ${elapsed}ms.`)
            .setColor(promise.status === 'ok' ? 'GREY' : 'RED')

      if (promise.body.length + 8 > 1024){

        const res = await fetch(`https://hastebin.com/documents`, {
          method: "POST",
          body: promise.body.split(process.cwd()).join('MAIN_PROCESS'),
          headers: { "Content-Type": "text/plain" }
        });

        const url = await client.channels.cache.get(client.uploadchannel)
                            .send({ files: [{ attachment: Buffer.from(promise.body), name: "evaled.txt" }]})
                              .then((message)=> message.attachments.first().url)
                                .catch(()=>null)

        const paste = res.ok ? `https://hastebin.com/${await res.json().then((json)=> json.key)}.js` : null

        return await msg.edit(result.addField(`\\📤 Result`, `\`\`\`fix\nExceeded 1024 characters\nCharacter length: ${promise.body.length}\n\`\`\`\n[\`📄 View\`](${paste}) • [\`📩 Download\`](${url})`)).catch(()=>null) ? null : message.channel.send(result)

      }

      return await msg.edit(result.addField(`\\📤 Result`, `\`\`\`xl\n${promise.body.split(process.cwd()).join('MAIN_PROCESS')}\n\`\`\``)).catch(()=>null) ? null : message.channel.send(result)

    } catch (err) {
      message.channel.send( new MessageEmbed()
                              .setColor('RED')
                              .addField('\\📥 Input',`\`\`\`js\n${clean(args.join(' '))}\`\`\``)
                              .addField('\\📤 Output',`\`\`\`xl\n${err.stack.split('\n').splice(0,5).join('\n').split(process.cwd()).join('MAIN_PROCESS')}\n\n...and ${err.stack.split('\n').length - 5} lines more.\n\`\`\``)
                              .setFooter(`Type: ${err.name} • Evaluated in ${Date.now() - message.createdTimestamp}ms.`)
                          ).catch(()=>null)
    }
  }
}

function clean(text){
  if (typeof text === 'string')
     return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)

  return text;
}
