import { ButtonInteraction, ChannelType } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client"

export default new BaseInteraction(
    'agreeTicket',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        await button.deferReply({ ephemeral: true })

        const memberId = button.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(button.message.id)
        if(!doc) return button.editReply({ content: 'Тикет не найден...' })

        if(doc.tag === 'partner' && !button.member.permissions.has('Administrator')) {
            return button.editReply({ content: 'Данный тикет может принять только Администратор...' })
        }

        const member = button.guild.members.cache.get(memberId)
        if(!member) return button.editReply({ content: `Пользователь с ID \`${memberId}\` **вышел** с сервера\n> Вы **можете** только **отклонить** запрос` })
        
        await button.message.edit({ components: [] })

        const channel = await button.guild.channels.create(
            {
                name: `${doc.tag}-${member.user.username}`, parent: client.config.ticket.parentId,
                topic: doc.topic, type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: button.member.guild.id,
                        deny: [
                            'ViewChannel', 'MentionEveryone', 'CreateInstantInvite',
                            'CreatePrivateThreads', 'CreatePublicThreads'
                        ]
                    },
                    { id: member.id, allow: [ 'ViewChannel' ] },
                    { id: button.member.id, allow: [ 'ViewChannel', 'ManageChannels' ] }
                ]
            }
        )

        doc.channelId = channel.id
        doc.opened = true
        doc.staffId = button.user.id
        client.db.tickets.channels.add(channel.id)
        
        await button.message.edit({
            embeds: [
                client.storage.embeds.copy(button.message.embeds[0].data)
                .spliceFields(1, 1)
                .addFields(
                    { name: '> Принял:', value: `・${button.member.toString()}\n・${button.user.tag}\n・${button.user.id}` },
                    { name: '> Тема:', value: client.util.toCode(doc.topic, 'fix') }
                ).setTimestamp()
            ],
            components: []
        })

        const message = await channel.send({
            embeds: [
                client.storage.embeds.color().setTitle('Управление тикетом')
                .setDescription(
                    `${client.config.emojis.close} — закрыть тикет` + '\n'
                    + `${client.config.emojis.transfer} — передать тикет` + '\n'
                    + `${client.config.emojis.addUser} — добавить пользователя в канал` + '\n'
                    + `${client.config.emojis.removeUser} — убрать добавленного пользователя`
                ).setFooter({ text: `・Данные кнопки доступны только модератору` })
            ],
            components: client.storage.components.manageTicket(button.message.id)
        })

        await message.pin()

        await channel.send({
            content: `${member.toString()} Ваш тикет был принят ${button.member.toString()}`,
        })

        await client.db.tickets.save(doc)

        return button.editReply({ content: `Вы **приняли** тикет от ${member.toString()}` })
    }
)