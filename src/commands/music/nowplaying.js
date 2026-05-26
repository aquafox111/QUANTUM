const {
    SlashCommandBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SectionBuilder
} = require('discord.js');
const { formatTime } = require('../../utils/formatters');
const metadata = require('../../utils/metadata');

module.exports = {
    name: 'nowplaying',
    aliases: ['nop'],
    description: 'Show the currently playing track with an elite banner UI',
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing track with an elite banner UI'),
    async execute(client, message, args) {
        try {
            const isInteraction = !!message.options;
            const guildId = isInteraction ? message.guildId : message.guild.id;

            const player = client.manager.players.get(guildId);
            if (!player || !player.queue.current) {
                const container = new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('> <:wrong:1500917527918678147> There is no music playing.')
                );
                const res = { components: [container.toJSON()], flags: MessageFlags.IsComponentsV2 };
                return isInteraction ? message.reply(res) : message.reply(res);
            }

            const track = player.queue.current;
            const currentPos = player.position;
            const total = track.length;

            const title = metadata.cleanTitle(track.title);
            const author = metadata.cleanAuthor(track.author);
            const thumb = metadata.getMediumThumbnail(track.thumbnail);
            const requester = track.requester || { displayName: 'System', username: 'System', id: '0' };
            const paused = !player.playing;

            const container = new ContainerBuilder()
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(thumb)
                    )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`### <a:black_vinyl:1500920467379191990> [${title}](${track.uri})`),
                    new TextDisplayBuilder().setContent(
                        `> \` ${author} \` · \` ${formatTime(currentPos)} / ${formatTime(total)} \``
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('previous').setEmoji('<:jk_backward:1500921320236646522>').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('play_pause').setEmoji(paused ? '<:icons_play:1500920780312285386>' : '<:pause:1500921090187202761>').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('stop').setEmoji('<:stop:1500921641826258958>').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('skip').setEmoji('<:e_blackforward:1500921177613537362>').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('loop').setEmoji('<:black_update:1500921989248979115>').setStyle(ButtonStyle.Secondary)
                    )
                );

            const res = {
                components: [container.toJSON()],
                flags: MessageFlags.IsComponentsV2
            };

            return isInteraction ? message.reply(res) : message.reply(res);
        } catch (err) {
            client.logger.error(`NP Command Error: ${err.stack}`);
            return message.reply({ content: 'An error occurred while displaying the current track.', ephemeral: true });
        }
    }
};
