import BaseInteraction from "@base/BaseInteraction";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    GuildMember,
    MessageFlags,
    StringSelectMenuInteraction,
    VoiceChannel,
} from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "app-select",
    async (client: Client, menu: StringSelectMenuInteraction<"cached">) => {
        const member = menu.member as GuildMember;

        let voice = member.voice?.channel as VoiceChannel;

        if (voice.owner?.id !== member.id)
            return menu.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `у вас **недостаточно** прав для управления ${voice}!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });

        await menu.deferReply({ flags: MessageFlags.Ephemeral });
        const id = menu.values[0];
        let Invite = await client.discordTogether.createTogetherCode(
            voice.id,
            id,
        );

        if (Invite) {
            const button = new ButtonBuilder()
                .setLabel("Запустить")
                .setURL(Invite.code)
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button,
            );

            await menu.editReply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `нажмите на кнопку ниже, чтобы **запустить** игру.`,
                    ),
                ],
                components: [row],
            });
        }
    },
);
