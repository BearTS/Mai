const nsfw = require('./../../utils/nsfw.js')
const client = require('nekos.life');
const Danbooru = require("danbooru");
const booru = new Danbooru();
const lewd = require('./../../assets/json/lewd.json');
const neko = new client();
const {RichEmbed} = require('discord.js')
const settings = require('./../../botconfig.json');
const ap = require('./../../assets/json/animporn.json');
const utility = require('./../../utils/majUtils.js')
const fetch = require('node-fetch');

module.exports.run = (bot,message,args) => {

  if (!message.channel.nsfw) return message.channel.send(nsfw.notANSFWChannel())

  if (args.length === 0) return message.channel.send('Error: Please include a category to search with.').then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

  const selection = ['anal','avatar','bj','blowjob','boobs','classic','cumarts','cumsluts','erofeet','erokemonomimi','erokitsune','eroneko','eroyuri','feetgif','femdom','futanari','girlsolo','girlsologif','hentai','holo','holoero','kemonomimi','keta','kitsune','kuni','lesbian','neko','nekogif','pussy','pussygif','pussyart','randomhentaigif','tits','trap','yuri'
  ]
  const allowedArguments = ['anal','avatar','bJ','blowJob','boobs','classic','cumArts','cumsluts','eroFeet','eroKemonomimi','eroKitsune','eroNeko','eroYuri','feetGif','femdom','futanari','girlSolo','girlSoloGif','hentai','holo','holoEro','kemonomimi','keta','kitsune','kuni','lesbian','neko','nekoGif','pussy','pussyGif','pussyArt','randomHentaiGif','tits','trap','yuri'
  ]
  const manualFetch = ['booty','nintendo','thighs','thigh','upskirt']
  const manualFetchArgs = ['AnimeBooty','NintendoWaifus','thighdeology','animelegs','UpskirtHentai']

  let embeddedMessage;

  if (selection.includes(args.join('').toLowerCase())) {
    query = selection.indexOf(args.join(' ').toLowerCase())

    neko.nsfw[allowedArguments[query]]().then(data=>{
      let x = new RichEmbed()
      .setColor(settings.colors.embedDefault)
      .setTitle(args.join('').toUpperCase())
      .setURL(data.url)
      .setImage(data.url)
      .setTimestamp()
      .setFooter(`Powered by: nekos-life`);

      embeddedMessage = x
    })
  }else if (args.join('').toLowerCase()==='anim'){
    embeddedMessage = `||${ap.urlsGIF[Math.floor(Math.random()*(ap.urlsGIF.length-1))]}||`
  }else if (args.join('').toLowerCase()==='booru'){
    booru.posts({tags: `rating:explicit`}).then((data) => {
      const index = Math.floor(Math.random() * (data.length-1))
      const post = data[index]
      var character = (post.tag_string_character) ? post.tag_string_character : `N/A`;
      var copyright = (post.tag_string_copyright) ? post.tag_string_copyright : `N/A`;
      var artists = (post.tag_string_artist) ? post.tag_string_artist : `N/A`;
      var meta = (post.tag_string_meta) ? post.tag_string_meta : `N/A`;
      var uploader = (post.uploader_name) ? post.uploader_name : `N/A`;
      var tags = (post.tag_string_general) ? utility.textTrunctuate(post.tag_string_general) : `N/A`;
      var image = post.file_url ;
      const booruImage = new RichEmbed()
      .setAuthor(`Random Booru: NSFW`)
      .setColor(settings.colors.embedDefault)
      .addField(`Character`,character,true)
      .addField(`Copyright`,copyright,true)
      .addField(`Artist/s`,artists,true)
      .addField(`Meta`,meta,true)
      .addField(`Uploader`,uploader,true)
      .addField(`Tags`,tags,true)
      .setImage(image)
      embeddedMessage = booruImage
    })
  }else if (manualFetch.includes(args.join('').toLowerCase())){
    query = manualFetch.indexOf(args.join(' ').toLowerCase())
    fetch(`https://www.reddit.com/r/${manualFetchArgs[query]}.json`).then(res => res.json())
    .then(json => {
  var  x = Math.floor(Math.random() * (json.data.children.length - 1))
  const uh = new RichEmbed()
  .setTitle(args.join('').toUpperCase())
  .setURL(json.data.children[x].data.url)
  .addField("Tags","Random, Images, Hentai, Booty, reddit")
  .setImage(json.data.children[x].data.url)
  .setColor(settings.colors.embedDefault);
  embeddedMessage = uh
})
  }else if (args.join('').toLowerCase()==='lewd'){
    var img = lewd.ecchi[Math.floor(Math.random() * (lewd.ecchi.length-1))]
    const uh = new RichEmbed()
    .setTitle(args.join('').toUpperCase())
    .setURL(img)
    .setImage(img)
    .setColor(settings.colors.embedDefault);
    embeddedMessage = uh
  }else if (args.join('').toLowerCase()==='wallpaper'){
    var img = lewd.wallpapers[Math.floor(Math.random() * (lewd.wallpapers.length-1))]
    const uh = new RichEmbed()
    .setTitle(args.join('').toUpperCase())
    .setURL(img)
    .setImage(img)
    .setColor(settings.colors.embedDefault);
    embeddedMessage = uh
  }else if (args.join('').toLowerCase()==='cmd'){
    const embed = new RichEmbed()
    .setColor(settings.colors.embedDefault)
    .setAuthor(`NSFW command working categories.`)
    .setDescription("`"+selection.concat(manualFetch,'anim','booru','lewd','wallpaper').sort().join("`, `")+"`.")
    embeddedMessage = embed
  }else return message.channel.send(`Sorry, **${args.join(' ')}** is not a valid nsfw category. Type ${"`"+settings.prefix}nsfw cmd`+"`"+` to view available categories.`)

  const WebhookNames = ["Ahegao-chan","MegaMilk","Suzukawa Rei","Shichijou Reika","Mitarai Keiko","Sakurai Erika","Belfast","Suzuhara Lulu","Kiryuu Coco","Sesshouin Kiara","Kagura","Kama","Hero-chan","Honoka","Iris Lilith Vandella Carmen","Christina Morgan","Astolfo","Takao","Mei (Pokemon)","Suomi kp31","PA15","Dola","Weiss Schnee","Baltimore","Hyun-sung Seo","Iris Yuma","Kashima","Bari","Taihou","Hamazake","Godguard Brodia","Miyamae Shiho","Nijou Aki"]
  const WebhookAvatars = ["9xmBvv0","waImdvo","Z8tKkV7","vSLv9bn","e5L8mSo","AkpcTPL","LHmztxh","bmEwo0n","GeA9smM","xXe89P2","C24HDRq","hUyIUqZ","0qdfV2S","up7vf1W","mncvryw","Ar7JUJ2","Rdul8FL","fdwdx4H","UYBktZQ","En3ilZ3","rLqMUFr","1diobww","epuvobD","4QakTZa","ATwO2dY","hkentp0","ISSklge","hMZ9zSl","DBearj5","8Su1c7B","h8f0God","dBN6nCu","usasrUN"]
  const random = Math.floor(Math.random()*(WebhookNames.length-1))

  return new Promise(async(resolve,reject)=>{
    var hook = await message.channel.createWebhook(WebhookNames[random],`https://i.imgur.com/${WebhookAvatars[random]}.gif`)
    await hook.send(embeddedMessage).catch(console.error);
    setTimeout(async function() {
        await hook.delete()
    }, 1000);
  })
}

module.exports.help = {
  name: 'nsfw',
  aliases: [],
	group: 'anime',
	description: 'Generate a random nsfw image using the query provided. Type `nsfw cmd` to return all the available categories for this command.',
	examples: ['nsfw thigh'],
	parameters: ['category']
}
