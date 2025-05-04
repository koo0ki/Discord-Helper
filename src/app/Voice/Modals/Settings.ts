import BaseInteraction from "@base/BaseInteraction";
import {
    GuildMember,
    MessageFlags,
    ModalSubmitInteraction,
    VoiceChannel,
} from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "settings",
    async (client: Client, modal: ModalSubmitInteraction<"cached">) => {
        const [_, second] = modal.customId.split(`_`);

        const member = modal.member as GuildMember;

        let voice = member.voice?.channel as VoiceChannel;

        if (voice.owner?.id !== member.id)
            return modal.reply({
                embeds: [
                    client.storage.embeds.default(
                        member,
                        "Управление",
                        `у вас **недостаточно** прав для управления ${voice}!`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });

        switch (second) {
            case "name": {
                voice.edit({ name: modal.fields.getField("value")?.value });
                return modal.reply({
                    embeds: [
                        client.storage.embeds.default(
                            member,
                            "Управление",
                            `Название комнаты было **успешно** изменено на **${modal.fields.getField("value")?.value}**!`,
                        ),
                    ],
                    flags: MessageFlags.Ephemeral,
                });
            }
            case "limit": {
                let value: number = Number(
                    modal.fields.getField("value")?.value,
                );
                if (isNaN(value))
                    return modal.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `Укажите **число**!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                if (value < 0 || value > 99)
                    return modal.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `Укажите **число** в диапазоне **0-99**!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });

                voice.edit({ userLimit: value });
                return modal.reply({
                    embeds: [
                        client.storage.embeds.default(
                            member,
                            "Управление",
                            `Максимальное кол-во участников в комнате было **успешно** изменено на **${value}**!`,
                        ),
                    ],
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
);
