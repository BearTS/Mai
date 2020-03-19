const Discord = require('discord.js');
const bot_settings = require('./botconfig.json');
const fs = require('fs');
const bot = new Discord.Client()
bot.commands = new Discord.Collection()
bot.musicQueue = new Discord.Collection()
bot.mongoose = require('./utils/mongoose')

fs.readdir('./commands/actions/',(err,files)=>{
  if (err){
    console.log(`Cannot find the directory /actions/`)
  } else {

  let jsFile = files.filter(f => f.split(".").pop()==='js')
  if (jsFile.length<=0){
    console.log("The action command database are empty.")
  } else {
    jsFile.forEach((f,i)=>{
      let props = require(`./commands/actions/${f}`);
      bot.commands.set(props.help.name,props)
    })
    console.log(`${jsFile.length} action commands were loaded into module.`)
    }
  }
})

fs.readdir("./commands/anime/", (err,files)=>{
  if (err){
    console.log('Cannot find the directory /anime/')
  } else {

  let jsFile = files.filter(f => f.split(".").pop()==="js")
  if (jsFile.length <=0){
    return console.log("The anime command database are empty.")
  } else {
      jsFile.forEach((f,i)=>{
        let props = require(`./commands/anime/${f}`);
        bot.commands.set(props.help.name, props)
      });
  console.log(`${jsFile.length} anime commands successfully loaded into module.`)
    }
  }
})

fs.readdir("./commands/core/",(err,files)=>{
    if (err){
      console.log('Cannot find the directory /core/')
    } else {

    let jsFile = files.filter(f => f.split(".").pop()==="js")
    if (jsFile.length <=0){
      return console.log("The core command database are empty.")
    } else {
        jsFile.forEach((f,i)=>{
          let props = require(`./commands/core/${f}`);
          bot.commands.set(props.help.name, props)
        });
    console.log(`${jsFile.length} core commands successfully loaded into module.`)
      }
    }
})

fs.readdir('./commands/fun/',(err,files)=>{
  if (err){
    console.log(`Cannot find the directory /fun/`)
  } else {
  let jsFile = files.filter(f => f.split(".").pop()==='js')
  if (jsFile.length<=0){
    console.log("The fun command database are empty.")
  } else {
    jsFile.forEach((f,i)=>{
      let props = require(`./commands/fun/${f}`);
      bot.commands.set(props.help.name,props)
    })
    console.log(`${jsFile.length} fun commands were loaded into module.`)
    }
  }
})

fs.readdir('./commands/moderator/',(err,files)=>{
  if (err){
    console.log(`Cannot find the directory /moderator/`)
  } else {
  let jsFile = files.filter(f => f.split(".").pop()==='js')
  if (jsFile.length<=0){
    console.log("The modarator command database are empty.")
  } else {
    jsFile.forEach((f,i)=>{
      let props = require(`./commands/moderator/${f}`);
      bot.commands.set(props.help.name,props)
    })
    console.log(`${jsFile.length} modeartor commands were loaded into module.`)
    }
  }
})

fs.readdir('./commands/utility/',(err,files)=>{
  if (err) {
    console.log(`Cannot find the directory /utility/`)
  } else {
    let jsFile = files.filter(f => f.split(".").pop()==='js')
    if (jsFile.length<=0){
      console.log("The utility command database are empty.")
    } else {
      jsFile.forEach((f,i)=>{
        let props = require(`./commands/utility/${f}`);
        bot.commands.set(props.help.name,props)
      })
      console.log(`${jsFile.length} utility commands were loaded into module.`)
    }
  }
})

fs.readdir('./commands/music/',(err,files)=>{
  if (err) {
    console.log(`Cannot find the directory /music/`)
  } else {
    let jsFile = files.filter(f => f.split(".").pop()==='js')
    if (jsFile.length<=0){
      console.log("The music command database are empty.")
    } else {
      jsFile.forEach((f,i)=>{
        let props = require(`./commands/music/${f}`);
        bot.commands.set(props.help.name,props)
      })
      console.log(`${jsFile.length} music commands were loaded into module.`)
    }
  }
})

fs.readdir("./events/", (err,files)=>{
  if (err) console.log(err)

  let evtFiles = files.filter(f=>f.split(".").pop()==="js")
  if (evtFiles.length<=0){
    return console.log(`Couldn't find events`);
  }

  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    console.log(`${eventName} event loaded!`)
    const event = require(`./events/${file}`)
    bot.on(eventName, event.bind(null, bot));
  })
})

process.on('unhandledRejection', err => {
	console.error('Uncaught Promise Error! \n' + err.stack);
});

bot.mongoose.init();
bot.login(process.env.BOT_TOKEN)
