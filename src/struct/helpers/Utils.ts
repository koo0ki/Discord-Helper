import { Guild, GuildMember, ImageSize, PermissionsBitField, Role, User } from "discord.js";
import Client from "../Client";

export default class Utils {
    constructor(
        private client: Client
    ) {}

    getSlashCommand(name: string, search: 'guild' | 'global' | 'all' = 'all') {
        switch(search) {
            case 'all':
                return this.client.storage.slashCommands.cache.get(name)
            /*case 'global':
                return this.client.storage.slashCommands.cache.filter((s) => s.options.global).get(name)
            case 'guild':
                return this.client.storage.slashCommands.cache.filter((s) => !s.options.global).get(name)*/
        }
    }

    getButton(name: string) {
        return (
            this.client.storage.buttons.cache.get(name) ||
            this.client.storage.buttons.cache.find((int) => name.startsWith(int.name))
        )
    }

    getModal(name: string) {
        return (
            this.client.storage.modals.cache.get(name) ||
            this.client.storage.modals.cache.find((int) => name.startsWith(int.name))
        )
    }

    getChannelMenu(name: string) {
        return (
            this.client.storage.channelMenus.cache.get(name) ||
            this.client.storage.channelMenus.cache.find((int) => name.startsWith(int.name))
        )
    }

    getStringMenu(name: string) {
        return (
            this.client.storage.stringMenus.cache.get(name) ||
            this.client.storage.stringMenus.cache.find((int) => name.startsWith(int.name))
        )
    }

    getUserMenu(name: string) {
        return (
            this.client.storage.userMenus.cache.get(name) ||
            this.client.storage.userMenus.cache.find((int) => name.startsWith(int.name))
        )
    }

    getAvatar(member: GuildMember | User, size: ImageSize = 4096) {
        return member.displayAvatarURL({extension: 'png', forceStatic: false, size: size})
    }

    getIcon(icon: Role | Guild, size: ImageSize = 4096) {
        return icon.iconURL({extension: 'png', forceStatic: false, size: size}) || null
    }

    getBanner(guild: Guild | User, size: ImageSize = 4096) {
        return guild.bannerURL({extension: 'png', forceStatic: false, size: size}) || null
    }

    getDiscoverySplash(guild: Guild, size: ImageSize = 4096) {
        return guild.discoverySplashURL({extension: 'png', forceStatic: false, size: size})
    }

    getSplash(guild: Guild, size: ImageSize = 4096) {
        return guild.splashURL({extension: 'png', forceStatic: false, size: size})
    }

    isNumber(el: string, options: { minChecked?: number, maxChecked?: number } = {}) {
        const num = Number(el)
        return (isNaN(num) || (options?.minChecked ? options.minChecked : 0) > num || num > (options?.maxChecked ? options.maxChecked : 0))
    }

    resolveGuildAfkTimeout(timeout: number) {
        return Math.round(timeout / 60)
    }

    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    arrayRandom(array: any[]) {
        return array[this.random(0, array.length-1)]
    }

    toCode(text: any, code: string = '') {
        return `\`\`\`${code}\n${text}\n\`\`\``
    }

    disconnect(member: GuildMember) {
        return member.voice.disconnect().catch(() => {})
    }

    caseText(text: string, type: 'upper' | 'lower' | 'none' = 'none') {
        switch(type) {
            case 'upper':
                return text.toUpperCase()
            case 'lower':
                return text.toLowerCase()
            case 'none':
                return text
        }
    }

    resolveNumber(num: number) {
        const numStr = String(num);
        return numStr.split('').map((v, i) => i % 3 === 0 && i !== numStr.length - 1 ? ` ${v}` : v).join('');
    }

    getGuild(id?: string) {
        return this.client.guilds.cache.get(
            id ? id : this.client.config.meta.guildId
        )
    }

    resolveTicketTag(tag: string) {
        switch(tag) {
            case 'help':
                return 'Помощь'
            case 'buy':
                return 'Приобретение'
        }
    }

    addRoles(member: GuildMember | string, roles: string[]) {
        if (member instanceof GuildMember) {
            member.roles.add(roles).catch(() => {})
        } else {
            const guild = this.getGuild()
            const target = guild?.members.cache.get(member)
            if (target) {
                target.roles.add(roles).catch(() => {})
            }
        }
    }

    removeRoles(member: GuildMember | string, roles: string[]) {
        if (member instanceof GuildMember) {
            member.roles.remove(roles).catch(() => {})
        } else {
            const guild = this.getGuild()
            const target = guild?.members.cache.get(member)
            if (target) {
                target.roles.remove(roles).catch(() => {})
            }
        }
    }
}