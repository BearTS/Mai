# Documentation for Hosting Mai as a BOT

## Installing required programs
* NODEJS - You need to have at least v12 of the NodeJS to be able to host this bot. You can download latest version of node [here](https://nodejs.org/en/download)

In windows operating system, you need to download the windows build tools to be able to host this bot. Open a command prompt / powershell with Administrator privileges and run the following command:
```
npm install --global --production windows-build-tools
```

## Installing dependencies
You can Install dependencies by using the following command:
```
npm install
```

## Setting up Environment Variables
You cannot run the bot unless you set environment variables for the node process to work on. To do this, make a new file and name it `.env`. Edit its content with the following guidelines:
```
DISCORD_TOKEN=
MONGO_URI=
chatbot_id=
chatbot_key=
```
* `DISCORD_TOKEN` is the token used to log in your bot to discord. Get your own discord token [here](https://discord.com/developers/applications).
* `MONGO_URI` (optional) is used for using database reliant commands for the bot. Get your own mongoDB uri [here](https://www.mongodb.com/cloud/atlas).
* `chatbot_id` and `chatbot_key` (optional) are used for the chatbot functionality of the bot. To use the chatbot feature, you need to provide the both variables with valid id and key. Go [here](https://brainshop.ai) to get new id and key.

## Setting up the Initial Bot Activity
Bot activity is the text underneath the bot name on the user list. To set this, go to `src/bot.js` and edit the `name` and `type` under the `activity` variable. It should look like this:
```js
const activity = {
    name: 'https://mai-san.ml/',
    type: 'COMPETING'
};
```
Make sure the type is valid. Check valid activity types [here](https://discord.js.org/#/docs/main/stable/typedef/ActivityType). You can leave the settings as it is.

## Setting up the Database Config
| ⚠️ Please Skip this step if you did not set up a `MONGO_URI` on your env variable. |
| :------: |


Database config defines how the database connects to your bot. To set this, go to `src/bot.js` and edit the `dbConfig` variable. It should look like this:
```js
const dbConfig = {
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    autoIndex: false,
    poolSize: 5,
    family: 4
};
```
You can view valid options [here](http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect). You can leave the settings as it is.

## Setting up the Client Options
You can add set how your Discord Client behaves while its running. To set the client options, go to `src/bot.js` and pass additional parameters to the Client Constructor. It should look like this:
```js
const client = new Client({
    presence: activity,
    database: dbConfig,
    messageCacheLifetime: 43200,
    messageSweepInterval: 43200,
    allowedMentions: { parse: [ 'users' ]},
    shards: 'auto',

    prefix  : 'm!',
    owners  : ['545427431662682112'],
    uploadch: '728866550207086642'
});
```
Valid parameters can be found [here](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions). You can also leave the constructor as it is.

## Using the Language Services
Language Services provides string based translated responses for commands. It first identifies the user's predefined language and parses responses. It can be accessed on the command files via the second variable as a `LanguageSelector Class`. When logging this class, it should look like this:
```xl
 LanguageSelector {
   default: [ Object ],
   responses: [ Object ],
   Parameter: [ class Parameter ]
 }
```
`LanguageSelector#default` contains all the default responses for the command if ever a response in a specified language is not available. `LanguageSelector#responses` are the translated responses for the command. `Parameter` is a helper for building parameters. To be able to use these responses, you can use the class' `get` function, which takes in an object with parameters and id properties like below.

```js
const parameters = new LanguageSelector.Parameter({ '%AUTHOR%' : message.author.tag, '%PING%': client.ws.ping });
const response = LanguageSelector.get({ '$in': 'COMMANDS', id: 'PING_SUCCESS', parameters });
```
The parameters variable sets the variable in the language that must be replaced by a changing data. For example, every command can be used by different users, hence, you cannot set the username on the language.json. This is where parameters comes in. Notice that the parameter `%AUTHOR%` is going to replaced with the author tag.

The id variable locates a specific response registered under a command. For example:

```tcl
## in a json file
{
 "COMMANDS": {
##   ^ Selector for '$in' variable
   "PING_FAILED" : "%AUTHOR%, ping command failed%.",
   "PING_SUCCESS": "%AUTHOR%, ping is %PING% ms."
##     ^ Selector for `id` variable
 },
 "ERRORS":{
   "401": "Some error happened! %ERROR%"
 }
}
```

The `$in` option will get the responses from a specific category, in previous case, `$in` is set to `COMMANDS`, so it will look for a value under the `COMMANDS` category using the `id`. `id` is set to `PING_SUCCESS`, so it will get the value for `PING_SUCCESS`. You also notice that the response have some obscure-looking words, which are points for replacement of dynamic data you use in the bot. For example, author and ping is always different whenever a user uses them (ping value changes every minute, and author can be different every message), which is why they are designed to be replaced for every invoke of the command. The results should be similar to below
```tcl
Sakurajimai#6742, ping is 255 ms.
Sakurajimai#6742, ping is 215 ms.

OtherUser#0000, ping is 116 ms.
AnotherUser#1000, ping is 312 ms.
```
If parameters are not supplied, or incomplete, the class will simply send the raw response over. For example:
```tcl
%AUTHOR%, ping is %PING% ms.
## None of the parameters match with what is needed on the raw response string

%AUTHOR%, ping is 455 ms.
## %AUTHOR% is missing on the parameters object that was passed

Sakurajimai#6742, ping is %PING% ms.
## %PING% is missing on the parameters object that was passed
```
Malformed parameters will replace only a part of the raw response. For example:
```tcl
%Sakurajimai, ping is 455% ms.
## %AUTHOR% is passed on the parameter object as AUTHOR%, ping was passed on the parameter object as %PING
```

In cases where responses are unavailable for the selected language, the default language will instead be used. If the ID is not present on the default language, the response would be `❌ Error on parse-language: $in or ID_NOT_FOUND`.


## Editing Language
Languages can be found at `src/assets/language`, and will be loaded whenever the bot starts. You can edit the response but take consideration of the proper JSON syntax and the placement of the variables. Variables on the file starts and ends with a percent symbol, and are all in uppercase. Make sure that the id also corresponds to the proper response.


## Adding Language
You can add custom language on the folder `src/assets/language` and save it as a json file. For reference, you can duplicate any of the available language file, rename the duplicated with preferred code, and manually edit them one by one.

## Adding Commands
You can create your own command by considering the following properties when exporting the file:
```js
Command {
  name             : 'name',
  description      : 'No description.',
  aliases          : [],
  cooldown         : { time: 1000 },
  clientPermissions: [],
  permissions      : [],
  group            : 'fancy_group',
  parameters       : [],
  examples         : [],
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : true,
  run              : [Function: _run]
}
```
|Name|Default value|isOptional|Description|
|:---:|:---:|:---:|---|
`name`             |  `none`  | ❌ |The name of the command. Do not use whitespaces on the command name to avoid conflict with prefix parsing. Make your command name as short and appealing as possible. Avoid making command names like `runserverstatistics` or `searchanimefromanilist`.
`description`      |   `'No description'`    | ✔️ | A short description of your command.
`aliases`          |   `[]`   | ✔️ | The aliases for your command. Use meaningful aliases, like `latency` for `ping` command. You can add as many aliases as you want. Like name, do not use whitespaces on the aliases. Make sure there are no duplicates over command aliases.
`cooldown`         |   `{}`   | ✔️ | The cooldown for your command. You can add your command a timer so that a user cannot spam the command (especially if this command heavily relies on accessing external API). The data type is a number which represents time to wait in milliseconds.
`cooldown.time`    |  `0`    | ✔️ | The time to wait in milliseconds.
`clientPermissions`|  `[]`   | ✔️ | The permissions your bot must have in order to execute this command. Use this to avoid Permission errors. View valid permission flags [here](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS).
`permissions`      |   `[]`   | ✔️ | The permissions the users must have in order to execute this command. They are primarily useful for moderation commands such as ban and kick where only server moderators with necessary permissions are allowed to use.
`group`            |  `'unspecified'`  | ✔️ | For organization of command. Helpful when accessing commands by group. Not specifying group will automatically register it as 'unspecified'.
  `parameters`     |   `[]`   | ✔️ |
  `examples`       |   `[]`   | ✔️ | Visual examples of how a command can be used.
  `guildOnly`      |  `true`  | ✔️ | Prevent the command from being used on DMs.
  `ownerOnly`      | `false`  | ✔️ | Prevents non-owner from using the command.
  `adminOnly`      | `false`  | ✔️ | Shorthand method for `{ permissions: [ 'ADMINISTRATOR' ] }`. Prevents non-admin from using the command.
  `nsfw`           |  `false`  | ✔️ | Whether to disallow running the command on sfw channels.
`requiresDatabase` |  `true`  | ✔️ | Checks the database connection of the bot before proceeding to run the command.
`rankcommand`      |  `true`  | ✔️ | Does additional check for rank based commands.
`run`              | `_run()` | ❌ | the function to execute. Passed from the command manager with parameters (Message, Language, Args). Message being the Discord Message Object, Language being the LanguageSelector object, and args are the arguments of the message in array.

Commands should be placed on `src/commands/prefix` folder. For consistency, make a subfolder with it as the group name of the command.

## Adding Slash Commands
Slash commands are not yet supported on djs v12, the version this bot is currently using, however, you can now start making slash commands for the bot. To make one, you need to export an object with the properties `data` and `response`. data variable will be the object that will be posted on the guild/commands endpoint. response variable will be the function that gets executed whenever the command is used in a guild. By default, the guild won't have a slash command. To add slash commands, you can use guild#loadSlashCommands function which takes filter function as parameter to post guild commands. No filter means all slash commands will be loaded on the guild. Be wary that this method overwrites the previously registered commands on a guild. Check [this](https://discord.com/developers/docs/interactions/slash-commands) if you don't know how to construct a slash command. Example below:
```js
module.exports = {
  data: {
    name: 'ping',
    description: 'Pong poggers.'
  },
  response: (response, interaction) => {
    // You can console.log(response) if you're unsure what this variable is.

    // P.S. You cannot send an ephemeral message with embed and files.
    const content = response.user.client.ws.ping + ' ms';
    return response.send(content, { ephemeral: true });
  }
};
```

## Accessing the database


## Accessing the utilities
