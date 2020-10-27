var fetch = require("node-fetch")
const { URLSearchPArams } = require('url')

module.exports.dblPost = (client, delay = 300000) => {
  const params = new URLSearchParams();

  function post(){
    params.append('guilds', client.guilds.cache.size);
    params.append('users', client.users.cache.size);

    fetch(`https://discordbotlist.com/api/v1/bots/${client.user.id}/stats`, {
        method: 'post',
        path: { 'id': client.user.id},
        body: params,
        headers: { 'Authorization' : process.env.DBL_Auth }
    }).then(res => res.json())
    .then(json => client.emit('DBLPostStatistics', json))
  }

  post()

  setInterval(() => post(), isNaN(delay) || delay < 200000 ? 300000 : delay)

}
