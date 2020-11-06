const { TextHelpers: { textTrunctuate }, MongooseModels: { guildInviteSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setinvite',
  aliases: ['setinv','addinv'],
  guildOnly: true,
  permissions: ['MANAGE_GUILD'],
  group: 'setup',
  description: 'Set an invite link + description for your server to be advertised whenever the command `invite` is used.',
  examples: ['setinv https://discord.gg/maisakurajima Do you want to have fu....', 'setinv remove'],
  parameters: ['Invite Link', 'Server Description (Max 1000 char)', 'remove flag'],
  run: async ( client, message, [ inviteLink, ...description]) => {

    if (!inviteLink)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, please supply the invite url or use \`remove\` to remove already existing invite.`)

    if (!description.length && inviteLink.startsWith('https://discord.gg/'))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, You need to supply the description of your guild.`)

    if (!description.length && inviteLink.toLowerCase() !== 'remove')
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, You supplied an invalid discord invite url. Please supply a valid invite url + description or use \`remove\` to remove already existing invite.`)

    let invite = await guildInviteSchema
                  .findOne({ guildID: message.guild.id })
                    .catch((err) => err)

    if (!invite)
      invite = await new guildInviteSchema({
        guildID: message.guild.id
      }).save()
          .catch(err => err)

    if (invite instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
        + '\u2000\u2000\n\n\u200b'
      )
    )

    if (inviteLink.toLowerCase() === 'remove') {

      if (!invite || !invite.invite.description) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, This server has no set-up invite to be removed.`)

      invite.invite = {
        description: null,
        link: null
      }

      return invite.save()
        .then(()=> message.channel.send(`${message.author}, This server's invite has successfully been **removed**.`))
          .catch(()=> message.channel.send(`<:cancel:767062250279927818> | ${message.author}, unable to remove the invite link.`))
    }

    if (!invite) invite = await new guildInviteSchema({ guildID: message.guild.id }).save()

    const truebefore = !!invite.invite.description

    const verified = await client.fetchInvite(inviteLink)
                              .then(()=> true)
                                .catch(()=> null)

    if (!verified) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, You supplied an invalid discord invite url. Please supply a valid invite url + description or use \`remove\` to remove already existing invite.`)

    invite.invite = {
      description: textTrunctuate(description.join(' '),1000),
      link: inviteLink
    }

    return invite.save()
      .then(()=> message.channel.send(`${message.author}, successfully **${truebefore ? 'replaced' : 'set'}** the invite url and description. It will now (randomly) apppear on my invite command.`))
        .catch(()=> message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Failed to save the discord invite url. Please try again later.`))

  }
}
