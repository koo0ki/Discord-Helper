import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client"

export default new BaseInteraction(
    'removeMemberInTicket',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        await button.deferReply({ ephemeral: true })

        const messageId = button.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return button.editReply({ content: 'Тикет не найден...' })

        if(doc.staffId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Удаление участника из канала', 'Вы **не** являетесь **модератором** этого тикета') ]
            })
        }

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Удаление участника из канала', 'Выберите **кого** Вы хотите **удалить** из канала.\n> Вы **можете** удалить до **10** пользователей за раз') ],
            components: client.storage.components.createUserSelectRow(`removeMemberInTicket.${messageId}`, { max_values: 10 })
        })
    }
)