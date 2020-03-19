const requireText = require("require-text");
const {getAnnouncementEmbed, getFromNextDays, query} = require("./util");
const settings = require('./../../botconfig.json')

const alIdRegex = /anilist\.co\/anime\/(.\d*)/;
const malIdRegex = /myanimelist\.net\/anime\/(.\d*)/;

const commands = {
  watch: {
    description: "Adds a new anime to watch for new episodes of. Whatever channel this is used in is the channel the announcements will be made in."
      + (getPermissionString() ? " " + getPermissionString() : "")
      + "\nYou may provide an AniList entry link or a MyAnimeList link.",
    async handle(message,args,data){
      if (!checkModifyPermission(message)) {
        message.react("👎");
        return;
      }

      const watchId = await getMediaId(args[0])
      if (!watchId || data.data.includes(watchId)){
        message.react("👎");
        return;
      }

      data.data.push(watchId);
      message.react("👍");
      return data;
    }
  },
  unwatch: {
    description: "Removes an anime from the list. Whatever channel this is used in is the channel the announcements will be made in."
      + (getPermissionString() ? " " + getPermissionString() : "")
      + "\nYou may provide an AniList entry link, a direct AniList media ID, or a MyAnimeList link.",
    async handle(message,args,data){
      if (!checkModifyPermission(message)) {
        message.react("👎");
        return;
      }

      let shows = data.data

      if (!shows || shows.length === 0){
        message.react("🤷");1
        return;
      }

      const watchId = await getMediaId(args[0]);
      if (!watchId || !shows.includes(watchId)){
        message.react("👎");
        return;
      }

      shows.splice(shows.indexOf(watchId),1)
      data.data = shows
      message.react("👍");
      return data;

    }
  },
  next: {
    description: "Displays the next anime to air (in the next 7 days) that the current channel is watching.",
    handle(message, args, data){
      if (!data || !data.data || data.data.length===0){
        message.react("👎");
        return;
      }
      query(requireText("./query/Schedule.graphql",require),{page:0, watched: data.data, nextDay: Math.round(getFromNextDays(7).getTime() / 1000)}).then(res => {
        if (res.errors){
          console.log(JSON.stringify(res.errors));
          return
        }
        if (res.data.Page.airingSchedules.length === 0) {
          message.react("👎");
          message.channel.stopTyping();
          return;
        }
        const anime = res.data.Page.airingSchedules[0];
        const embed = getAnnouncementEmbed(anime, new Date(anime.airingAt * 1000),true);
        message.channel.send({embed})
      })
    }
  },
  watching: {
    description: "Prints a list of all anime names being watched that are still currently airing.",
   handle(message,args,data){
     if (!data || !data.data || data.data.length === 0){
       message.react("👎")
       return;
     }
     handleWatchingPage(0)

     function handleWatchingPage(page) {
       query(requireText("./query/Watching.graphql",require),{watched: data.data, page}).then(res => {
         let description = ''
         res.data.Page.media.forEach(m => {
           if (m.status !== "RELEASING")
            return;

          const nextLine = `\n- [${m.title.romaji}](${m.siteUrl}) (\`${m.id}\`)`;
          if (1000 - description.length < nextLine.length){
            sendWatchingList(description, message.channel);
            console.log(description.length);
            description = '';
          }

          description += nextLine;
        });
        if (description.length !== 0)
          sendWatchingList(description, message.channel);

        if (res.data.Page.pageInfo.hasNextPage) {
          handleWatchingPage(res.data.Page.pageInfo.currentPage + 1);
          return
        }

        if (description.length === 0)
          message.channel.send("No currently airing shows are being announced.")
       })
     }
   }
 },
  cleanup: {
   description: "Purges any completed shows from this channel's watch list.",
   async handle(message, args, data) {
     if (!data || !data.data || data.data.length === 0) {
       message.react("👎");
       return;
     }


     function handlePage(page = 0) {
       return query(requireText("./query/Watching.graphql", require), {watched: data.data, page}).then(res => {
         return res;

       });
     }

     let finished;
     return handlePage().then(res => res.data.Page).then(res => promiseWhile(res, val => {
       finished = val.media.filter(e => e.status === "FINISHED").map(e => e.id);
       return val.pageInfo.hasNextPage
     }, val => handlePage(val.pageInfo.currentPage + 1).then(res => res.data.Page))).then(() => {

       data.data = data.data.filter(e => !finished.includes(e));

       if (finished.length>0){
        message.channel.send(`Removed **${finished.length}** shows from the list.`);
        message.react("👍");
      } else {
        message.react("👎");
      }

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
}

module.exports = commands;

function checkModifyPermission(message) {
  switch (settings.PERMISSION_TYPE){
    case "CHANNEL_MANAGER":
      return message.channel.permissionsFor(message.author).has("MANAGE_CHANNELS");
    case "SERVER_OWNER":
      return message.author.id === message.guild.ownerID;
    default:
      return true;
  }
}

async function getMediaId(input) {

  let match = alIdRegex.exec(input);
  if (match)
    return parseInt(match[1]);

  match = malIdRegex.exec(input);

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

function sendWatchingList(description,channel){
  const embed = {
    title: "Current announcements",
    color: 3092790,
    author: {
      name: channel.client.user.username + " | AniList",
      url: "https://anilist.co",
      icon_url: "https://anilist.co/img/logo_al.png"
    },
    description
  }
  channel.send({embed})
}

function promiseWhile(data, condition, action) {
  function whilst(data) {
    return condition(data) ? action(data).then(whilst) : Promise.resolve(data);
  }

  return whilst(data);
}
