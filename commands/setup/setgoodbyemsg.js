const { MessageEmbed } = require('discord.js');
const guilds = require(`${process.cwd()}/models/GuildProfile`);

module.exports = {
  name: 'setgoodbyemsg',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the goodbye message. Supports Embeds! [Learn how to set up your Leaving Member Announcer](https://guides.mai-san.ml/)',
  requiresDatabase: true,
  parameters: [ 'options', 'other parameters' ],
  examples: [
    'setgoodbyemsg default',
    'setgoodbyemsg embed=true',
    'setgoodbyemsg embed=set -author=image:[ <url> ]',
  ],
  run: (client, message, [stats = '', ...args]) => guilds.findById(message.guild.id, (err, doc) => {

    stats = stats.toLowerCase();
    const profile = client.guildProfiles.get(message.guild.id);

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    if (!stats || !stats.match(/default|(msg|embed)=true|(msg|embed)=set|test/)){
      return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
          'Please include the option parameter\n\n',
          '[Learn more](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
          'on how to configure Mai\'s Leaving Member Announcer feature.'
        ].join(''))
      )
    };

    if (stats === 'default'){
      doc.greeter.leaving.type = 'default';
      return doc.save()
      .then(() => {
        profile.greeter.leaving.type =  'default';
        return message.channel.send(
          new MessageEmbed()
          .setColor('GREEN')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
            'Leaving Member Announcer Feature message has been successfully reverted to **default**!\n',
            'Outgoing members will now be announced by Mai\'s default announce message.\n',
            `To change the message, use \`${client.prefix}setgoodbyemsg [options] [additional parameters]\`\n`,
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      }).catch(() => sendError(message));
    } else if (stats === 'msg=true'){
      if (!doc.greeter.leaving.message){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'Unable to change the goodbye message to **text mode**!\n\n',
            'Make sure you have already set a goodbye message (plain text) before you run this command.\n',
            `To set the message, use \`${client.prefix}setgoodbyemsg msg=set [message content]\`\n`,
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      } else {
        doc.greeter.leaving.type = 'msg';
        return doc.save()
        .then(() => {
          profile.greeter.leaving.type = 'msg';
          return message.channel.send(
            new MessageEmbed()
            .setColor('GREEN')
            .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
            .setDescription([
              '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
              'Leaving Member Announcer Feature message has been successfully changed to **text mode**!\n',
              'Outgoing members will now be announced through your guild\'s configured goodbye message.\n',
              `To change the message, use \`${client.prefix}setgoodbyemsg [options] [additional parameters]\`\n`,
              '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
              'on how to configure Mai\'s Leaving Member Announcer feature.'
            ].join(''))
          );
        }).catch(() => sendError(message))
      };
    } else if (stats === 'embed=true'){
      if (!doc.greeter.leaving.embed || !Object.entries(doc.greeter.leaving.embed).length){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'Unable to change the goodbye message to **embed mode**!\n\n',
            'Make sure you have already set a goodbye message (embed) before you run this command.\n',
            `To set the message, use \`${client.prefix}setgoodbyemsg embed=set [embed details]\`\n`,
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      } else {
        doc.greeter.leaving.type = 'embed'
        return doc.save()
        .then(() => {
          profile.greeter.leaving.type = 'embed';
          return message.channel.send(
            new MessageEmbed()
            .setColor('GREEN')
            .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
            .setDescription([
              '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
              'Leaving Member Announcer Feature message has been successfully changed to **embed mode**!\n',
              'Outgoing members will now be announced through your guild\'s configured goodbye message.\n',
              `To change the message, use \`${client.prefix}setgoodbyemsg [options] [additional parameters]\`\n`,
              '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
              'on how to configure Mai\'s Leaving Member Announcer feature.'
            ].join(''))
          );
        }).catch(() => sendError(message))
      };
    } else if (stats === 'msg=set'){
      if (!args.length){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'Please enter a goodbye message after the \`[options]\` parameter!\n',
            'You can use modifiers too to use dynamic information like the Outgoing member\'s name, guild name, and guild membercount!\n',
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        )
      } else {
        doc.greeter.leaving.message = args.join(' ');
        return doc.save()
        .then(() => {
          profile.greeter.leaving.message = doc.greeter.leaving.message;
          return message.channel.send(
            new MessageEmbed()
            .setColor('GREEN')
            .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
            .setDescription([
              '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
              'Leaving Member Announcer Feature message has been set!\n',
              `You may now use this message on member leaves via \`${client.prefix}setgoodbyemsg msg=true\`\n`,
              '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
              'on how to configure Mai\'s Leaving Member Announcer feature.'
            ].join(''))
          );
        }).catch(() => sendError(message))
      };
    } else if (stats === 'embed=set') {
      if (!args.length){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'Please enter the embed options after the \`[options]\` parameter!\n',
            'You can use modifiers too to use dynamic information like the Outgoing member\'s name, guild name, and guild membercount!\n',
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      } else {
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

        for (let [key, val] of Object.entries(embedProps)){
          if (!['authorImageURL', 'authorURL', 'url', 'thumbnail', 'image', 'footerImage'].includes(key)){
            continue;
          } else if (!val){
            continue;
          } else {
            if (!websiteTest(val) && !(
              ['authorImageURL', 'thumbnail', 'image', 'footerImage'].includes(key)
              && validModifiers.includes(val)
            )){
              embedProps[key] = undefined
              fails.push(`The provided **${key}** is invalid. Please ensure the validity of the URL.`)
            } else {
              success.push(`**Embed#${key}** has successfully been set!`)
            }
          };
        }

        //-----------testing validity of color------------------//

        if (embedProps.color && !embedProps.color.match(/#[a-f0-9]{6}/i)){
          embedProps.color = undefined;
          fails.push('The provided **Color Hex Code** is invalid. Please make sure you are passing a valid Hex Code');
        } else if (embedProps.color){
          success.push('**Embed#color** has successfully been set!')
        };

        //----------testing string lengths-----------------------//

        for (let [key, val] of Object.entries(embedProps)){
          if (!['authorName', 'title', 'description', 'footerText'].includes(key)){
            continue;
          } else if (!val){
            continue;
          } else {

            const limits = {
              title: 256,
              description: 2048,
              authorName: 256,
              footerText: 2048
            };

            if (val.length > limits[key]){
              embedProps[key] = undefined
              fails.push(`Embed **${key}** is only limited to ${limits[key]} characters. Yours have ${val.length}`);
            } else {
              success.push(`**Embed#${key}** has successfully been set!`);
            };

            //>>>>>END>>>>>>>>>>*double checking variables*>>>>>>>>>>//
            //>>>>>>>>>**Check if new Outgoing data are present>>>>>>//

            if (!success.length){
              if (!fails.length){
                return message.channel.send(
                  new MessageEmbed()
                  .setColor('RED')
                  .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
                  .setDescription([
                    '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
                    'Embed options not detected!\n',
                    'Embed options such as \`-title:[]\`, \`-url:[]\`, or \`-description:[]\` are needed so I could know which is which!\n',
                    '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
                    'on how to configure Mai\'s Leaving Member Announcer feature.'
                  ].join(''))
                );
              } else {
                return message.channel.send(
                  new MessageEmbed()
                  .setColor('RED')
                  .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
                  .setDescription([
                    '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
                    'All passed embed options are invalid!\n',
                    fails.map(x => `\\⚠️ ${x}`).join('\n'),
                    '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
                    'on how to configure Mai\'s Leaving Member Announcer feature.'
                  ].join(''))
                );
              };
            } else {

              const embed = new MessageEmbed(doc.greeter.leaving.embed || {})
              embed
              .setAuthor(
                embedProps.authorName || (embed.author ? embed.author.name : ''),
                embedProps.authorImageURL || (embed.author ? embed.author.iconURL : null),
                embedProps.authorURL || (embed.author ? embed.author.url : null)
              )
              .setTitle(
                embedProps.title || embed.title
              )
              .setURL(
                embedProps.url || embed.url
              )
              .setThumbnail(
                embedProps.thumbnail || (embed.thumbnail ? embed.thumbnail.url : null)
              )
              .setDescription(
                embedProps.description || (embed.description ? embed.description : '')
              )
              .setImage(
                embedProps.image || (embed.image ? embed.image.url : null)
              )
              .setColor(
                embedProps.color || embed.color
              )
              .setFooter(
                embedProps.footerText || (embed.footer ? embed.footer.text : ''),
                embedProps.footerImage || (embed.footer ? embed.footer.iconURL : null)
              );

              // checking for modifiers in replacement to urls
              // modifiers are automatically converted to null because the class considers
              // modifiers as non-valid URL
              if (validModifiers.includes(embedProps.authorImageURL))
              embed.author.iconURL = embedProps.authorImageURL;

              if (validModifiers.includes(embedProps.thumbnail))
              embed.thumbnail.url = embedProps.thumbnail

              if (validModifiers.includes(embedProps.image))
              embed.image.url = embedProps.image

              if (validModifiers.includes(embedProps.footerImage))
              embed.footer.iconURL = embedProps.footerImage;

              doc.greeter.leaving.embed = embed

              return doc.save()
              .then(() => {
                profile.greeter.leaving.embed = embed;
                return message.channel.send(
                  new MessageEmbed()
                  .setColor('GREEN')
                  .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
                  .setDescription([
                    '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
                    'Leaving Member Embed Message has been updated!\n',
                    success.map(x => `\\✔️ ${x}`).join('\n'),
                    fails.map(x => `\\⚠️ ${x}`).join('\n'),
                    `You may now use this embed on member leaves via \`${client.prefix}setgoodbyemsg embed=true\``,
                    '[Learn More](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) on how to configure Mai\'s Leaving Member Announcer feature.'
                  ].join(' '))
                );
              }).catch(() => sendError(message));
            };
          };
        };
      };
    } else {
      if (!profile.greeter.leaving.isEnabled){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'This feature is currently disabled on your server!\n\n',
            `Enable it by typing \`${client.config.prefix}goodbyetoggle\`\n`,
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      } else if (!profile.greeter.leaving.channel || !message.guild.channels.cache.get(profile.greeter.leaving.channel)){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'No channel are set for sending these messages!\n\n',
            `Set it by typing \`${client.prefix}setgoodbyech [#channel Mention | channel ID]\`\n`,
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      } else if (!profile.greeter.leaving.type){
        return message.channel.send(
          new MessageEmbed()
          .setColor('RED')
          .setFooter(`Leaving Member Announcer | \©️${new Date().getFullYear()} Mai`)
          .setDescription([
            '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000',
            'Failure to detect use-case!\n\n',
            `Please fix it by typing \`${client.config.prefix}setgoodbyemsg default\`!`,
            '[**Learn more**](https://mai-san.ml/docs/Getting%20Started/custom_leave_message) ',
            'on how to configure Mai\'s Leaving Member Announcer feature.'
          ].join(''))
        );
      } else {
        message.react('✅');
        return client.emit('guildMemberRemove', message.member);
      };
    };
  })
};

function sendError(message){
  return message.channel.send(`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)
};
