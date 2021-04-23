const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const fetch                                   = require('node-fetch');

module.exports = {
  name             : 'animeme',
  aliases          : [ 'ameme' , 'animememe' , 'animemes' , 'animememes' , 'amemes' ],
  cooldown         : null,
  guildOnly        : true,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Generate an anime meme fetched from selected <:reddit:767062345422864394> [Subreddits](https://reddit.com "Homepage").',
  parameters       : [ ],
  examples         : [ 'animeme' ],
  run              : async (message, language, args) => {

    const URI        = 'https://www.reddit.com/r/animemes.json';
    const filter     = (x)       => x.data.post_hint === 'image' && !x.data.pinned;
    const toJSON     = async (x) => (await x.json()).data.children.filter(filter);
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag
    });

    if (!message.guild.memes.size){
      for (const res of await fetch(URI).then(toJSON).catch(() => [])){
        const { data: { title, ups, downs, permalink, url, created_utc }} = res;
        message.guild.memes.set(title, { title, ups, downs,
          link     : 'https://reddit.com/' + permalink,
          image    : url,
          timestamp: created_utc * 1000
        });
      };
    };

    const meme = message.guild.memes.random();
                 message.guild.memes.delete(meme.title);

    if (!meme){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'ANIMEME_NOMEME', parameters }));
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setTitle(meme.title)
      .setURL(meme.link)
      .setImage(meme.image)
      .setTimestamp(meme.timestamp)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'ANIMEME_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    );
  }
};
