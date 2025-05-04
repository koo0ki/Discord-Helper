import { TextChannel, UserSelectMenuInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client";

export default new BaseInteraction(
    'removeMemberInTicket',
    async (client: Client, menu: UserSelectMenuInteraction<'cached'>) => {
        const messageId = menu.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return menu.update({ content: 'Тикет не найден...', embeds: [], components: [] })

        if(menu.values.includes(doc.staffId) || menu.values.includes(doc.userId) || menu.values.some((v) => doc.members.some((m) => m.id === v && m.removed))) {
            return menu.update({ content: 'Вы **не** можете **удалить** себя или пользователя с тикетом\nЛибо **указанного** участника **нет** в группе', embeds: [], components: [] })
        }

        const arr = menu.values
        const resolveArray = []
        const members = doc.members.map((m) => m.id)
        for ( let i = 0; arr.length > i; i++ ) {
            const member = menu.guild.members.cache.get(arr[i])
            if(member && !member.user.bot) {
                await (menu.channel as TextChannel).permissionOverwrites.create(
                    arr[i], { 'ViewChannel': false }
                )
    
                if(members.includes(arr[i])) {
                    const get = doc.members.find((m) => m.id === arr[i])!
                    get.removed = true
                } else {
                    doc.members.push({ id: arr[i], removed: true })
                }

                resolveArray.push(arr[i])
            }
        }

        if(resolveArray.length === 0) {
            return menu.update({
                embeds: [ client.storage.embeds.default(menu.member, 'Удаление участника из канала', 'Вы **никого** не удалили') ],
                components: []
            })
        }

        await (menu.channel as TextChannel).send({
            embeds: [ client.storage.embeds.info('Удалены пользователи').setDescription(resolveArray.map((id) => `・<@${id}>`).join('\n')) ]
        })

        doc.markModified('members')
        await client.db.tickets.save(doc)
        
        return menu.update({
            embeds: [ client.storage.embeds.default(menu.member, 'Удаление участника из канала', 'Указанные Вами **пользователи** были удалены') ],
            components: []
        })
    }
)