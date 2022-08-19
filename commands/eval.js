'use strict';

const {
    ActionRowBuilder,
    ButtonBuilder,
    codeBlock,
    EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
} = require('discord.js');
const { inspect } = require('util');
const fetch = require('node-fetch');

const command = new SlashCommandBuilder()
.setName('eval')
.setDescription('Evaluate arbitrary javascript code. [DEV_TOOL]')
.addStringOption(option => option
    .setName('code')
    .setDescription('The code to evaluate')
    .setRequired(true)
)
.addBooleanOption(option => option
    .setName('display')
    .setDescription('Whether to display the result as a non-ephemeral message')
)
.setDefaultMemberPermissions(0); // disable the command by default

module.exports = {
    builder: command,
    run: async (client, interaction) => {

        const authorizedIds = process.env.EVAL_ACCESS?.split(',') || [];
        if (!authorizedIds.includes(interaction.user.id)) return interaction.reply({
            ephemeral: true,
            content: '`Error:` You are not permitted to use this command.'
        });

        const code = interaction.options.getString('code');
        const ephemeral = !interaction.options.getBoolean('show');
        const embed = new EmbedBuilder()
            .addFields({
                name: '📥 Input',
                value: codeBlock('js', clean(code), 1000)
            });

        try {
            let promise, output, download, type, color;
            let evaled = eval(code);
            let raw = evaled;

            if (evaled instanceof Promise){
                await interaction.deferReply({ ephemeral });
                promise = await evaled.then(res => ({
                    resolved: true,
                    body: inspect(res, { depth: 0 })
                }))
                .catch(err => ({
                    resolved: false,
                    body: inspect(res, { depth: 0 })
                }));
            };

            evaled = typeof evaled !== 'string' ? inspect(evaled, { depth: 0 }) : evaled;
            output = clean(promise ? promise.body : evaled);
            type = promise ? `Promise (${promise.resolved ? 'Resolved' : 'Rejected'})` : (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1);
            color = promise ? promise.resolved ? 'Green' : 'Red' : [26, 174, 125];

            const elapsed = Math.abs(Date.now() - interaction.createdTimestamp);
            const row = new ActionRowBuilder();

            embed.setColor(color)
              .addFields({
                  name: '📤 Output',
                  value: output.length > 1_000 ? codeBlock('fix', `Exceeded 1000 characters\nCharacter Length: ${output.length}`) : codeBlock('js', output)
              })
              .setFooter({ text: `Type: ${type}\u2000•\u2000 Evaluated in ${(elapsed / 1000).toFixed(2)}s.` });

            if (output.length > 1_000){
                const hastebin = await fetch('https://hastebin.com/documents', {
                    method: 'POST',
                    body: output,
                    headers: { 'Content-Type': 'text/plain' }
                });
                const { key } = await hastebin.json();
                const button = new ButtonBuilder()
                  .setLabel('View Output in hastebin')
                  .setStyle('Link');

                row.addComponents(button
                    .setURL(`https://hastebin.com/raw/${key}`)
                    .setDisabled(hastebin.status !== 200)
                );
            };

            const response = {
                embeds: [ embed ],
                ephemeral: ephemeral,
            };

            if (output.length > 1_000){
                response.components = [row];
            };

            if (interaction.deferred){
                return interaction.editReply(response);
            } else {
                return interaction.reply(response);
            };

        } catch (error) {

            const elapsed = Math.abs(Date.now() - interaction.createdTimestamp);
            embed.setColor('Red')
              .addFields({
                  name: '📤 Output',
                  value: codeBlock('ls', truncate(error.stack.split(process.cwd()).join('Mai:\\'), 1000))
              })
              .setFooter({ text: `Type: ${error.name}\u2000•\u2000 Evaluated in ${(elapsed / 1000).toFixed(2)}s.` });

            const response = {
                embeds: [ embed ],
                ephemeral: ephemeral,
            };

            if (interaction.deferred){
                return interaction.editReply(response);
            } else {
                return interaction.reply(response);
            };
        };
    }
};

function clean(str){
    return String(str).replace(/`|@/g, char => (
        `${char}${String.fromCharCode(8203)}`
    ));
};

function truncate(str = '', length = 100, end = '...'){
    return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
};
