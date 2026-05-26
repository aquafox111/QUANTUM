const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    playerButtons: (paused = false) => {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji('<:jk_backward:1500921320236646522>')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('play_pause')
                    .setEmoji(paused ? '<:icons_play:1500920780312285386>' : '<:pause:1500921090187202761>')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setEmoji('<:stop:1500921641826258958>')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('<:e_blackforward:1500921177613537362>')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('loop')
                    .setEmoji('<:black_update:1500921989248979115>')
                    .setStyle(ButtonStyle.Secondary)
            );
    }
};
