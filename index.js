const start = Date.now()
console.log('Starting the bot...');
require('dotenv').config();

const { readdirSync } = require('fs');
const { join } = require('path');
const { BugReporter } = require('./helper');
const Client = require('./struct/Client');

const mai = new Client({
	clientSettings: {
			disableMentions: 'everyone'
		,	presence: {
				activity: {
						name: 'Seishun Buta Yarou'
					, type:'STREAMING'
					, url: 'https://twitch.tv/sby'
				}
			}
		,	restTimeOffset: 100
	}
	,	bootTimeStart: start
	, chatbot: true
	, debug: '764083507542491177'
	,	enableDatabase: true
	,	mongoSettings: {
			useUnifiedTopology : true
		, useNewUrlParser: true
		, autoIndex: false
		, poolSize: 5
		, connectTimeoutMS: 10000
		, family: 4
	}
	,	commandgroups: [
			'action'
		, 'anime'
		, 'bot'
		, 'core'
		,	'economy'
		, 'fun'
//	, 'games'
		, 'moderation'
		, 'owner'
		, 'setup'
		, 'utility'
	]
	,	collections: [
			'memes'
		, 'anidailyrec'
		,	'economy'
		, 'mangadailyrec'
		, 'quiz'
		, 'xp'
	]
	,	prefix: 'm!'
	,	uploadchannel: '728866550207086642'
	,	owners: ['545427431662682112']
	,	mongoPassword: process.env.MONGO
	,	token: process.env.TOKEN,
});

for (const dir of mai.config.commanddir) {
	for (const file of readdirSync(join(__dirname, 'commands', dir)).filter(f => f.split('.').pop() === 'js'))
		mai.commands.add(require(`./commands/${dir}/${file}`));
}

for ( const event of readdirSync(join(__dirname, 'events')).filter( f => f.split('.').pop() === 'js'))
  mai.on(event.split('.')[0], require(`./events/${event}`).bind(null, mai));


process.on('unhandledRejection', (err) => process.emit('reportBugs', mai, err, null))

process.on('reportBugs', (client, err, message, command) => BugReporter(mai, err, message, command))

//process.on('rejectionHandled', () => null)


mai.connect(); //login the bot and the database
