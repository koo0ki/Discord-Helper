import { APIEmbed, EmbedBuilder, EmbedData, GuildMember, VoiceChannel } from 'discord.js'
import Client from '../../Client';

export default class extends EmbedBuilder {
    constructor(
        private client: Client
    ) { super({ color: client.config.colors.discord }) }

    copy(data: EmbedData | APIEmbed) {
        return new EmbedBuilder(data)
    }

    loading() {
        return this.color().setDescription('Загрузка...')
    }

    color() {
        return new EmbedBuilder().setColor(this.client.config.colors.discord)
    }

    info(name: string) {
        return this.color().setAuthor({ name })
    }

    default(member: GuildMember, title: string, description: string, options?: { target?: GuildMember, indicateTitle?: boolean }) {
        return this.color().setDescription(`${member.toString()}, ${description}`).setThumbnail(this.client.util.getAvatar(member))
        .setTitle(options?.indicateTitle ? `${title} — ${options.target ? options.target.user.tag : member.user.tag}` : title)
    }

    roomPanel() {
        const values: string[][] = [[], []];
        Object.entries(this.client.config.room.buttons).forEach(([key, button], i) => {
          values[i > 4 ? 1 : 0].push(`> ${this.client.storage.emoji.getEmoji(key)} — \`${button.description}\``);
        });
  
        return new EmbedBuilder()
          .setColor("#2B2D31")
          .setTitle("Управление комнатами")
          .setDescription("> Жми следующие кнопки, чтобы **управлять** комнатой")
          .addFields(
            {
              name: "** **",
              value: values[0].join("\n"),
              inline: true,
            },
            {
              name: "** **",
              value: values[1].join("\n"),
              inline: true,
            },
          )
          .setFooter({
            text: "Использовать их можно только когда у тебя есть приватный канал",
          });
      }

      infoRoom(member: GuildMember, channel: VoiceChannel) {
        const guildPerms = channel.permissionOverwrites.cache.get(member.guild.id)
        return new EmbedBuilder()
          .setTitle('Управление')
          .setThumbnail(member.user.avatarURL())
          .setColor('#2B2D31')
          .setDescription(
              '**Приватная комната:**' + ` ${channel.toString()}` + '\n'
              + '**Пользователи:**' + ` ${channel.members.size}/${channel.userLimit === 0 ? 'ꝏ' : channel.userLimit}` + '\n'
              + '**Владелец:**' + ` ${channel.owner}` + '\n'
              + '**Время создания:**' + ` <t:${Math.round(channel.createdAt as any/1000)}>` + '\n'
              + '**Видна ли комната всем:**' + ` ${guildPerms && guildPerms.deny.has('ViewChannel') ? '❌' : '✅'}` + '\n'
              + '**Доступна ли комната всем:**' + ` ${guildPerms && guildPerms.deny.has('Connect') ? '❌' : '✅'}` + '\n'
          )
    }

    permissions(member: GuildMember, channel: VoiceChannel, page: number = 0) {
        const array = channel.permissionOverwrites.cache
        .filter(p => channel.guild.members.cache.has(p.id))
        .map(p => p)

        const max = Math.ceil(array.length/5) === 0 ? 1 : Math.ceil(array.length/5)

        const embed = new EmbedBuilder()
        .setTitle('Управление')
        .setThumbnail(member.user.avatarURL())
        .setColor('#2B2D31')
        .setFooter(
            { text: `#${VoiceChannel.name}` }
        )

        for ( let i = page*5; (i < array.length && i < 5*(page+1)) ; i++ ) {
            const p = array[i]
            const target = member.guild.members.cache.get(p.id)
            if(target) {
                embed.addFields(
                    {
                        name: `${i+1}. ${target.displayName}`,
                        value: (
                            `> Подключиться: ${p.deny.has('Connect') ? '❌' : '✅'}` + '\n'
                            + `> Говорить: ${p.deny.has('Speak') ? '❌' : '✅'}`
                        )
                    }
                )
            }
        }

        return embed.setDescription((embed.data.fields || [] )?.length === 0 ? 'Пусто' : null)
    }
}