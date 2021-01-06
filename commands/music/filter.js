const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'filter',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Add Filter to the current song',
  examples: ['filter [filter name]'],
  parameters: ['filter name'],
  run:  async function (client, message, args) {
    // embeds
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

    const specifyfilter = new MessageEmbed()
    .setAuthor("Specify a valid filter to Toggle")
    .setColor(`#ffb6c1`)
    .setDescription("Do `filters` to check all the filters available")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const nofilterexist = new MessageEmbed()
    .setAuthor("The Filter doesn't Exist")
    .setColor(`#ffb6c1`)
    .setDescription("Example are `8d` `nightcore`. To Get a list of Filters, do `filters`")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const enable = new MessageEmbed()
    .setAuthor("Filter Enabled")
    .setColor(`#ffb6c1`)
    .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const disable = new MessageEmbed()
    .setAuthor("Filter Disabled")
    .setColor(`#ffb6c1`)
    .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);


            if (!message.member.voice.channel) return message.channel.send(joinvc);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

        if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        if (!args[0]) return message.channel.send(specifyfilter);

        const filterToUpdate = client.filters.find((x) => x.toLowerCase() === args[0].toLowerCase());

        if (!filterToUpdate) return message.channel.send(nofilterexist);

        const filtersUpdated = {};

        filtersUpdated[filterToUpdate] = client.player.getQueue(message).filters[filterToUpdate] ? false : true;

        client.player.setFilters(message, filtersUpdated);

        if (filtersUpdated[filterToUpdate]) message.channel.send(enable);
        else message.channel.send(disable);
    },
};
