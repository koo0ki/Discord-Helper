import { EmbedBuilder } from "discord.js";

export const clients: IClients[] = [
    {
        token: "",
        type: "Helper",
    },
    {
        token: "",
        type: "Voice",
    },
];

export const mongoUrl: string = "mongodb://127.0.0.1:27017/Discord-Helper";

export const owners: string[] = ["885448852872790107"];

export const meta = {
    guildId: "1250912770778599504",
    spaceLine:
        "https://cdn.discordapp.com/attachments/1094082789164462160/1094087427175481344/BannerSpace.png",
    moderatorId: "1356665084784676964",
};

export const emojis = {
    clear: "🧹",
    home: "🏠",
    channels: "📝",
    roles: "🎭",
    status: "🔔",
    news: "📰",

    transfer: "↔️",
    close: "❌",
    addUser: "➕",
    removeUser: "➖",

    trash: "🗑️",
    dot: "•",
};

export const colors = {
    discord: 0x2b2d31,
};

export const room = {
    privateCategoryId: `1356993847434940639`,
    createPrivateChannelId: `1356995310366363758`,
    manageChannelId: "1356995228699070664",
    defaultName: "🎲・{username}",
    placeholder: {
        user: "🧩 Выберите пользователя",
        channel: "🧩 Выберите приватную комнату",
    },
    buttons: {
        "set-name": {
            description: "Изменить название",
        },
        "set-limit": {
            description: "Установить лимит",
        },
        kick: {
            description: "Выгнать из комнаты",
        },
        "lock-everyone": {
            description: "Открыть / закрыть комнату",
        },
        "set-owner": {
            description: "Передать права",
        },
        "view-everyone": {
            description: "Скрыть / раскрыть",
        },
        mute: {
            description: "Замьютить / размьютить",
        },
        lock: {
            description: "Забрать / выдать доступ",
        },
        view: {
            description: "Открыть / Закрыть",
        },
        info: {
            description: "Получить информацию",
        },
    },
};

export const memo = {
    channelId: "1314230577469194252",
    embeds: [
        new EmbedBuilder()
            .setColor(colors.discord)
            .setImage(
                "https://media.discordapp.net/attachments/1314230547324862556/1357014020808511548/Frame_427319194.png?ex=67eea94a&is=67ed57ca&hm=b97502ffe734dd173b4822f5c3b8510cc24672e22188e4fa367e987ca4c31aef&=&format=webp&quality=lossless&width=550&height=173",
            ),
    ],
    options: [
        {
            label: "В течение какого времени выполняется заказ?",
            value: "deadline",
        },
        { label: "Отдаете ли вы исходный код бота?", value: "source" },
        { label: "Какие есть способы принятия платежей?", value: "payment" },
        {
            label: "Какой язык используется при написании кода?",
            value: "language",
        },
        {
            label: "Есть ли возможность сделать возрат денежных средств?",
            value: "refund",
        },
    ],
};

export const ticket = {
    channelId: "1356567624300892264",
    embeds: [
        new EmbedBuilder()
            .setColor(colors.discord)
            .setImage(
                "https://media.discordapp.net/attachments/1314230547324862556/1357013987836821614/Frame_427319193.png?ex=67eea942&is=67ed57c2&hm=24c909be828b1867628041d5aaf635ce542b07701bd9b6def5f9702837aaa0a5&=&format=webp&quality=lossless&width=1552&height=488",
            ),
        new EmbedBuilder()
            .setColor(colors.discord)
            .setDescription(
                'Для **покупки** бота, выберите категорию "**Покупка**" в меню ниже.\n\nПосле создания тикета с вами свяжется наш **менеджер**, который предоставит всю необходимую информацию о **ценах** и **условиях** приобретения бота.',
            )
            .setImage(meta.spaceLine),
    ],
    options: [
        { label: "Помощь", description: "Задать вопрос", value: "help" },
        { label: "Покупка", description: "Приобрести бота", value: "buy" },
    ],
    createParentId: "1356980786649239652",
    parentId: "1356980786649239652",
    requestId: "1356980845264633876",
};
