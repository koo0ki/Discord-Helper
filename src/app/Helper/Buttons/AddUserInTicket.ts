import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client";

export default new BaseInteraction(
    'addMemberInTicket',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        await button.deferReply({ ephemeral: true })

        const messageId = button.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return button.editReply({ content: 'Тикет не найден...' })

        if(doc.staffId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Добавление участника в канал', 'Вы **не** являетесь **модератором** этого тикета') ]
            })
        }

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Добавление участника в канал', 'Выберите **кого** Вы хотите **добавить** в канал.\n> Вы **можете** добавить до **10** пользователей за раз') ],
            components: client.storage.components.createUserSelectRow(`addMemberInTicket.${messageId}`, { max_values: 10 })
        })
    }
)