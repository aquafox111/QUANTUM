const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    ActionRowBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const { formatTime } = require('../utils/formatters');
const metadata = require('../utils/metadata');

module.exports = {
    createPlayerEmbed: (player) => {
        try {
            const track = player.queue.current;
            if (!track) return null;

            const total = track.length || 0;
            const title = metadata.cleanTitle(track.title);
            const shortTitle = metadata.truncate(title, 40);
            const author = metadata.cleanAuthor(track.author);
            const thumb = metadata.getHighResThumbnail(track.thumbnail);
            const requester = track.requester || { displayName: 'System', username: 'System', id: '0' };

            const paused = !player.playing;

            const container = new ContainerBuilder()
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(`## <a:black_vinyl:1500920467379191990> Now playing - ${shortTitle}`),
                            new TextDisplayBuilder().setContent(
                                `> - **Artist:** \`${author}\`\n` +
                                `> - **Duration:** \`${formatTime(total)}\`\n` +
                                `> - **Requester:** [${requester.displayName || requester.username}](https://discord.com/users/${requester.id})`
                            )
                        )
                        .setThumbnailAccessory(new ThumbnailBuilder().setURL(thumb))
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

            return {
                content: null,
                embeds: [],
                components: [container.toJSON()],
                flags: MessageFlags.IsComponentsV2
            };
        } catch (error) {
            console.error('Error in createPlayerEmbed:', error);
            return null;
        }
    }
};
