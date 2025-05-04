import BaseInteraction from "@base/BaseInteraction";
import {
    ActionRowBuilder,
    ButtonInteraction,
    ChannelType,
    GuildMember,
    InteractionCollector,
    MessageFlags,
    PermissionFlagsBits,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction,
    VoiceChannel,
} from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "lock-everyone",
    async (client: Client, button: ButtonInteraction<"cached">) => {
        const member = button.member as GuildMember;

        let voice = member.voice?.channel as VoiceChannel;

        if (voice.owner?.id !== member.id)
            return button.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `у вас **недостаточно** прав для управления ${voice}!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });

        let permissions = voice.permissionsFor(button.guild.id) as any;
        if (permissions.has(PermissionFlagsBits.Connect)) {
            await voice.permissionOverwrites.edit(button.guild.id, {
                Connect: false,
            });
            await button.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `Комната ${voice} была успешно **закрыта** для **всех**!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await voice.permissionOverwrites.edit(button.guild.id, {
                Connect: true,
            });
            await button.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `Комната ${voice} была успешно **открыта** для **всех**!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
);
