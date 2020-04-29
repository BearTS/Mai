const { query } = require('./utils.js')
const alIdRegex = /anilist\.co\/anime\/(.\d*)/
const malIdRegex = /myanimelist\.net\/anime\/(.\d*)/
const { magenta } = require('chalk')

async function getMediaId(input) {

  let match = alIdRegex.exec(input);
  if (match)
    return parseInt(match[1]);

  match = malIdRegex.exec(input);

  if (!match)
    return null;

  return await query("query($malId: Int){Media(idMal:$malId){id}}", {malId: match[1]}).then(res => {
    if (res.errors) {
      console.log(`${magenta('[Mai-Promise ERROR]')} :\n${JSON.stringify(res.errors)}`);
      return;
    }
    return res.data.Media.id;
  });
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

module.exports = {
  getMediaId,
  sendWatchingList,
  promiseWhile

}
