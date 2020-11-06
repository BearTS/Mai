const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setwelcomemsg',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the welcome message. Supports Embeds!',
  examples: ['[Learn how to set up your server greeter](https://mai-san.ml/)'],
  parameters: [],
  run: async (client, message, [stats, ...args]) => {

    if (!stats || !['default', 'msg=true', 'embed=true', 'msg=set', 'embed=set', 'test'].includes(stats))
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + `Please include the option parameter.
        \n[Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
      ).setColor('RED')
    )

    let data = await guildProfileSchema.findOne({guildID: message.guild.id})
    let profile = client.guildsettings.get(message.guild.id)

    if (!data || data instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      ).setColor('RED')
    )

    //sets the welcome message to default
    if (stats === 'default'){
      data.welcomeUse = 'default'
      return data.save().then(data => {
        profile.welcome.use = data.welcomeUse
        return message.channel.send(
          new MessageEmbed().setDescription(
            '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
            + `Member Greeter Feature message has been successfully reverted to **default**!
            \nIncoming members will now be greeted by Mai's default greet message.
            To change the message, use \`${client.config.prefix}setwelcomemsg [options] [additional parameters]\`
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
          ).setColor('GREEN').setFooter('Member Greeter | ©️2020 Mai')
        ).catch(() =>
           message.channel.send(
            new MessageEmbed().setDescription(
              `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
            `).setColor('RED')
          )
        )
      })
    }

    if (stats === 'msg=true'){
      if (!data.welcomemsg)
      return message.channel.send(
        new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
          + `Unable to change the greet message to **text mode**!
          \nMake sure you have already set a greet message (plain text) before you run this command.
          To set  the message, use \`${client.config.prefix}setwelcomemsg msg=set [message content]\`
          [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
        ).setColor('RED')
      )

      data.welcomeUse = 'msg'
      return data.save().then(data => {
        profile.welcome.use = data.welcomeUse
        return message.channel.send(
          new MessageEmbed().setDescription(
            '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
            + `Member Greeter Feature message has been successfully changed to **text mode**!
            \nIncoming members will now be greeted by your guild's configured greet message.
            To change the message, use \`${client.config.prefix}setwelcomemsg [options] [additional parameters]\`
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
          ).setColor('GREEN').setFooter('Member Greeter | ©️2020 Mai')
        ).catch(() =>
           message.channel.send(
            new MessageEmbed().setDescription(
              `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
            `).setColor('RED')
          )
        )
      })
    }

    if (stats === 'embed=true'){
      if (!data.welcomeEmbed || isEmpty(data.welcomeEmbed))
      return message.channel.send(
        new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
          + `Unable to change the greet message to **embed mode**!
          \nMake sure you have already set a greet message (embed) before you run this command.
          To set the message, use \`${client.config.prefix}setwelcomemsg embed=set [embed details]\`
          [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
        ).setColor('RED')
      )

      data.welcomeUse = 'embed'
      return data.save().then(data => {
        profile.welcome.use = data.welcomeUse
        return message.channel.send(
          new MessageEmbed().setDescription(
            '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
            + `Member Greeter Feature message has been successfully changed to **embed mode**!
            \nIncoming members will now be greeted by your guild's configured greet message.
            To change the message, use \`${client.config.prefix}setwelcomemsg [options] [additional parameters]\`
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
          ).setColor('GREEN').setFooter('Member Greeter | ©️2020 Mai')
        ).catch(() =>
           message.channel.send(
            new MessageEmbed().setDescription(
              `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
            `).setColor('RED')
          )
        )
      })
    }

    if (stats === 'msg=set'){
      if (!args.length)
      return message.channel.send(
        new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
          + `Please enter a greeter message after the \`[options]\` parameter!
          \nYou can use modifiers too to use dynamic information like the incoming member's name, guild name, and guild membercount!
          [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
        ).setColor('RED')
      )

      data.welcomemsg = args.join(' ')
      return data.save().then(data => {
        profile.welcome.message = data.welcomemsg
        return message.channel.send(
          new MessageEmbed().setDescription(
            '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
            + `Member Greeter Feature message has been set!
            \nYou may now use this message on member joins via \`${client.config.prefix}setwelcomemsg msg=true\`
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
          ).setColor('GREEN').setFooter('Member Greeter | ©️2020 Mai')
        ).catch(() =>
           message.channel.send(
            new MessageEmbed().setDescription(
              `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
            `).setColor('RED')
          )
        )
      })
    }

    if (stats === 'embed=set'){
      if (!args.length)
      return message.channel.send(
        new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
          + `Please enter the embed options after the \`[options]\` parameter!
          \nYou can use modifiers too to use dynamic information like the incoming member's name, guild name, and guild membercount!
          [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
        ).setColor('RED')
      )

      //matches anything inside the bracket after -author=image:, -author=name:, etc
      //matches "https://i.imgur.com/asdasx.png" in "-author=image:[https://i.imgur.com/asdasx.png]"
      //returns undefined if matches nothing
      function matchFor(option, str){
        const regex = '(?<=' + option + ':\\[)[\\s\\S]+?(?=])';
        const res = str.match(new RegExp (regex, 'g')) || [];
        return res[0];
      }

      //tests if the passed string is a valid url format or not
      //returns a Boolean
      function websiteTest(str){
        if (str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))
        return true
        return false
      }

      //temporarily removed support for Embed fields and timestamp
      const embedProps = {
        authorImageURL: matchFor('-author=image', args.join(' ')),
        authorName: matchFor('-author=name', args.join(' ')),
        authorURL: matchFor('-author=url', args.join(' ')),
        title: matchFor('-title', args.join(' ')),
        url: matchFor('-url', args.join(' ')),
        description: matchFor('-description', args.join(' ')),
        thumbnail: matchFor('-thumbnail', args.join(' ')),
        color: matchFor('-color', args.join(' ')),
        image: matchFor('-image', args.join(' ')),
        footerText: matchFor('-footer=text', args.join(' ')),
        footerImage: matchFor('-footer=image', args.join(' '))
      }

      const success = [] // Stores confirmation messages if embed values are succesfully saved
      const fails = [] // Stores fail messages if embed values provided cannot be saved
      const validModifiers =  ['{avatar}','{avatarDynamic}','{guildIcon}','{guildIconDynamic}','{guildOwnerAvatar}','{guildOwnerAvatarDynamic}','{userAvatar}','{userAvatarDynamic}']
      //>>>>START>>>>>>>>*double checking variables**>>>>>>>>>//

      //------------testing validity of URL-------------------//

      for (let [key, value] of Object.entries(embedProps).filter(x => ['authorImageURL', 'authorURL', 'url', 'thumbnail', 'image', 'footerImage'].includes(x[0]))){

        if (!value) continue

        if (
          !websiteTest(value)
          && !(
            ['authorImageURL', 'thumbnail', 'image', 'footerImage'].includes(key)
            && validModifiers.includes(value)
          )
        ) {
          embedProps[key] = undefined
          fails.push(`The provided **${key}** is invalid. Please ensure the validity of the URL.`)
        } else {
        success.push(`**Embed#${key}** has successfully been set!`)
        }
      }

      //-----------testing validity of color------------------//

      if (embedProps.color && !embedProps.color.match(/#[a-f0-9]{6}/i)){
        embedProps.color = undefined
        fails.push('The provided **Color Hex Code** is invalid. Please make sure you are passing a valid Hex Code')
      } else {
        if (embedProps.color)
        success.push('**Embed#color** has successfully been set!')
      }


      //----------testing string lengths-----------------------//

      for (let [key, value] of Object.entries(embedProps)){
        if (!['authorName', 'title', 'description', 'footerText'].includes(key) || !value)
        continue;

        const limits = {
          title: 256,
          description: 2048,
          authorName: 256,
          footerText: 2048
        }

        if (value.length > limits[key]){
          embedProps[key] = undefined
          fails.push(`Embed **${key}** is only limited to ${limits[key]} characters. Yours have ${value.length}`)
        } else {
          success.push(`**Embed#${key}** has successfully been set!`)
        }
      }

      //>>>>>END>>>>>>>>>>*double checking variables*>>>>>>>>>>//
      //>>>>>>>>>**Check if new incoming data are present>>>>>>//

      if (!success.length){
        if (!fails.length) // no fails and success detected means improper args were passed
        return message.channel.send(
          new MessageEmbed().setDescription(
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
            + `Embed options not detected!
            \nEmbed options such as \`-title:[]\`, \`-url:[]\`, or \`-description:[]\` are needed so I could know which is which!
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature with Embeds!`
          ).setColor('RED')
        )

        return message.channel.send(
          new MessageEmbed().setDescription(
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
            + `All passed embed options are invalid!
            \n${fails.map(x => `\\⚠️ ${x}`).join('\n')}
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature with Embeds!`
          ).setColor('RED')
        )
      }

      //-------------------------------------------------------//

      const newData = new MessageEmbed(data.welcomeEmbed || {})

      newData
      .setAuthor(
        embedProps.authorName || (newData.author ? newData.author.name : ''),
        embedProps.authorImageURL || (newData.author ? newData.author.iconURL : null),
        embedProps.authorURL || (newData.author ? newData.author.url : null)
      )
      .setTitle(
        embedProps.title || newData.title
      )
      .setURL(
        embedProps.url || newData.url
      )
      .setThumbnail(
        embedProps.thumbnail || (newData.thumbnail ? newData.thumbnail.url : null)
      )
      .setDescription(
        embedProps.description || (newData.description ? newData.description : '')
      )
      .setImage(
        embedProps.image || (newData.image ? newData.image.url : null)
      )
      .setColor(
        embedProps.color || newData.color
      )
      .setFooter(
        embedProps.footerText || (newData.footer ? newData.footer.text : ''),
        embedProps.footerImage || (newData.footer ? newData.footer.iconURL : null)
      )

      // checking for modifiers in replacement to urls
      // modifiers are automatically converted to null because the class considers
      // modifiers as non-valid URL
      if (validModifiers.includes(embedProps.authorImageURL))
      newData.author.iconURL = embedProps.authorImageURL

      if (validModifiers.includes(embedProps.thumbnail))
      newData.thumbnail.url = embedProps.thumbnail

      if (validModifiers.includes(embedProps.image))
      newData.image.url = embedProps.image

      if (validModifiers.includes(embedProps.footerImage))
      newData.footer.iconURL = embedProps.footerImage

      //---------------------------------------------//

      data.welcomeEmbed = newData

      return data.save()
      .then(data => {
        profile.welcome.embed = data.welcomeEmbed
        return message.channel.send(
          new MessageEmbed().setDescription(
            '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
            + `Member Embedded message Feature has been updated!
            \n${success.map(x => `\\✔️ ${x}`).join('\n')}${fails.length ? `\n${fails.map(x => `\\⚠️ ${x}`).join('\n')}` : ''}
            You may now use this embed on member joins via \`${client.config.prefix}setwelcomemsg embed=true\`
            [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
          ).setColor('GREEN').setFooter('Member Greeter | ©️2020 Mai')
        )
      }).catch((err) =>
      console.log(err)
    )
   }


   if (!profile.welcome.enabled) //disabled channel
   return message.channel.send(
     new MessageEmbed().setDescription(
       '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
       + `This feature is currently disabled on your server!
       \nEnable it by typing \`${client.config.prefix}welcometoggle\`!
       [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
     ).setColor('RED')
   )

   if (!profile.welcome.channel || !message.guild.channels.cache.get(profile.welcome.channel)) //No channel detected
   return message.channel.send(
     new MessageEmbed().setDescription(
       '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
       + `No channel are set for sending these messages!
       \nSet it by typing \`${client.config.prefix}setwelcomech [#channel Mention | channel ID]\`!
       [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
     ).setColor('RED')
   )

   if (!profile.welcome.use) //use not set
   return message.channel.send(
     new MessageEmbed().setDescription(
       '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
       + `Failure to detect use-case!
       \nPlease fix it by typing \`${client.config.prefix}setwelcomemsg default\`!
       [Learn More](https://mai-san.ml/docs/Getting%20Started/custom_welcome_message) on how to configure Mai's member greeter feature.`
     ).setColor('RED')
   )

    return client.emit('guildMemberAdd', message.member)

 }
}

 function isEmpty(object) { for(var i in object) { return false; } return true; }
