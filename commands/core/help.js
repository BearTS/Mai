const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');
const constants = require('../../util/constants');

module.exports = {
  name: 'help',
  aliases: [ ],
  group: 'core',
  description: 'Displays basic information or a help for a command.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [ 'Command Name/Alias' ],
  examples: [
    'help anirand',
    'help watching',
    'help register'
  ],
  run: (client, message, [query]) => {

    const { websites } = client.config;

    if (!query){
      return message.channel.send(
        new MessageEmbed()
        .setColor('GREY')
        .setTitle('Hello! I\'m Mai and I am a bot based around anime')
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setFooter(`Help | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '<a:mai_stare1:783382661195759616><a:mai_stare2:783383003216216123><a:mai_stare3:783383266760851526><a:mai_stare4:783383656013627484>',
          '<a:mai_stare1:783382661195759616><a:mai_stare2:783383003216216123><a:mai_stare3:783383266760851526><a:mai_stare4:783383656013627484>',
          '<a:mai_stare1:783382661195759616><a:mai_stare2:783383003216216123><a:mai_stare3:783383266760851526><a:mai_stare4:783383656013627484>\n',
          '\n\u2000•\u2000\u2000[Who is **Mai**?](https://myanimelist.net/character/118739/)\n',
          '\u2000•\u2000\u2000[From what anime is ***Mai***\u2000from?](https://myanimelist.net/anime/37450/)\n',
          '\u2000•\u2000\u2000[Is Mai a **Top-tier** waifu?](https://www.seekpng.com/png/detail/495-4955052_why-do-people-say-yes-big-yes.png)'
        ].join(' '))
        .addFields({
          name: 'What can I Do?',
          value: [
            'I can be used for various anime searches, such as searching for anime, character,',
            'seiyuu (voice actors), or even schedules for upcoming anime. I can also be used to',
            'spice up chat environment by providing random generated images for various phrases',
            'like baka, pat, or tickle!. I provide free xp system for the server as well as global',
            'and Implement social commands (profiles and such). I can manage your server as well by',
            'Providing you with commands like kick, ban, and mute. I also have tools to search for',
            'random things like steam games, color hex, and more!'
          ].join(' ')
        },{
          name: 'What makes me different from the other bot in the market?',
          value: [
            'Nothing is better than an open source and free bot with a lot of features! You can view',
            'all of my features on the documentation page linked below.'
          ].join(' ')
        },{
          name: '\u200b',
          value: [
            `\u200b\u2000•\u2000\u2000All my commands start with the prefix \`${client.prefix}\`.`,
            `\u2000•\u2000\u2000Use \`${client.prefix}commands\` to see the list of my commands.`,
            `\u2000•\u2000\u2000You can also use \`${client.prefix} help [command]\` to get help on a specific command.`
          ].join('\n')
        },{
          name: '\u200b',
          value: Object.entries(websites).map(( [name, url] ) =>{
            return `[*${name.charAt(0).toUpperCase() + name.slice(1)}*](${url})`;
          }).join('\u2000•\u2000')
        })
      );
    } else {
      const command = client.commands.get(query.toLowerCase());

      if (!command){
        return message.channel.send(`Sorry, I couldn't find any match for **${query}** in the commands list!`);
      };

      return message.channel.send(
        new MessageEmbed()
        .setColor('GREY')
        .setDescription(command.description)
        .setAuthor(client.prefix + command.name, client.user.displayAvatarURL())
        .setFooter(`Help | \©️${new Date().getFullYear()} Mai`)
        .addFields([
          { name: 'Aliases', value: text.joinArray(command.aliases) || 'None' , inline: true },
          {
            name: 'Restrictions', inline: true,
            value: Object.entries(command).filter(( [key, val] ) => val === true)
            .map(([ key ]) => constants.restriction[key]).join(' ') || 'None'
          },
          {
            name: 'Permissions', value: text.joinArray(command.permissions.map(x => x.split('_')
            .map(a => a.charAt(0) + a.slice(1).toLowerCase()).join(' '))) || 'None', inline: true
          },
          { name: 'Parameters', value: text.joinArray(command.parameters) || 'None', inline: true },
          { name: 'Cooldown\n(seconds)', value: command.cooldown.time / 1000 || 'None', inline: true},
          { name: '\u200b', value: '\u200b', inline: true },
          { name: 'Examples', value: command.examples.map(x=>`\`${client.prefix}${x}\``)||'None'},
          {
            name: '\u200b',
            value: Object.entries(websites).map(( [name, url] ) =>{
              return `[*${name.charAt(0).toUpperCase() + name.slice(1)}*](${url})`;
            }).join('\u2000•\u2000')
          }
        ])
      );
    };
  }
};
