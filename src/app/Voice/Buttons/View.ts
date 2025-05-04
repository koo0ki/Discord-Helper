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
    "view",
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

        const response = await button.reply({
            flags: MessageFlags.Ephemeral,
            fetchReply: true,
            embeds: [
                client.storage.embeds.default(
                    member,
                    "Управление",
                    `**укажите** пользователя, для которого вы хотите **скрыть** или **раскрыть** ${voice}`,
                ),
            ],
            components: [
                new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                    userSelect,
                ),
            ],
        });

        const collector = new InteractionCollector(button.client, {
            message: response,
        });

        collector.on(
            "collect",
            async (i: UserSelectMenuInteraction<"cached">) => {
                const choosed = i.guild.members.cache.get(i.values[0]);

                if (
                    !voice ||
                    voice?.parent?.id !== client.config.room.privateCategoryId
                ) {
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `вы **не** находитесь в **комнате**!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (voice.owner?.id !== member.id) {
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
                }

                if (!choosed) {
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                "Данного участника **нет** на сервере!",
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (choosed.user.bot) {
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `вы **не** можете выбрать бота!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (choosed.id === member.id) {
                    return i.reply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `вы **не** можете **скрыть** / **раскрыть** ${voice} для себя!`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    });
                }

                let canView = voice.permissionOverwrites.cache
                    .get(choosed.id)
                    ?.allow.has("ViewChannel");
                let newPermission = !canView;

                await voice.permissionOverwrites.edit(choosed.id, {
                    ViewChannel: newPermission,
                });

                await i.update({
                    components: [
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            userSelect.setDisabled(true),
                        ),
                    ],
                    embeds: [
                        client.storage.embeds.default(
                            member,
                            "Управление",
                            `Комната ${voice} была **${newPermission ? "раскрыта" : "скрыта"}** для ${choosed.user}!`,
                        ),
                    ],
                });

                collector.stop("finish");
            },
        );

        collector.on("end", async (_, err) => {
            if (err !== "finish") {
                await button.deleteReply();
            }
        });
    },
);
