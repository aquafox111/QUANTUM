const { SlashCommandBuilder, ContainerBuilder, SectionBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'clear',
    aliases: ['c'],
    description: 'Clear the music queue',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the music queue'),
    async execute(client, message, args) {
        const isInteraction = !!message.options;
        const guildId = isInteraction ? message.guildId : message.guild.id;
        const player = client.manager.players.get(guildId);
        const createResponse = (text, isError = false) => {
            const container = new ContainerBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${isError ? '> <:wrong:1500917527918678147> ' : '> <:Delete:1500925771437314099> Cleared '}${text}`)
            );
            return { components: [container.toJSON()], flags: MessageFlags.IsComponentsV2 };
        };

        if (!player) return message.reply(createResponse('<:blacklist:1500921270378959000> There is no music playing.', true));
        if (!player.queue.length) return message.reply(createResponse('<:wrong:1500917527918678147> The queue is already empty.', true));

        player.queue.clear();
        message.reply(createResponse('<:check_black:1500924675511812208> Cleared the music queue.'));
    }
};
