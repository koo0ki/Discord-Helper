import Client from "../Client";
import BaseInteraction, { TButtonInteractionRun, TChannelSelectInteractionRun, TModalInteractionRun, TStringSelectInteractionRun, TUserSelectInteractionRun } from "../base/BaseInteraction";
import { ButtonInteraction, ChannelSelectMenuInteraction, Collection, Interaction, ModalSubmitInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { readdir } from "fs";
import { BaseHandler } from "../base/BaseHandler";

export default class EventHandler extends BaseHandler {
    readonly cache: Collection<string, BaseInteraction> = new Collection()

    constructor(
        private client: Client,
        public readonly type: 'Buttons' | 'Modals' | 'Menus String' | 'Menus User' | 'Menus Channel'
    ) {
        super(`${__dirname}/../../app/${client.data.type}/${type}`)
    }

    async load() {
        try {
            const files = this.getFiles()
            const directorys = this.getDirectories()
    
            for (const file of files) {
                const event = (await import(`${this.dir}/${file}`)).default
                if (event instanceof BaseInteraction) {
                    this.add(event)
                }
            }
    
            for (const dir of directorys) {
                const files = this.getFiles(`${this.dir}/${dir}`)
                for (const file of files) {
                    const event = (await import(`${this.dir}/${dir}/${file}`)).default
                    if (event instanceof BaseInteraction) {
                        this.add(event)
                    }
                }
            }
        } catch {}
    }

    add(int: BaseInteraction) {
        if(this.cache.has(int.name)) {
            return this.client.logger.error(`${this.type} ${int.name} is loaded!`)
        }

        return this.cache.set(int.name, int)
    }

    remove(name: string) {
        if(!this.cache.has(name)) {
            return this.client.logger.error(`${this.type} ${name} is not loaded!`)
        }

        return this.cache.delete(name)
    }

    private checkInteractionOptions(interaction: Interaction<'cached'>, cache: BaseInteraction) {
        if(cache.options?.onlyOwner) {
            const owners = this.client.config.owners
            if(!owners.includes(interaction.user.id)) {
                return
            }
        }
    }

    parseButtonInteraction(interaction: ButtonInteraction<'cached'>) {
        const button = this.client.util.getButton(interaction.customId)
        
        if(button) {
            this.checkInteractionOptions(interaction, button)
            return (button.run as TButtonInteractionRun)(this.client, interaction, interaction.guild.preferredLocale)
        }
    }

    parseModalInteraction(interaction: ModalSubmitInteraction<'cached'>) {
        const modal = this.client.util.getModal(interaction.customId)

        if(modal) {
            this.checkInteractionOptions(interaction, modal)
            return (modal.run as TModalInteractionRun)(this.client, interaction, interaction.guild.preferredLocale)
        }
    }

    parseChannelMenuInteraction(interaction: ChannelSelectMenuInteraction<'cached'>) {
        const menu = this.client.util.getChannelMenu(interaction.customId)

        if(menu) {
            this.checkInteractionOptions(interaction, menu)
            return (menu.run as TChannelSelectInteractionRun)(this.client, interaction, interaction.guild.preferredLocale)
        }
    }

    parseStringMenuInteraction(interaction: StringSelectMenuInteraction<'cached'>) {
        const menu = this.client.util.getStringMenu(interaction.customId)

        if(menu) {
            this.checkInteractionOptions(interaction, menu)
            return (menu.run as TStringSelectInteractionRun)(this.client, interaction, interaction.guild.preferredLocale)
        }
    }

    parseUserMenuInteraction(interaction: UserSelectMenuInteraction<'cached'>) {
        const menu = this.client.util.getUserMenu(interaction.customId)

        if(menu) {
            this.checkInteractionOptions(interaction, menu)
            return (menu.run as TUserSelectInteractionRun)(this.client, interaction, interaction.guild.preferredLocale)
        }
    }
}