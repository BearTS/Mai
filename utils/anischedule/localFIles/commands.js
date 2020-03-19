const requireText = require("require-text");
const {getAnnouncementEmbed, getFromNextDays, query} = require("./util");
const flatten = require ("array-flatten");
const settings = require('./../../botconfig.json')

const alIdRegex = /anilist\.co\/anime\/(.\d*)/;
const malIdRegex = /myanimelist\.net\/anime\/(.\d*)/;

const commands = {
  watch: {
    description: "Adds a new anime to watch for new episodes of. Whatever channel this is used in is the channel the announcements will be made in."
      + (getPermissionString() ? " " + getPermissionString() : "")
      + "\nYou may provide an AniList entry link, a direct AniList media ID, or a MyAnimeList link.",
    async handle(message, args, data) {
      if (!checkModifyPermission(message)) {
        message.react("👎");
        return;
      }

      message.channel.startTyping();
      const channelData = data[message.channel.id] || {shows: []};
      const watched = channelData.shows || [];

      const watchId = await getMediaId(args[0]);
      if (!watchId || watched.includes(watchId)) {
        message.react("👎");
        message.channel.stopTyping();
        return;
      }
      watched.push(watchId);
      channelData.shows = watched;
      data[message.channel.id] = channelData;
      message.react("👍");
      message.channel.stopTyping();
      return data;
    }
  },
  unwatch: {
    description: "Removes an anime from the list. Whatever channel this is used in is the channel the announcements will be made in."
      + (getPermissionString() ? " " + getPermissionString() : "")
      + "\nYou may provide an AniList entry link, a direct AniList media ID, or a MyAnimeList link.",
    async handle(message, args, data) {
      if (!checkModifyPermission(message)) {
        message.react("👎");
        return;
      }
      message.channel.startTyping();
      const channelData = data[message.channel.id];
      if (!channelData || !channelData.shows || channelData.shows.length === 0) {
        message.react("🤷");
        message.channel.stopTyping();
        return;
      }

      const watchId = await getMediaId(args[0]);
      if (!watchId || !channelData.shows.includes(watchId)) {
        message.react("👎");
        message.channel.stopTyping();
        return;
      }
      channelData.shows = channelData.shows.filter(id => id !== watchId);
      data[message.channel.id] = channelData;
      message.react("👍");
      message.channel.stopTyping();
      return data;
    }
  },
  next: {
    description: "Displays the next anime to air (in the next 7 days) that the current channel is watching.",
    handle(message, args, data) {
      const channelData = data[message.channel.id];
      if (!channelData || !channelData.shows || channelData.shows.length === 0) {
        message.react("👎");
        return;
      }

      message.channel.startTyping();
      query(requireText("./query/Schedule.graphql", require), { page: 0, watched: channelData.shows, nextDay: Math.round(getFromNextDays(7).getTime() / 1000) }).then(res => {
        if (res.errors) {
          console.log(JSON.stringify(res.errors));
          message.channel.stopTyping();
          return;
        }

        if (res.data.Page.airingSchedules.length === 0) {
          message.react("👎");
          message.channel.stopTyping();
          return;
        }

        const anime = res.data.Page.airingSchedules[0];
        const embed = getAnnouncementEmbed(anime, new Date(anime.airingAt * 1000), true);
        message.channel.send({embed});
        message.channel.stopTyping();
      });
    }
  },
  watching: {
    description: "Prints a list of all anime names being watched that are still currently airing.",
    handle(message, args, data) {
      const channelData = data[message.channel.id];
      if (!channelData || !channelData.shows || channelData.shows.length === 0) {
        message.react("👎");
        return;
      }

      message.channel.startTyping();
      handleWatchingPage(0);

      function handleWatchingPage(page) {
        query(requireText("./query/Watching.graphql", require), {watched: channelData.shows, page}).then(res => {
          let description = "";
          res.data.Page.media.forEach(m => {
            if (m.status !== "RELEASING")
              return;

            const nextLine = `\n- [${m.title.romaji}](${m.siteUrl}) (\`${m.id}\`)`;
            if (1000 - description.length < nextLine.length) {
              sendWatchingList(description, message.channel);
              console.log(description.length);
              description = "";
            }

            description += nextLine;
          });
          if (description.length !== 0)
            sendWatchingList(description, message.channel);

          if (res.data.Page.pageInfo.hasNextPage) {
            handleWatchingPage(res.data.Page.pageInfo.currentPage + 1);
            return;
          }
          if (description.length === 0)
            message.channel.send("No currently airing shows are being announced.");
          message.channel.stopTyping();
        });
      }
    }
  },
  cleanup: {
    description: "Purges any completed shows from this channel's watch list.",
    async handle(message, args, data) {
      let channelData = data[message.channel.id];
      if (!channelData || !channelData.shows || channelData.shows.length === 0) {
        message.react("👎");
        return;
      }


      function handlePage(page = 0) {
        return query(requireText("./query/Watching.graphql", require), {watched: channelData.shows, page}).then(res => {
          return res;
        });
      }

      let finished = [];
      return handlePage().then(res => res.data.page).then(res => promiseWhile(res, val => {
        finished.push(val.media.filter(e => e.status === "FINISHED").map(e => e.id));
        return val.pageInfo.hasNextPage
      }, val => handlePage(val.pageInfo.currentPage + 1).then(res => res.data.Page))).then(() => {
        channelData.shows = channelData.shows.filter(e => !finished.includes(e));

        message.channel.send(`Removed ${finished.length} shows from the list.`);

        data[message.channel.id] = channelData;
        message.react("👍");
        message.channel.stopTyping();
        return data;
      });
    }
  },
  anischedhelp: {
    description: "Prints out all available commands with a short description.",
    handle(message, args, data) {
      const embed = {
        title: "AniSchedule Commands",
        author: {
          name: message.client.user.username +" | AniSchedule",
          url: "https://anilist.co",
          icon_url: message.client.user.avatarURL
        },
        color: 3092790,
        description: "Support the creator @ [GitHub](https://github.com/TehNut/AniSchedule) | [Author](https://anilist.co/user/TehNut/)\nCommands must be prefixed by `" + (settings.prefix) + "`",
        footer: {
          text: "For more information, see the README on the GitHub page"
        },
        fields: []
      };

      Object.entries(commands).forEach((k, v) => embed.fields.push({name: k[0], value: k[1].description, inline: true}));

      message.channel.send({embed});
    }
  }
};

module.exports = commands;

function sendWatchingList(description, channel) {
  const embed = {
    title: "Current announcements ",
    color: 3092790,
    author: {
      name: "AniList",
      url: "https://anilist.co",
      icon_url: "https://anilist.co/img/logo_al.png"
    },
    description
  };
  channel.send({embed});
}

function checkModifyPermission(message) {
  switch (settings.PERMISSION_TYPE) {
    case "CHANNEL_MANAGER":
      return message.channel.permissionsFor(message.author).has("MANAGE_CHANNELS");
    case "SERVER_OWNER":
      return message.author.id === message.guild.ownerID;
    default:
      return true;
  }
}

function getPermissionString() {
  switch (settings.PERMISSION_TYPE) {
    case "CHANNEL_MANAGER":
      return "Requires the Channel Manager permission.";
    case "SERVER_OWNER":
      return "May only be used by the server owner.";
    default:
      return null;
  }
}

async function getMediaId(input) {
  // First we try directly parsing the input in case it's the standalone ID
  const output = parseInt(input);
  if (output)
    return output;

  // If that fails, we try parsing it with regex to pull the ID from an AniList link
  let match = alIdRegex.exec(input);
  // If there's a match, parse it and return that
  if (match)
    return parseInt(match[1]);

  // If that fails, we try parsing it with another regex to get an ID from a MAL link
  match = malIdRegex.exec(input);
  // If we can't find a MAL ID in the URL, just return null;
  if (!match)
    return null;

  return await query("query($malId: Int){Media(idMal:$malId){id}}", {malId: match[1]}).then(res => {
    if (res.errors) {
      console.log(JSON.stringify(res.errors));
      return;
    }

    return res.data.Media.id;
  });
}

function promiseWhile(data, condition, action) {
  function whilst(data) {
    return condition(data) ? action(data).then(whilst) : Promise.resolve(data);
  }

  return whilst(data);
}
