const { Player } = require('discord-player');
const { Message, MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = class MusicPlayer extends Player {
  constructor(client){
    super(client);
  };

  init(){
    const playerEvents = readdirSync(join(__dirname, '..', 'util/player'))
    .filter(f => f.split('.').pop() === 'js');

    for (const file of playerEvents){
      const event = require(join(__dirname, '..', 'util/player', file));
      this.client.musicPlayer.on(file.split('.')[0], event.bind(null, this.client));
    };
  };

  sendError(type, message, ...args){
    if (!(message instanceof Message)){
      throw new TypeError(`The passed argument is not a valid Discord Message`);
    };

    function send({author, description, color}){
      return message.channel.send(
        new MessageEmbed()
        .setColor(color||'#f04e48')
        .setAuthor(author||null)
        .setDescription(description||'')
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
      );
    };

    switch(type){
      case 'VC_UNIQUE':
      send({
        author: 'You must be in the same voice channel as i am!',
        description: 'Baka Baka Baka'
      });
      break;
      case 'VC_NOT_FOUND':
      send({
        author: 'You must be in a voice channel',
        description: 'Where will I even play songs!!?!'
      });
      break;
      case 'NO_ARGS_TITLE':
      send({
        author: 'Tell me the name of the song.',
        description: 'Baka'
      });
      break;
      case 'NO_MUSIC_PLAYING':
      send({
        author: 'There is no music playing!',
        description: 'Baka'
      });
      break;
      case 'MUSIC_PAUSED':
      send({
        author: 'The music is already paused',
        description: 'Use `resume` to resume playing music.'
      });
      break;
      case 'MISSING_FILTER':
      send({
        author: 'Specify a valid filter to toggle',
        description: 'Try using `filters` to check all the filters available.'
      })
      break;
      case 'UNKNOWN_FILTER':
      send({
        author: 'The specified filter does not exist!',
        description: 'Try using `filters` to check all the filters available.'
      })
      break;
      case 'ONE_MUSIC_PLAYING':
      send({
        author: 'There is only one music playing!',
        description: 'Try using `stop` or `skip` to **stop** the current music.'
      })
      break;
      case 'RESUME_ALREADY_PLAYING':
      send({
        author: 'Music Player is already Playing!',
        description: 'There\'s nothing to resume!'
      })
      break;
      case 'NOT_A_NUMBER':
      send({
        author: 'Enter a valid number',
        description: `**${args.volume || 'Blank'}** is not a valid number!`
      })
      break;
      case 'INVALID_NUMBER':
      send({
        author: 'Volume is out of range!',
        description: `Please specify volume which is not less than 0 and not greater than 100.`
      })
      break;
      default:
      console.log('Music Error Handler: Out of Bounds~');
    };
  };
};
