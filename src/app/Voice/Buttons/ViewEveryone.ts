import BaseInteraction from "@base/BaseInteraction";
import {
    ButtonInteraction,
    GuildMember,
    MessageFlags,
    PermissionFlagsBits,
    VoiceChannel,
} from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "view-everyone",
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
        if (permissions.has(PermissionFlagsBits.ViewChannel)) {
            await voice.permissionOverwrites.edit(button.guild.id, {
                ViewChannel: false,
            });
            await button.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `Комната ${voice} была успешно **скрыта** для **всех**!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await voice.permissionOverwrites.edit(button.guild.id, {
                ViewChannel: true,
            });
            await button.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `Комната ${voice} была успешно **раскрыта** для **всех**!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
);
