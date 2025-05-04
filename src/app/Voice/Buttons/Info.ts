import BaseInteraction from "@base/BaseInteraction";
import {
    ButtonInteraction,
    ChannelType,
    GuildMember,
    InteractionCollector,
    MessageFlags,
    VoiceChannel,
} from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "info",
    async (client: Client, button: ButtonInteraction<"cached">) => {
        const member = button.member as GuildMember;

        let voice = member.voice?.channel as VoiceChannel;

        const response = await button.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [
                client.storage.embeds.default(
                    member,
                    "Управление",
                    "выберите **приватную комнату**",
                ),
            ],
            components: [
                client.storage.components.menuChannel(
                    "info",
                    client.config.room.placeholder.channel,
                ),
                client.storage.components.buttonRoom(
                    !Boolean(member.voice?.channel),
                ),
            ],
            fetchReply: true,
        });

        const collector = new InteractionCollector(button.client, {
            message: response,
        });

        collector.on("collect", async (i: any) => {
            i.deferUpdate();
            if (i.isChannelSelectMenu()) {
                const channel = i.channels.first() as VoiceChannel;
                if (
                    !channel ||
                    channel.type !== ChannelType.GuildVoice ||
                    !channel.owner
                ) {
                    return button.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                member,
                                "Управление",
                                `**выбранный** голосовой канал **не** найден или **не** является **приватной комнатой**`,
                            ),
                        ],
                        components: [],
                    });
                }

                return button.editReply({
                    embeds: [
                        client.storage.embeds.infoRoom(
                            button.member as GuildMember,
                            channel,
                        ),
                    ],
                    components:
                        client.storage.components.checkMembersPermission(
                            voice.id,
                        ),
                });
            } else if (i.isButton()) {
                if (i.customId == "voiceChannel") {
                    if (
                        !voice ||
                        voice.type !== ChannelType.GuildVoice ||
                        !voice.owner
                    ) {
                        return button.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    member,
                                    "Управление",
                                    "**выбранный** голосовой канал **не** найден или **не** является **приватной комнатой**",
                                ),
                            ],
                            components: [],
                        });
                    }

                    return button.editReply({
                        embeds: [
                            client.storage.embeds.infoRoom(
                                button.member as GuildMember,
                                voice,
                            ),
                        ],
                        components:
                            client.storage.components.checkMembersPermission(
                                voice.id,
                            ),
                    });
                } else if (i.customId.startsWith("checkMembersPermission")) {
                    const channel = i.guild.channels.cache.get(
                        i.customId.split(".")[1],
                    );

                    if (
                        !channel ||
                        channel.type !== ChannelType.GuildVoice ||
                        !channel.owner
                    ) {
                        return button.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    member,
                                    "Управление",
                                    "**выбранный** голосовой канал **не** найден или **не** является **приватной комнатой**",
                                ),
                            ],
                            components: [],
                        });
                    }

                    return button.editReply({
                        embeds: [
                            client.storage.embeds.permissions(
                                button.member as GuildMember,
                                channel,
                            ),
                        ],
                        components: client.storage.components.pages(channel),
                    });
                } else {
                    const channel = i.guild.channels.cache.get(
                        i.customId.split(".")[1],
                    );

                    if (
                        !channel ||
                        channel.type !== ChannelType.GuildVoice ||
                        !channel.owner
                    ) {
                        return button.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    member,
                                    "Управление",
                                    "**выбранный** голосовой канал **не** найден или **не** является **приватной комнатой**",
                                ),
                            ],
                            components: [],
                        });
                    }

                    return button.editReply({
                        embeds: [
                            client.storage.embeds.infoRoom(
                                button.member as GuildMember,
                                channel,
                            ),
                        ],
                        components:
                            client.storage.components.checkMembersPermission(
                                voice.id,
                            ),
                    });
                }
            }
        });
    },
);
