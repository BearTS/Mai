![](https://files.catbox.moe/j4uzj2.png)
<p align="center"> #Mai </p>
#### A simple, multi-functional Discord bot by best girl written in discord.js 12.0.2 - Focuses more in anime..
##### [Click here to add Mai to your server](https://github.com/maisans-maid/MaiSakurajima) or [visit my website!](https://github.com/maisans-maid/MaiSakurajima)
***
# Contents
- [Action](#Action)
- [Anime](#Anime)
- [Bot](#Bot)
- [Core](#Core)
- [Fun](#Fun)
- [Moderation](#Moderation)
- [Music](#Music)
- [Owner](#Owner)
- [Setup](#Setup)
- [Utility](#Utility)
***
## Legend
Name | Description
----------------|--------------
`[]` | Indicates a mandatory argument, you must provide this for the command to work!
`<>` | Indicates an optional argument, you do not need to provide this for the command to work
***
### Command list
*   ##### Action
    * `m!baka <@member>` Send a Baka Gif / Image.
    * `m!hug  <@member>` Send a Hug Gif / Image.
    * `m!kiss <@member>` Send a Kiss Gif / Image.
    * `m!pat <@member>` Send a Pat Gif / Image.
    * `m!poke <@member>` Send a Poke Gif / Image.
    * `m!slap <@member>` Send a Slap Gif / Image.
    * `m!smug` Send a Smug Gif / Image.
    * `m!tickle <@member>` Send a Tickle Gif / Image.

    ###### [Back to ToC](#Contents)

*   ##### Anime
    * `m!anime [Anime Title]` Search for an anime via MyAnimeList.net
    * `m!animeme <reload>` Get a random meme from anime subreddit animemes.
    * `m!aniquote` Get a random anime quote.
    * `m!anitop <rank> <type>`Get the top anime from MAL via the supplied rank number, or random if none is supplied.
    * `m!character [Character Name]` Search for an anime character via MyAnimeList.net.
    * `m!manga [Manga Name]` Search for manga via MyAnimeList.net.
    * `m!nextairdate <Anime Title>` Search among currently airing anime and return their remaining time before next episode airs. Returns this day's schedule if none is specified.
    * `m!nsfw [Category]` Send a random anime nsfw image depending on the supplied category.
    * `m!schedule <day>` Send list of currently airing anime using the supplied day, or return this day's if none is supplied.

    ###### [Back to ToC](#Contents)

*   ##### Bot
    * `m!feedback [Message]` Send a feedback to Sakurajimai#6742 (my Dev)
    * `m!ping` Send the current ping of the bot in ms.
    * `m!stats` Send the stauts of the bot.

    ###### [Back to ToC](#Contents)

*   ##### Core
    * `m!cmd` Send all my available commands list.
    * `m!help [command name]` Sends full information on a specific command.
    * `m!invite` Sends my invite link.
    * `m!leaderboard` Send this guild's xp leaderboard (Server XP must be enabled).
    * `m!mai` Sends the image of the best girl.
    * `m!rank <@user>` Send the xp information of the mentioned user, or own if no mention is supplied.
    * `m!suggest [Suggestion Content]` Suggest something for the server.

    ###### [Back to ToC](#Contents)

*   ##### Fun
    * `m!advice` Send a random useless advice.
    * `m!birdfact` Send a random useless fact about birds.
    * `m!catfact` Send a random useless fact about cats.
    * `m!dogfact` Send a random useless fact about dogs.
    * `m!flip [head/tail]` Flip a coin.
    * `m!fortune` Send a random fortune.
    * `m!history` Send an important historical event on this day.
    * `m!horoscope [sign]` Send your daily horoscope.
    * `m!image [category]` Send an image depending on supplied category.
    * `m!joke` Send a joke.
    * `m!meme` Send a meme from selected subreddits.
    * `m!pandafact` Send a random useless fact about pandas.
    * `m!pokemon [Pokemon name]` Search for a pokemon on the pokedex.
    * `m!respect` Press F to pay respect.

    ###### [Back to ToC](#Contents)

*   ##### Moderation
    * `m!ban [@member]` Bans mentioned member.
    * `m!clear <category> [Quantity]` Bulk Delete messages from a channel.
    * `m!kick [@member]` Kicks mentioned member.
    * `m!lockdown` Mute / unmute @everyone role in the channel this command is used in.
    * `m!mute <minutes> [@member] <scope>` Mutes mentioned user for a given amount of minutes. Mutes indefinitely, if no duration is specified.
    * `m!respond [message ID]` Respond to a suggestion in `#suggestions`
    * `m!unmute [@member] <scope>`Unmutes mentioned user.

    ###### [Back to ToC](#Contents)

*   ##### Music

    ###### [Back to ToC](#Contents)

*   ##### Owner
    * `m!backdoor [Guild ID]` Send a server invite to the specified server.
    * `m!eval [code]` Evaluates JS code.
    * `m!execute [event]` Force Execute a d.js event
    * `m!fleave [guild ID]` Force leave a guild.

    ###### [Back to ToC](#Contents)

*   ##### Setup
    * `m!anischedule [subcommand]` Set up anime scheduling in your server.
      * `m!anischedule add [MAL / AniList Link]` Adds new anime to watch new episodes of.
      * `m!anischedule channel` Send the currently selected anime announcement channel.
      * `m!anischedule clean` Purge completed shows from the channel's watch list.
      * `m!anischedule help` Print out all available sub-commands with a short description.
      * `m!anischedule list` Display all anime being watched that are still airing.
      * `m!anischedule next` Display the next anime to air according to your list.
      * `m!anischedule remove [MAL / AniList Link]` Removes an anime from the list.
      * `m!anischedule setchannel` Set the channel for anime airdate announcements.
    * `m!automsg [subcommand]` Set up the auto messages for this server.
      * `m!automsg help` Print out all available sub-commands with a short description.
      * `m!automsg goodbye` Toggle goodbye messages on this server.
      * `m!automsg goodbyemsg` Set the goodbye message being sent by the bot.
      * `m!automsg welcome ` Toggle welcome messages on this server.
      * `m!automsg welcomemsg` Set the welcome message being sent by the bot.
    * `m!pointsystem [subcommands]` Set up the point system for this server.
      * `m!pointsystem economytoggle` Toggle economy system on/off for this server.
      * `m!pointsystem excemptedchannels` Display which channels have their xp disabled.
      * `m!pointsystem help` Print out all available sub-commands with a short description.
      * `m!pointsystem xpallow [channel]` Allow xp system on mentioned channel(s), if disabled.
      * `m!pointsystem xpexcempt [channel]` Excempt xp system on mentioned channel(s), if enabled.
      * `m!pointsystem xptoggle` Toggle the xp system on/off for this server

      ###### [Back to ToC](#Contents)

*   ##### Utility
    * `m!avatar <@user>` Send the Avatar of the mentioned user, or your own if none is mentioned.
    * `m!color <hex code>` Send the color of the supplied hex, or random if none.
    * `m!jisho [word]` Searches jisho for an accurate translation of the supplied japanese word.
    * `m!reddit [subreddit]` Fetch a random image from the supplied subreddit.
    * `m!steam <Game Name>` Send the game information of the supplied game from steam.
    * `m!time <city>` Send the current time in supplied city. Returns tokyo's time if none is supplied
    * `m!urban [word / phrase]` Get the urban definition of the supplied word / phrase.
    * `m!whois [user ID]` Get discord user information using the supplied ID

    ###### [Back to ToC](#Contents)

***
### Libraries and frameworks used
* [canvas ^2.6.1](https://github.com)
* [danbooru ^3.1.0](https://github.com)
* [discord.js ^12.2.0](https://github.com/discordjs/discord.js/) and [@discordjs/opus ^0.1.0](https://github.com/discordjs/discord.js/)
* [moment ^2.24.0](https://github.com/moment/moment/) and [moment-duration-format ^2.3.2](https://github.com/jsmreese/moment-duration-format)
* [mongoose ^5.9.10](https://github.com)
* [nekos-image-api ^1.3.3](https://github.com) and [nekos.life ^2.0.6](https://github.com)
* [node-fetch ^2.6.0](https://github.com/node-fetch/node-fetch)
* [node-kitsu ^1.1.1](https://github.com)
* [os ^0.1.1](https://github.com)
* [relevant-urban ^2.0.0](https://github.com)
* [wanakana ^4.0.2](https://github.com)
* [ytdl-core](https://github.com) and [ffmpeg-static](https://github.com)

###### [Back to ToC](#Contents)
