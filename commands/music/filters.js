const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'filters',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Check all filters',
  examples: ['filters'],
  run:  async function (client, message) {

    const samevc = new MessageEmbed()
    .setAuthor("You Must be in the same voice channel")
    .setColor(`#ffb6c1`)
    .setDescription("Baka Baka Baka")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const joinvc = new MessageEmbed()
    .setAuthor("You Must be in a voice channel")
    .setColor(`#ffb6c1`)
    .setDescription("Where will I even play songs!!?! ")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const nomusic = new MessageEmbed()
    .setAuthor("There is no music playing")
    .setColor(`#ffb6c1`)
    .setDescription("Baka")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    if (!message.member.voice.channel) return message.channel.send(joinvc);

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        const filtersStatuses = [[], []];

        client.filters.forEach((filterName) => {
            const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
            array.push(filterName.charAt(0).toUpperCase() + filterName.slice(1) + " : " + (client.player.getQueue(message).filters[filterName] ? "<a:animatedcheck:788340206691549204>" : "<:cancel:788323084770738216>"));
        });

        const filters = new MessageEmbed()
        .setAuthor("You Must be in the same voice channel")
        .setColor(`#ffb6c1`)
        .setDescription("List of all filters enabled or disabled.\nUse \`t!filter [filter name]\` to add a filter to a song.")
        .addField('Filters', filtersStatuses[0].join('\n'), true)
        .addField('** **', filtersStatuses[1].join('\n'), true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

        message.channel.send(filters);
    },
};
