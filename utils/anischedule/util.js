const fetch = require("node-fetch");
const streamingSites = [
  "Amazon",
  "Animelab",
  "Crunchyroll",
  "Funimation",
  "Hidive",
  "Hulu",
  "Netflix",
  "Viz"
];

const query = function(query, variables) {
  return fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(res => res.json());
}

const getFromNextDays = function(days = 1) {
  return new Date(new Date().getTime() + (24 * 60 * 60 * 1000 * days));
}

const getAnnouncementEmbed = function(entry, date, upNext = false) {
  let description = `Episode ${entry.episode} of [${entry.media.title.romaji}](${entry.media.siteUrl})${upNext ? "" : " has just aired."}`;
  if (entry.media.externalLinks && entry.media.externalLinks.length > 0) {
    let streamLinks = "";
    let multipleSites = false;
    entry.media.externalLinks.forEach(site => {
      if (streamingSites.includes(site.site)) {
        streamLinks += `${multipleSites ? " • " : ""} [${site.site}](${site.url})`;
        multipleSites = true;
      }
    });

    description += "\n\n" + (streamLinks.length > 0 ? "Watch: " + streamLinks + "\n\nIt may take some time to appear on the above service(s)" : "No licensed streaming links available");
  }

  let format = "";
  if (entry.media.format)
    format = `Format: ${entry.media.format.includes("_") ? displayify(entry.media.format) : entry.media.format}`;

  let duration = "";
  if (entry.media.duration)
    duration = `Duration: ${parseTime(entry.media.duration * 60)}`;

  let studio = "";
  if (entry.media.studios && entry.media.studios.edges.length > 0)
    studio = `Studio: ${entry.media.studios.edges[0].node.name}`;

  return {
    color: entry.media.coverImage.color ? parseInt(entry.media.coverImage.color.substr(1), 16) : 43775,
    thumbnail: {
      url: entry.media.coverImage.large
    },
    author: {
      name: "AniList",
      url: "https://anilist.co",
      icon_url: "https://anilist.co/img/logo_al.png"
    },
    description,
    timestamp: date,
    footer: {
      text: `${format} • ${duration} • ${studio}`
    }
  };
}

const displayify = function(enumVal) {
  const words = enumVal.split("_");
  for (let i = 0; i < words.length; i++)
    words[i] = words[i].substr(0, 1) + words[i].toLowerCase().substr(1);

  return words.join(" ");
}

const parseTime = function (secs) {
  let seconds = parseInt(secs, 10);

  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);

  let ret = "";
  if (hours > 0)
    ret += hours + "h";
  if (minutes > 0)
    ret += (ret.length === 0 ? "" : " ") + minutes + "m";

  return ret;
}


module.exports = {
  query,
  getFromNextDays,
  getAnnouncementEmbed,
  displayify,
  parseTime
}
