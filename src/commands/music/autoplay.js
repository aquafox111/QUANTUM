const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');

const createMsg = (text) => ({
    components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(text)).toJSON()],
    flags: MessageFlags.IsComponentsV2
});

module.exports = {
    name: 'autoplay',
    aliases: ['ap', 'auto'],
    description: 'Toggle autoplay for the current session',
    premium: true,
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay for the current session'),
    async execute(client, message, args) {
        const isInteraction = !!message.options;
        const guildId = isInteraction ? message.guildId : message.guild.id;
        const player = client.manager.players.get(guildId);
        if (!player) return message.reply(createMsg('> <:wrong:1500917527918678147>  No music is currently playing.'));

        const vc = message.member.voice.channel;
        if (!vc || vc.id !== player.voiceId) return message.reply(createMsg('> <:wrong:1500917527918678147>  You must be in the same voice channel as the bot.'));

        const current = player.data.autoplay || false;
        player.data.autoplay = !current;

        return message.reply(createMsg(`> <:check_black:1500924675511812208> Autoplay has been **${!current ? 'enabled' : 'disabled'}**.`));
    }
};
