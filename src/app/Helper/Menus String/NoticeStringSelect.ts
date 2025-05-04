import { StringSelectMenuComponent, StringSelectMenuInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client";

export default new BaseInteraction(
    'notice',
    async (client: Client, menu: StringSelectMenuInteraction<'cached'>) => {
        const roles = (menu.message.components[0].components[0] as StringSelectMenuComponent).options.map((o) => o.value)

        if(menu.values.includes('clear')) {
            roles.map(async (id) => {
                if(menu.member.roles.cache.has(id)) {
                    await menu.member.roles.remove(id).catch(() => {})
                }
            })

            return menu.reply({ embeds: [
                client.storage.embeds.color()
                .setAuthor({ name: menu.member.user.tag, iconURL: menu.member.user.displayAvatarURL() })
                .setDescription('Вы **очистили** роли')
            ], ephemeral: true })
        }

        menu.values.map(async (id) => {
            if(!menu.member.roles.cache.has(id)) {
                await menu.member.roles.add(id).catch(() => {})
            }
        })

        return menu.reply({ embeds: [
            client.storage.embeds.color()
            .setDescription(`Вам были **выданы** роли ${menu.values.map((id) => `<@&${id}>`).join(', ')}`)
            .setAuthor({ name: menu.member.user.tag, iconURL: menu.member.user.displayAvatarURL() })
        ], ephemeral: true })
    }
)