const requireText = require("require-text");
const fs = require("fs");
const settings = require('./../../botconfig.json')
const commands = require("./commands");
const {getAnnouncementEmbed, getFromNextDays, query} = require("./util");
const commandPrefix = settings.prefix;
const dataFile = "./data.json";
let data = {};
let queuedNotifications = [];

const ready = () => {
  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile));
    cleanupLists();
  } else {
    fs.writeFileSync(dataFile, JSON.stringify({}));
  }

  handleSchedules(Math.round(getFromNextDays().getTime() / 1000)); // Initial run
  return setInterval(() => handleSchedules(Math.round(getFromNextDays().getTime() / 1000)), 1000 * 60 * 60 * 24); // Schedule future runs every 24 hours
};



const readCommand = (msg) => {
  if (!msg.guild)
    return;

  if (msg.author.bot)
    return;

  const msgContent = msg.content.split(/ +/);

  if (msgContent[0].startsWith(commandPrefix)) {
    const command = commands[msgContent[0].substr(commandPrefix.length)];
    if (command) {
      const serverData = data[msg.guild.id] || {};
      const promise = command.handle(msg, msgContent.slice(1), serverData);
      if (promise) {
        promise.then(ret => {
          if (ret) {
            data[msg.guild.id] = ret;
            fs.writeFileSync(dataFile, JSON.stringify(data));
          }
        });
      }
    }
  }
}

module.exports = {
  ready,
  readCommand
}

function handleSchedules(time, page) {
  query(requireText("./query/Schedule.graphql", require), { page: page, watched: getAllWatched(), nextDay: time }).then(res => {
    if (res.errors) {
      console.log(JSON.stringify(res.errors));
      return;
    }

    res.data.Page.airingSchedules.forEach(e => {
      const date = new Date(e.airingAt * 1000);
      if (queuedNotifications.includes(e.id))
        return;

      console.log(`Scheduling announcement for ${e.media.title.romaji} on ${date}`);
      queuedNotifications.push(e.id);
      setTimeout(() => makeAnnouncement(e, date), e.timeUntilAiring * 1000);
    });

    // Gather any other pages
    if (res.data.Page.pageInfo.hasNextPage)
      handleSchedules(time, res.data.Page.pageInfo.currentPage + 1);
  });
}

function getAllWatched() {
  const watched = [];
  Object.values(data).forEach(server => {
    Object.values(server).filter(c => c.shows).forEach(c => c.shows.forEach(s => watched.push(s)));
  });
  return watched;
}

function makeAnnouncement(entry, date, upNext = false) {
  queuedNotifications = queuedNotifications.filter(q => q !== entry.id);
  const embed = getAnnouncementEmbed(entry, date, upNext);

  Object.values(data).forEach(serverData => {
    Object.entries(serverData).forEach(([channelId, channelData]) => {
      if (!channelData.shows || channelData.shows.length === 0)
        return;

      if (channelData.shows.includes(entry.media.id)) {
        const channel = client.channels.find(v => v.id === channelId);
        if (channel) {
          console.log(`Announcing episode ${entry.media.title.romaji} to ${channel.guild.name}@${channel.id}`);
          channel.send({embed});
        }
      }
    });
  });
}

function cleanupLists() {
  Object.values(data).forEach(serverData => {
    Object.entries(serverData).forEach(([channelId, channelData]) => {
      if (!channelData.shows || channelData.shows.length === 0)
        return;

      channelData.shows = channelData.shows.filter(e => e !== null);
    });
  });

  fs.writeFileSync(dataFile, JSON.stringify(data));
}
