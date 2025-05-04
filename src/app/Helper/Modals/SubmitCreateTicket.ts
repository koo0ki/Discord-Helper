import { ModalSubmitInteraction, ChannelType } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client";

export default new BaseInteraction(
    'submitWindowCreateTicket',
    async (client: Client, modal: ModalSubmitInteraction<'cached'>) => {
        await modal.deferReply({ ephemeral: true })

        const tag = modal.customId.split('.')[1]
        const topic = modal.fields.getTextInputValue('topic')

        const check = await client.db.tickets.getTicket(modal.guildId, modal.member.id, tag)
        if(check) {
            return modal.editReply({ content: 'У Вас **уже** есть **открытый** тикет на **данную** тему' })
        }

        const doc = await client.db.tickets.onlyCreate(modal.member)
        
        const request = modal.guild.channels.cache.get(client.config.ticket.requestId)
        if(request && request.type === ChannelType.GuildText) {
            const message = await request.send({
                embeds: [
                    client.storage.embeds.color()
                    .setAuthor({ name: 'Новый тикет' })
                    .addFields(
                        { name: '> Пользователь:', value: `・${modal.member.toString()}\n・${modal.user.tag}\n・${modal.user.id}` },
                        { name: '> Тема:', value: client.util.toCode(topic, 'fix') }
                    ).setFooter({ text: `Tag: ${client.util.resolveTicketTag(tag)}` }).setTimestamp()
                ],
                components: client.storage.components.choose(`Ticket.${modal.member.id}`)
            })

            doc.messageId = message.id
        }

        doc.tag = tag
        doc.topic = topic
        await client.db.tickets.save(doc)

        return modal.editReply({ embeds: [
            client.storage.embeds.color()
            .setDescription(`Ваш запрос **создан**\n> Запрос будет **принят** или **отклонен** одним из <@&${client.config.meta.moderatorId}>`)
        ] })
    }
)