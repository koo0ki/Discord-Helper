import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client"

export default new BaseInteraction(
    'transferTicket',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        await button.deferReply({ ephemeral: true })

        const messageId = button.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return button.editReply({ content: 'Тикет не найден...' })

        if(doc.staffId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Передача тикета', 'Вы **не** являетесь **модератором** этого тикета') ]
            })
        }

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Передача тикета', 'Выберите **кому** Вы хотите **передать** тикет') ],
            components: client.storage.components.createUserSelectRow(`transferTicket.${messageId}`)
        })
    }
)