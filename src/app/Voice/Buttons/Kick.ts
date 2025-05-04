import BaseInteraction from "@base/BaseInteraction";
import {
    ActionRowBuilder,
    ButtonInteraction,
    GuildMember,
    InteractionCollector,
    MessageFlags,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction,
    VoiceChannel,
} from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "kick",
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

        let userSelect = client.storage.components.userSelect();

        let message = await button.reply({
            flags: MessageFlags.Ephemeral,
            fetchReply: true,
            embeds: [
                client.storage.embeds.default(
                    member,
                    "Управление",
                    `**укажите** пользователя, которого Вы хотите **выгнать** из ${voice}`,
                ),
            ],
            components: [
                new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                    userSelect,
                ),
            ],
        });

        const collector = new InteractionCollector(button.client, {
            message,
            componentType: 5,
        });

        collector.on(
            "collect",
            async (i: UserSelectMenuInteraction<"cached">) => {
                let choosed = i.guild.members.cache.get(i.values[0]);
                if (
                    !voice ||
                    voice?.parent?.id !== client.config.room.privateCategoryId
                )
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                "вы **не** находитесь в **комнате**!",
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                if (voice.owner?.id !== member.id)
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `у вас **недостаточно** прав для управления ${voice}!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });

                if (!choosed)
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `у вас **недостаточно** прав для управления ${voice}!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                if (choosed.id == member.id)
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `увы **не** можете **выгнать** себя!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                if (choosed.voice?.channel?.id !== voice.id)
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `**не** находится в **${voice}**!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });

                choosed.voice?.disconnect?.();

                i.update({
                    components: [
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            userSelect.setDisabled(true),
                        ),
                    ],
                    embeds: [
                        client.storage.embeds.default(
                            member,
                            "Управление",
                            `${choosed.user} был **выгнан** из ${voice}!`,
                        ),
                    ],
                });
                collector.stop("finish");
            },
        );

        collector.on("end", async (_, err) => {
            await (err == "finish" ? null : button.deleteReply());
        });
    },
);
