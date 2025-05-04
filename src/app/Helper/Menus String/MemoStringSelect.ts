import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import Client from "src/struct/Client";

export default new BaseInteraction(
    'memo',
    async (client: Client, menu: StringSelectMenuInteraction<'cached'>) => {
        await menu.deferReply({ ephemeral: true })

        const json = {
            "deadline": `\`\`\`Заказ на шаблонного бота выполняется до 3 рабочих дней, написание бота под ключ выполняется от 3 до 14 рабочих дней\`\`\``,
            "source": `\`\`\`Это обговаривается до начала выполнения заказа (чаще всего бот с исходным кодом стоит дороже)\`\`\``,
            "payment": `\`\`\`Мы принимаем оплату по СБП, Юмани и CryptoBot\`\`\``,
            "language": `\`\`\`Чаще всего мы используем NodeJS (JavaScript, TypeScript), но бывают исключения\`\`\``,
            "refund": `\`\`\`После начала выполнения заказа вернуть денежные средства возможности нет\`\`\``
        }

        return await menu.editReply({ 
            embeds: [ client.storage.embeds.color().setDescription(json[menu.values[0] as keyof typeof json]) ]
        })
    }
)