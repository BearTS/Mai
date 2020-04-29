const { yellow, green } = require('chalk')
const allowedNames = ['sakurajima mai','mai sakurajima','mai-san','mai-san\'s maid','mai-senpai','mai']
const { ready } = require('../utils/anischedule/main.js')
const { user : { owner } } = require('../settings.json')
const { loadguilddata } = require('../utils/pointsystem/main.js')

module.exports = client => {

  console.log(`\n${green(client.user.username)} is now online!`)

  if (!allowedNames.includes(client.user.username.toLowerCase())) {

    console.log(`\n${yellow('[Mai-WARN]')} : You are not using Mai-san's name in your bot. This could hinder some of the commands of this bot.`)

  }

  client.user.setActivity('Seishun Buta Yarou',{

    type: 'STREAMING',
    url: 'https://twitch.tv/sby'

  })

//-------------------------------Points System-------------------------------//

  loadguilddata( client )

//--------------------------------AniSchedule--------------------------------//

   ready( client )

//------------------------------cache the owner-------------------------------//

  client.users.fetch(owner)
  
}
