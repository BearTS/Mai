const fetch = require('node-fetch');

module.exports = async message => {

  const mentionregexp = new RegExp(`<@!?${message.client.user.id}>`);
  // Check if this instance allows the chatbot feature
  if (!message.client.features.includes('CHATBOT')){
    return Promise.resolve({ success: false });
  };

  // Check the message if the bot's mention was the first on content
  if (!mentionregexp.test(message.content.split(/ +/).filter(Boolean)[0])){
    return Promise.resolve({ success: false });
  };

  const input = message.content.replace(mentionregexp, '');

  // Check if the user has input other than mention
  if (!input.split(/ +/).filter(Boolean).length){
    return message.channel.send(`${message.author}, how may i help you?`)
    .then(() => { return { success: true }; })
    .catch(() => { return { success: false }; });
  };

  // Start typing
  message.channel.startTyping();

  // Get a response from the bot via api
  const res = await fetch(`https://some-random-api.ml/chatbot?message=${encodeURI(input)}`)
    .then(res => res.json())
    .catch(err => {});

  // Add a 3s delay
  await new Promise(_ => setTimeout(() => _(), 3000))

  // check if we get proper response
  if (res.response && !typeof res.response === 'string'){
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
  return message.channel.send(res.response, { replyTo: message })
  .then(() => {
    message.channel.stopTyping();
    return { success: true };
  })
  .catch(() => {
    message.channel.stopTyping();
    return { success: false };
  });
};
