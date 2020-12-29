require('dotenv').config();
const fetch = require('node-fetch');
const { chatbot_id, chatbot_key } = process.env;

module.exports = async message => {

  const mentionregexp = new RegExp(`<@!?${message.client.user.id}>`);
  // Check if this instance allows the chatbot feature
  if (!message.client.features.includes('CHATBOT')){
    return Promise.resolve({ success: false });
  };

  // Check the message if the bot's mention was the first on content
  // or the message was a reply from the bot's previous cached message
  if (!mentionregexp.test(message.content.split(/ +/).filter(Boolean)[0])){
    const ref_id = message.reference?.messageID;
    const ref_msg = message.channel.messages.cache.get(ref_id);
    if (ref_msg?.author.id !== message.client.user.id){
      return Promise.resolve({ success: false });
    };
  };

  const input = message.content.replace(mentionregexp, '');

  // Check if the user has input other than mention
  if (!input.split(/ +/).filter(Boolean).length){
    return message.channel.send(`How may i help you?`, { replyTo: message })
    .then(() => { return { success: true }; })
    .catch(() => { return { success: false }; });
  };

  // Start typing
  message.channel.startTyping();

  // Get a response from the bot via api
  const res = await fetch(`http://api.brainshop.ai/get?bid=${chatbot_id}&key=${chatbot_key}&uid=${message.author.id}&msg=${encodeURIComponent(input)}`)
    .then(res => res.json())
    .catch(() => {});

  // Add a 3s delay
  await new Promise(_ => setTimeout(() => _(), 3000))

  // check if we get proper response
  if (typeof res.cnt !== 'string'){
    return message.channel.send('???', { replyTo: message })
    .then(() => {
      message.channel.stopTyping();
      return { success: true };
    })
    .catch(() => {
      message.channel.stopTyping();
      return { success: false };
    });
  };

  // send the response
  return message.channel.send(res.cnt , { replyTo: message })
  .then(() => {
    message.channel.stopTyping();
    return { success: true };
  })
  .catch(() => {
    message.channel.stopTyping();
    return { success: false };
  });
};
