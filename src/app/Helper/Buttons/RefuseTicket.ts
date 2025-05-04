import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client"

export default new BaseInteraction(
    'refuseTicket',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        const doc = await client.db.tickets.getMessage(button.message.id)
        if(!doc) return button.reply({ content: 'Тикет не найден...', ephemeral: true })

        if(doc.tag === 'partner' && !button.member.permissions.has('Administrator')) {
            return button.reply({ content: 'Данный тикет может принять только Администратор...', ephemeral: true })
        }

        return button.showModal(
            new ModalBuilder()
            .setTitle('Причина отклонения')
            .setCustomId(`submitWindowRefuseTicket.${button.customId.split('.')[1]}`)
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Причина')
                    .setMaxLength(512)
                    .setPlaceholder('Причина отклонения...')
                    .setRequired(false)
                    .setStyle(TextInputStyle.Paragraph)
                )
            )
        )
    }
)