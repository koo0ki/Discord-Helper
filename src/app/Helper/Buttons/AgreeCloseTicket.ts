import { AttachmentBuilder, ButtonInteraction, ChannelType, TextChannel } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client"

export default new BaseInteraction(
    'agreeCloseTicket',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        await button.update({ components: [], embeds: [ client.storage.embeds.info('Выполнено') ] })

        const messageId = button.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return button.editReply({ content: 'Тикет не найден...' })

        await (button.channel as TextChannel).send({
            embeds: [ client.storage.embeds.info('Данный канал удалится в течение 5 секунд...') ]
        })

        const channel = button.guild.channels.cache.get(client.config.ticket.requestId)
        if(channel && channel.type === ChannelType.GuildText) {
            const message = await channel.messages.fetch(doc.messageId).catch(() => null)
            if(message && message.editable) {
                const embed = client.storage.embeds.copy(message.embeds[0].data)

                if(doc.members.length > 0) {
                    embed.addFields(
                        { name: 'Участники вовлечённые в тикет:', value: doc.members.map((m) => `・<@${m.id}> (\`${m.id}\`) | ${m.removed ? 'Был удалён' : 'Остался'}`).join('\n') }
                    )
                }

                const msg = await message.edit({
                    embeds: [
                        embed.setTimestamp(Date.now())
                        .setAuthor({ name: 'Тикет закрыт' })
                    ],
                    components: []
                })

                setTimeout(async () => {
                    await button.channel!.delete('Закрытие тикета')
        
                    if(client.db.tickets.channels.has(doc.channelId)) {
                        client.db.tickets.channels.delete(doc.channelId)
                    }
        
                    doc.channelId = '0'
                    doc.opened = false
                    doc.requested = false
                    doc.closedTimestamp = Date.now()
                    await client.db.tickets.save(doc)
                }, 5_000)

                const thread = await msg.startThread({ name: 'История сообщений' })

                const messages = await button.channel!.messages.fetch({ limit: 100 })
                
                for(const message of messages.reverse().values()) {
                    if(message.content === '') continue

                    await thread.send({ embeds: [
                        client.storage.embeds.color()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setDescription(message.content)
                        .setTimestamp(message.createdTimestamp)
                    ]})
                }
                
            }
        }
    }
)