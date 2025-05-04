import { ActivityType, ChannelType, StringSelectMenuBuilder } from "discord.js";
import BaseEvent from "../../../struct/base/BaseEvent";
import moment from "moment-timezone";
import Client from "src/struct/Client";

export default new BaseEvent(
    {
        name: 'ready',
        once: true
    },
    async (client: Client) => {   
        const guild = client.guilds.cache.get(client.config.meta.guildId)
        if(guild) {
            client.user.setActivity(
                {
                    name: guild.name,
                    type: ActivityType.Watching
                }
            )

            const channelMemo = guild.channels.cache.get(client.config.memo.channelId)
            if(channelMemo && channelMemo.type === ChannelType.GuildText) {
                (await channelMemo.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelMemo.send({
                    embeds: client.config.memo.embeds,
                    components: [
                        client.storage.components.createStringSelectRow()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('memo')
                            .setPlaceholder('Хотите что-то узнать?')
                            .setOptions(client.config.memo.options)
                        )
                    ]
                })
            }

            const channelTicket = guild.channels.cache.get(client.config.ticket.channelId)
            if(channelTicket && channelTicket.type === ChannelType.GuildText) {
                (await channelTicket.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelTicket.send({
                    embeds: client.config.ticket.embeds,
                    components: [
                        client.storage.components.createStringSelectRow()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('createTicket')
                            .setPlaceholder('О чем хотите создать тикет?')
                            .setOptions(client.config.ticket.options)
                        )
                    ]
                })
            }
        }
    }
)