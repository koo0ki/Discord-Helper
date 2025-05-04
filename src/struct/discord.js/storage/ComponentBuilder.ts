import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder, VoiceChannel } from 'discord.js';
import Client from '../../Client';

export default class ComponentBuilder {
    constructor(
        private client: Client
    ) { }

    private buttonSecondary(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(customId)
    }

    private buttonSuccess(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId(customId)
    }

    private buttonPrimary(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(customId)
    }

    private buttonDanger(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(customId)
    }

    private buttonLink(url: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(url)
    }

    createStringSelectRow() {
        return new ActionRowBuilder<StringSelectMenuBuilder>()
    }

    createUserSelectRow(customId: string, options: { min_values?: number, max_values?: number } = {}) {
        return [
            new ActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(
                new UserSelectMenuBuilder(options)
                .setPlaceholder('Выберите пользователя...')
                .setCustomId(customId)
            )
        ]
    }

    leave() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonPrimary('leave').setLabel('Назад'))
        ]
    }

    choose(endsWith?: string, refuseId: string = '') {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonSuccess(`agree${endsWith || ''}`).setLabel('Принять'))
            .addComponents(this.buttonDanger(refuseId === '' ? `refuse${endsWith || ''}` : refuseId).setLabel('Отклонить'))
        ]
    }

    manageTicket(messageId: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`closeTicket.${messageId}`).setEmoji(this.client.config.emojis.close),
                this.buttonSecondary(`transferTicket.${messageId}`).setEmoji(this.client.config.emojis.transfer),
                this.buttonSecondary(`addMemberInTicket.${messageId}`).setEmoji(this.client.config.emojis.addUser),
                this.buttonSecondary(`removeMemberInTicket.${messageId}`).setEmoji(this.client.config.emojis.removeUser)
            )
        ]
    }

    closeTicket(messageId: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary(`agreeCloseTicket.${messageId}`).setLabel('Закрыть тикет')
            )
        ]
    }

    roomPanel() {
        const buttons = Object.entries(this.client.config.room.buttons).map(([key, button]) =>
            new ButtonBuilder({
                custom_id: key,
                style: 2,
            }).setEmoji(this.client.storage.emoji.getEmoji(key) as string),
        );

        const applications = {
            "Putt Party": {
                value: "puttparty",
                id: "",
                description: "Участников — не более 8",
            },
            "YouTube Watch Together": {
                value: "youtube",
                id: "",
                description: "Неограниченое число участников",
            },
            "Know What I Meme": {
                value: "meme",
                id: "",
                description: "Участников — не более 9",
            },
            "Chess In The Park": {
                value: "chess",
                id: "",
                description: "Неограниченое число участников",
            },
            "Sketch Heads": {
                value: "sketchheads",
                id: "",
                description: "Участников — не более 8",
            },
            SpellCast: {
                value: "spellcast",
                id: "",
                description: "Участников — не более 6",
            },
            "Checkers In The Park": {
                value: "checkers",
                id: "",
                description: "Неограниченое число участников",
            },
            "Letter League": {
                value: "lettertile",
                id: "",
                description: "Участников — не более 8",
            },
        };

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("app-select")
            .setPlaceholder("Выберите игру, в которую хотите сыграть...")
            .addOptions(
            Object.entries(applications).map(([label, value]) => ({
                label,
                description: value.description,
                value: value.value,
            })),
            ),
        );

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttons.slice(0, 5),
        );
        const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            buttons.slice(5, 10),
        );

        return [row, row2, row3];
    }

    userSelect() {
        return new UserSelectMenuBuilder()
        .setCustomId("user")
        .setPlaceholder(this.client.config.room.placeholder.user);
    }

    limitModal() {
        return new ModalBuilder()
        .setCustomId("settings_limit")
        .setTitle("Настройка канала")
        .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
            .setCustomId("value")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            .setLabel("Значение")
            .setPlaceholder(
                "Укажите новое максимальное кол-во участников в комнате!",
            ),
        ),
        );
    }

    nameModal() {
        return new ModalBuilder()
        .setCustomId("settings_name")
        .setTitle("Настройка канала")
        .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
            .setCustomId("value")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(50)
            .setStyle(TextInputStyle.Short)
            .setLabel("Значение")
            .setPlaceholder("Укажите новое название комнаты!"),
        ),
        );
    }

    menuChannel(customId: string, placeholder: string, disabled?: boolean) {
        return new ActionRowBuilder<ChannelSelectMenuBuilder>()
        .addComponents(
            new ChannelSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder)
            .setMinValues(1)
            .setMaxValues(1)
            .setChannelTypes([ChannelType.GuildVoice])
            .setDisabled(Boolean(disabled))
        )
    }

    buttonRoom(disabled?: boolean) {
        return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId('voiceChannel')
            .setLabel('Выбрать текущий голосовой канал')
            .setDisabled(Boolean(disabled))
        )  
    }

    checkMembersPermission(id: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`checkMembersPermission.${id}`)
                .setLabel('Посмотреть права пользователей')
            )  
        ]
    }

    pages(channel: VoiceChannel) {        
        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`leave.${channel.id}`).setLabel('Вернуться назад')
        )

        return [row]
    }
}