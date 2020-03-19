const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');
const utility = require('./../../utils/majUtils.js')

module.exports.run = async (bot, message, args) => {

  if (args.length === 0) return message.channel.send('Error: Please include a query to search with.').then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

fetch(`https://some-random-api.ml/pokedex?pokemon=${args.join('+')}`)
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        const embed = new RichEmbed()
        .setThumbnail(`https://i.imgur.com/2vxrrKw.gif`)
        .setDescription(`OOPS! Sorry Trainer!, seems like my POKEDEX cannot find **${args.join(' ')}**!`)
        .setColor(settings.colors.embedDefault);
        return new Promise(async(resolve,reject)=>{
          var hook = await message.channel.createWebhook(`Prof. Oak`,`https://giantbomb1.cbsistatic.com/uploads/square_small/8/84561/1465705-professor_oak_anime.png`)
          await hook.send(embed).catch(console.error);
          setTimeout(async function() {
              await hook.delete()
          }, 1000);
        })
      }else {
        const embed = new RichEmbed()
        .setAuthor(`#${json.id} ${json.name.toUpperCase()}`,'https://images-ext-2.discordapp.net/external/tqmeVg9xEWxDkURYe5So-KVG-4kCoIxyhDUcuRxBh9k/http/pngimg.com/uploads/pokemon_logo/pokemon_logo_PNG12.png')
        .setColor(settings.colors.embedDefault)
        .setThumbnail(json.sprites.animated)
        if (json.description){
          embed.addField("Description",json.description)
        }
        if (json.type){
          if (json.type.length>0){
            embed.addField("Type",json.type.join('\n'),true)
          }
        }
        if (json.abilities){
          if (json.abilities.length>0){
            embed.addField("Abilities",json.abilities.join('\n'),true)
          }
        }
        if (json.height){
          if (json.weight){
          embed.addField("Build",`Height: ${json.height}\nWeight: ${json.weight}`,true)
        } else {
          embed.addField("Height",json.height,true)
        }
        }else if (json.weight) {
          embed.addField("Weight",json.weight,true)
        }
        if (json.gender){
          if (json.gender.length>0){
            embed.addField("Gender",json.gender.join('\n'),true)
          }
        }
        if (json.egg_groups){
          if (json.egg_groups.length>0){
            embed.addField("Egg Group",json.egg_groups.join('\n')+".",true)
          }
        }
        if(json.stats){
        let stats = []
          if (json.stats.hp){
            stats.push(`HP: ${json.stats.hp}`)
          }
          if (json.stats.attack){
            stats.push(`ATK: ${json.stats.attack}`)
          }
          if (json.stats.defense){
            stats.push(`DEF: ${json.stats.defense}`)
          }
          if (json.stats.sp_atk){
            stats.push(`SP.ATK: ${json.stats.sp_atk}`)
          }
          if (json.stats.sp_def){
            stats.push(`SP.DEF: ${json.stats.sp_def}`)
          }
          if (json.stats.speed){
            stats.push(`SPEED: ${json.stats.speed}`)
          }
          if (stats.length>0){
            embed.addField("Stats",stats.join('\n'),true)
          }
        }
        if (json.family){
          if (json.family.evolutionStage){
            embed.addField("Evolution Stage",json.family.evolutionStage,true)
          }
        }
        if (json.generation){
          embed.addField("Generation",json.generation,true)
        }
        if (json.family){
          if (json.family.evolutionLine){
            if (json.family.evolutionLine.length>0){
            embed.addField("Evolution Line",json.family.evolutionLine.join(' 👉 '))
            }
          }
        }
        return message.channel.send(embed)
      }
    })
    .catch(err => {
      const embed = new RichEmbed()
      .setThumbnail(`https://i.imgur.com/2vxrrKw.gif`)
      .setDescription("OOPS! Sorry, seems like my POKEDEX is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`Prof. Oak`,`https://giantbomb1.cbsistatic.com/uploads/square_small/8/84561/1465705-professor_oak_anime.png`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    })
}

module.exports.help = {
  name: "pokedex",
  aliases: ["pokemon","pokémon","pokédex"],
	group: 'fun',
	description: 'Find a specific pokemon using the pokédex',
	examples: ['pokedex Snorlax','pokémon meowth'],
	parameters: ['query']
  }
