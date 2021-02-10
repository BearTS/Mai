const { MessageEmbed } = require('discord.js');

module.exports = (args, oldEmbed) => {

  //temporarily removed support for Embed fields and timestamp
  const parameter = args.join(' ');
  const success = []; // Stores confirmation messages if embed values are succesfully saved
  const fails = []; // Stores fail messages if embed values provided cannot be saved
  const validModifiers =  [
    '{avatar}',
    '{avatarDynamic}',
    '{guildIcon}',
    '{guildIconDynamic}',
    '{guildOwnerAvatar}',
    '{guildOwnerAvatarDynamic}',
    '{userAvatar}',
    '{userAvatarDynamic}'
  ];

  const embedProps = {
    authorImageURL: matchFor('-author=image', parameter),
    authorName: matchFor('-author=name', parameter),
    authorURL: matchFor('-author=url', parameter),
    title: matchFor('-title', parameter),
    url: matchFor('-url', parameter),
    description: matchFor('-description', parameter),
    thumbnail: matchFor('-thumbnail', parameter),
    color: matchFor('-color', parameter),
    image: matchFor('-image', parameter),
    footerText: matchFor('-footer=text', parameter),
    footerImage: matchFor('-footer=image', parameter)
  };

  const urlServices = [
    'authorImageURL',
    'authorURL',
    'footerImage',
    'image',
    'thumbnail',
    'url',
  ];

  const limits = {
    title: 256,
    description: 2048,
    authorName: 256,
    footerText: 2048
  };

  //>>>>START>>>>>>>>*double checking variables**>>>>>>>>>//

  //------------testing validity of URL-------------------//
  for (const [key, val] of Object.entries(embedProps)){
    if (!urlServices.includes(key)){
      continue;
    } else if (!val){
      continue;
    } else {
      if (urlServices.includes(key)){
        if (!websiteTest(val)){
          if (validModifiers.includes(val.trim())){
            success.push(`**Embed#${key}** has successfully been set!`)
          } else {
            embedProps[key] = undefined;
            fails.push(`The provided **${key}** is invalid. Please ensure the validity of the URL.`);
          };
        } else {
          success.push(`**Embed#${key}** has successfully been set!`);
        };
      } else {
        // Do nothing..
      };
    };
  };

  //-----------testing validity of color------------------//

  if (embedProps.color && !embedProps.color.match(/#[a-f0-9]{6}/i)){
    embedProps.color = undefined;
    fails.push('The provided **Color Hex Code** is invalid. Please make sure you are passing a valid Hex Code');
  } else if (embedProps.color){
    success.push('**Embed#color** has successfully been set!')
  };

  //----------testing string lengths-----------------------//

  for (const [key, val] of (Object.entries(embedProps))){
    if (!['authorName', 'title', 'description', 'footerText'].includes(key)){
      continue;
    } else if (!val){
      continue;
    } else if (val.length > limits[key]){
      embedProps[key] = undefined;
      fails.push(`Embed **${key}** is only limited to ${limits[key]} characters. Yours have ${val.length}`);
    } else {
      success.push(`**Embed#${key}** has successfully been set!`);
    };
  };

  //>>>>>END>>>>>>>>>>*double checking variables*>>>>>>>>>>//
  //>>>>>>>>>**Check if new Outgoing data are present>>>>>>//

  if (!success.length){
    if (!fails.length){
      return { error: 'NO_EMBED_OPTIONS', success, fails };
    } else {
      return { error: 'EMBED_OPTIONS_INVALID', success, fails };
    };
  } else {

    const embed = new MessageEmbed(oldEmbed || {})

    embed.setAuthor(
      embedProps.authorName || embed.author?.name || '',
      embedProps.authorImageURL || embed.author?.iconURL || null,
      embedProps.authorURL || embed.author?.url || null
    )
    .setTitle(
      embedProps.title || embed.title
    )
    .setURL(
      embedProps.url || embed.url
    )
    .setThumbnail(
      embedProps.thumbnail || embed.thumbnail?.url || null
    )
    .setDescription(
      embedProps.description || embed.description || ''
    )
    .setImage(
      embedProps.image || embed.image?.url || null
    )
    .setColor(
      embedProps.color || embed.color
    )
    .setFooter(
      embedProps.footerText || embed.footer?.text || '',
      embedProps.footerImage || embed.footer?.iconURL || null,
    );

    // checking for modifiers in replacement to urls
    // modifiers are automatically converted to null because the class considers
    // modifiers as non-valid URL
    if (validModifiers.includes(embedProps.authorImageURL))
    embed.author.iconURL = embedProps.authorImageURL;

    if (validModifiers.includes(embedProps.thumbnail))
    embed.thumbnail.url = embedProps.thumbnail

    if (validModifiers.includes(embedProps.image))
    embed.image.url = embedProps.image

    if (validModifiers.includes(embedProps.footerImage))
    embed.footer.iconURL = embedProps.footerImage;

    return { embed, success, fails };
  };
};

//matches anything inside the bracket after -author=image:, -author=name:, etc
//matches "https://i.imgur.com/asdasx.png" in "-author=image:[https://i.imgur.com/asdasx.png]"
//returns undefined if matches nothing
function matchFor(option, str){
  const regex = '(?<=' + option + ':\\[)[\\s\\S]+?(?=])';
  const res = str.match(new RegExp (regex, 'g')) || [];
  return res[0];
};

//tests if the passed string is a valid url format or not
//returns a Boolean
function websiteTest(str){
  if (str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))
  return true
  return false
};
