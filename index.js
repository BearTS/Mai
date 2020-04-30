/*  About the Bot
*
*     Code created by Sakurajimai#6742 with the help of other open sourced discord.js bots!
*   After 6 months of coding, i finally made my first ever functional bot on discord, this
*   is however, does not guarantee that potential errors doesn't exist on this code. If
*   you see any irregularities on this code, please do lighten me up (LOL), im still open
*   to learning.
*
*/

/* About the author
*
*    Hi! I go by the name Sakurajimai on most of my accounts. I am NOT a programming student
*   so please don't laugh at my current coding skills. I learned nodejs and javascript
*   through some google searching  and some good kind people on discord programming servers. I am
*   actually a Civil Engineering student at 2nd year upon writing this code.
*
*/

/* I have created a website lmao
*
* The website for this repository is located at https://maisans-maid.github.io/mai.moe. Well
* I didn't really create a website from scratch, I just downloaded a template and edited it a
* bit. So. Yea, at least she has a website now. mehehe.
*
*/

//-----------------------Require Package for logging-------------------------//

const { green, yellow, red, magenta, cyan } = require('chalk')

//------------------------------System Messages------------------------------//

console.log(`\n\n<----------- Booting up ${cyan('Mai-Bot')} ----------->`)
console.log(`Upon booting, you might notice some of these log headers:`)
console.log(`${yellow('[Mai-WARN]')} - Warn about some errors in the code, it can be dismissed.`)
console.log(`${green('[Mai-SUCCESS]')} - Alerts that a process has been successfully executed.`)
console.log(`${red('[Mai-FAIL]')} - Alerts about a fatal error that might make the bot dysfunctional. Follow instructions, this can't be dismissed.`)
console.log(`${magenta('[Mai-Promise ERROR]')} - Appears when debugging mode is on - Alert when a promise is being rejected which are not caught.`)
console.log(`--------------------------------------------\n\n`)

//------------------------Require the Necessary Packages---------------------//

const { Client, Collection } = require('discord.js')
const { readdir } = require('fs')
const { commanddir, prodtoken } = require('./settings.json')

//------------------------------Initialize Client----------------------------//

const mai = new Client()
mai.mongoose = require('./models/mongoose.js')

//-------------------------Add necessary Collections-------------------------//

mai.commands = new Collection()
mai.musicQueue = new Collection()
mai.cooldowns = new Collection()
mai.guildsettings = new Collection()
mai.xp = new Collection()
mai.memes = new Collection()
mai.news = new Collection()

//--------------------------Load Commands to Client--------------------------//

commanddir.forEach( dir => {

  readdir(`./commands/${dir}`, (err,files) => {

    if (err) {

      console.log(`${yellow('[Mai-WARN]')} : Couldn't find the Directory /${dir}/`)

    } else {

      let jsfile = files.filter( f => f.split(".").pop() === 'js')

      if (!jsfile.length) {

        console.log(`${yellow('[Mai-WARN]')} : The ${dir} command database is empty!`)

      } else {

        jsfile.forEach( (f,i) => {

          let props = require(`./commands/${dir}/${f}`)
          mai.commands.set(props.config.name, props)

        })

        console.log(`${green('[Mai-SUCCESS]')} : ${jsfile.length} ${dir} commands were successfully attached to Client.`)

      }
    }
  })
})

//---------------------------Bind Events to CLient---------------------------//

readdir(`./events/`, (err,files) => {

  if (err) return console.log(`${red('[Mai-FAIL]')} : I couldn't read ./events/ directory. Make sure it exist.`)

  let evtfiles = files.filter( f => f.split(".").pop() === 'js')

  if (!evtfiles.length) {

    console.log(`${red('[Mai-FAIL]')} : No events were found. Please make sure to add at least 1 event and then restart the bot.`)

  } else {

    evtfiles.forEach( evt => {

      const eventName = evt.split(".")[0];
      const event = require(`./events/${evt}`)
      mai.on(eventName, event.bind(null, mai))

    })

    console.log(`${green('[Mai-SUCCESS]')} : ${evtfiles.length} events now ready to go online!`)
  }
})

//--------------------------------Debugging----------------------------------//

process.on('unhandledRejection', err => {
  console.error(`${magenta('[Mai-Promise ERROR]')} : ${err}`)
})

//------------------------Initialize Database and Log In---------------------//

mai.mongoose.init();

mai.login(process.env.MAI_TOKEN).catch( (err) => {

  if (err.name === 'Error [TOKEN_INVALID]') console.log(`${red('[Mai-FAIL]')} : The token you provided is not valid! Please get valid token @ https://discordapp.com/developers/applications ~ <3`)

  else if (err.name === 'FetchError') console.log(`${red('[Mai-FAIL]')} : Could not connect to internet. Please secure a stable connection. ~ <3`)

  else console.log(`${red('[Mai-FAIL]')} : ${err.name}: ${err.message}`)

  process.exit()

})
