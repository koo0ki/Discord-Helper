import { ChannelType, ModalSubmitInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import HelperClient from "../../../struct/Client";

export default new BaseInteraction(
    'submitWindowRefuseTicket',
    async (client: HelperClient, modal: ModalSubmitInteraction<'cached'>) => {        
        await modal.deferReply({ ephemeral: true })

        const memberId = modal.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(modal.message!.id)
        if(!doc) return modal.editReply({ content: 'Тикет не найден...' })

        if(doc.tag === 'partner' && !modal.member.permissions.has('Administrator')) {
            return modal.editReply({ content: 'Данный тикет может принять только Администратор...' })
        }

        await modal.message!.edit({ components: [] })

        const member = modal.guild.members.cache.get(memberId)

        const reason = modal.fields.getTextInputValue('reason')

        if(member) {
            await member.send({
                embeds: [
                    client.storage.embeds.color()
                    .setAuthor({ name: `${modal.guild.name} | ${client.util.resolveTicketTag(doc.tag)}`, iconURL: (client.util.getIcon(modal.guild) || undefined) })
                    .setDescription(
                        `Здравствуйте, ${member.user.toString()}! Хочу Вам **сообщить**, что Ваш **запрос** был **отклонён** ${modal.user.toString()}` + '\n'
                        + (
                            reason ? (
                                reason.startsWith('https://') ? `> Решение Вашей проблемы **находится** по данной [ссылке](${reason})`
                                : `> Вам оставлено сообщение: ${reason}`
                            ) : ''
                        )
                    )
                ]
            }).catch(() => {})
        }

        await modal.message!.edit({
            embeds: [
                client.storage.embeds.copy(modal.message!.embeds[0].data)
                .spliceFields(1, 1)
                .setAuthor({ name: 'Тикет отклонён' })
                .addFields(
                    { name: '> Отклонил:', value: `・${modal.member.toString()}\n・${modal.user.tag}\n・${modal.user.id}` },
                    { name: '> Тема:', value: client.util.toCode(doc.topic, 'fix') },
                    { name: '> Причина отклонения:', value: client.util.toCode(reason ? reason : 'Без причины') }
                ).setTimestamp()
            ],
            components: []
        })

        doc.requested = false
        doc.closedTimestamp = Date.now()
        doc.staffId = modal.user.id

        await client.db.tickets.save(doc)

        return modal.editReply({ content: `Вы **отклонили** тикет от ${member ? member.toString() : memberId}` })
    }
)