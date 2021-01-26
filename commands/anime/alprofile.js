const { MessageEmbed } = require('discord.js');
const { decode } = require('he');
const requireText = require('require-text');

const userquery = requireText('../../assets/graphql/User.graphql',require);
const text = require('../../util/string');

module.exports = {
  name: 'alprofile',
  aliases: [ 'al-of', 'alof', 'alstat', 'aluser' ],
  cooldown: { time: 10000 },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: 'anime',
  description: 'Finds user profile on [Anilist](https://anilist.co) based on the provided query.',
  parameters: [ 'Anilist Username' ],
  examples: [
    'alprofile',
    'al-of sakurajimai',
    'alof sakurajimai',
    'alstat sakurajimai',
    'aluser sakurajimai'
  ],
  run: async function ( client, message, args ) {

    const query = args.join(' ');

    if (!query){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send('\\❌ Please include the user to find on Anilist!');
    };

    const response = await client.anischedule.fetch(userquery, { search: query });

    if (response.errors){
      let err;
      if (response.errors[0].status === 404){
        err = `\\❌ I can't find **${query}** on Anilist!`;
      } else if (response.errors.some(x => x.status >= 500)){
        err = `\\❌ Anilist couldn\'t be reached at the moment! Please try again later. [err ${response.errors[0].status}]`;
      } else if (response.errors.some(x => x.status >= 400)){
        err =`\`❌ CLIENT_ERR\`: Mai attempted to send an invalidated request to AniList. Please contact my developer to fix this bug.`;
      } else {
        err = `\\❌ Something wrong has occured. Please try again later`;
      };
      return message.channel.send(err);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setImage(response.data.User.bannerImage)
      .setThumbnail(response.data.User.avatar.medium)
      .setAuthor(response.data.User.name, null, response.data.User.siteUrl)
      .setDescription(text.truncate(decode(response.data.User.about?.replace(/(<([^>]+)>)/ig,'') || ''), 250))
      .setFooter(`ALProfile | \©️${new Date().getFullYear()} Mai`)
      .addFields(Object.entries(response.data.User.favourites).map(([topic, target]) => {
        topic = topic.charAt(0).toUpperCase() + topic.slice(1);
        return {
          name: `Top 5 ${topic}${'\u2000'.repeat(12-topic.length)}\u200b` , inline: true,
          value: target.edges.map(entry => {
            const identifier = entry.node.title || entry.node.name;
            const name = typeof identifier === 'object' ? identifier.userPreferred || identifier.full : identifier;

            return `• [**${name}**](${entry.node.siteUrl})`;
          }).join('\n') || 'None Listed'
        };
      }))
    );
  }
};
