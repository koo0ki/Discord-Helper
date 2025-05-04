import { TextChannel, UserSelectMenuInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client";

export default new BaseInteraction(
    'transferTicket',
    async (client: Client, menu: UserSelectMenuInteraction<'cached'>) => {
        const messageId = menu.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return menu.update({ content: 'Тикет не найден...', embeds: [], components: [] })

        if(menu.values.includes(doc.staffId) || menu.values.includes(doc.userId)) {
            return menu.update({ content: 'Вы **не** можете **передать** тикет **себе** или **автору** тикета', embeds: [], components: [] })
        }

        const member = menu.guild.members.cache.get(menu.values[0])
        if(!member) {
            return menu.update({ content: 'Я **не** нашёл такого пользователя', embeds: [], components: [] })
        }

        if(member.user.bot) {
            return menu.update({ content: 'Вы **не** можете **передать** тикет **боту**', embeds: [], components: [] })
        }

        if(!member.roles.cache.has(client.config.meta.moderatorId)) {
            return menu.update({ content: 'Пользователь **не** является **модератором**', embeds: [], components: [] })
        }

        await menu.update({
            embeds: [ client.storage.embeds.default(menu.member, 'Передача тикета', `Вы **передали** тикет пользователю ${member.toString()}`) ],
            components: []
        })

        await (menu.channel as TextChannel).permissionOverwrites.create(
            member.id, { 'ViewChannel': true, 'ManageChannels': true }
        ).catch(() => {})
        await (menu.channel as TextChannel).permissionOverwrites.delete(menu.member.id).catch(() => {})

        await (menu.channel as TextChannel).send({
            content: `<@${doc.userId}>`,
            embeds: [ client.storage.embeds.info('Ваше дело было передано другому модератору') ]
        })

        await (menu.channel as TextChannel).send({
            content: `<@${member.id}>`,
            embeds: [ client.storage.embeds.info(`Вам был передан тикет от ${menu.user.username}`) ]
        })

        doc.staffId = member.id
        return client.db.tickets.save(doc)
    }
)