import { AutocompleteInteraction, Collection, CommandInteraction } from "discord.js";
import { readdir } from "fs";
import BaseSlashCommand from "../base/BaseSlashCommand";
import Client from "../Client";
import { BaseHandler } from "@base/BaseHandler";

export default class SlashCommandHandler extends BaseHandler {
    readonly cache: Collection<string, BaseSlashCommand> = new Collection()

    constructor(
        private client: Client
    ) {
        super(`${__dirname}/../../app/${client.data.type}/Slash Commands`)
    }

    async load() {
        const files = this.getFiles()
        const directorys = this.getDirectories()

        for (const file of files) {
            const event = (await import(`${this.dir}/${file}`)).default
            if (event instanceof BaseSlashCommand) {
                this.add(event)
            }
        }

        for (const dir of directorys) {
            const files = this.getFiles(`${this.dir}/${dir}`)
            for (const file of files) {
                const event = (await import(`${this.dir}/${dir}/${file}`)).default
                if (event instanceof BaseSlashCommand) {
                    this.add(event)
                }
            }
        }
    }

    add(slash: BaseSlashCommand) {
        if(this.cache.has(slash.name)) {
            return this.client.logger.error(`Slash Command ${slash.name} is loaded!`)
        }

        return this.cache.set(slash.name, slash)
    }

    remove(name: string) {
        if(!this.cache.has(name)) {
            return this.client.logger.error(`Slash Command ${name} is not loaded!`)
        }

        return this.cache.delete(name)
    }

    async parseInteraction(interaction: CommandInteraction<'cached'>, interactionCached: number) {
        const slash = this.client.util.getSlashCommand(interaction.commandName)

        if(slash) {
            if(
                slash.options.onlyMod && !this.client.config.owners.includes(interaction.user.id)
            ) {
                return interaction.reply({ content: 'Данная **команда** Вам **недоступна**', ephemeral: true })
            }

            return slash.run(this.client, interaction)
        } else {
            if(!interaction.deferred && !interaction.replied) {
                return interaction.reply({ content: 'нет такой команды', ephemeral: true })
            }
        }
    }

    parseAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
        const slash = this.client.util.getSlashCommand(interaction.commandName)

        if(slash && slash?.autocomplete) {
            return slash.autocomplete(this.client, interaction)
        }
    }

    async initGlobalApplicationCommands() {
        //const commands = this.cache.filter((s) => s.options?.global).map((s) => s.options)
        const commands = this.cache.map((s) => s.options)
        if(commands.length === 0) {
            if((this.client.application!.commands.cache.size || 0) > 0) {
                return this.client.application.commands.set([])
            }

            return
        }
        
        return (await this.client.application.commands.set(commands))
    }

    /*async initGuildApplicationCommands() {
        const commands = this.cache.filter((s) => !s.options?.global).map((s) => s.options)
        if(commands.length === 0) return

        const guilds = this.client.guilds.cache.map((g) => g)

        for ( const guild of guilds) {
            await guild.commands.set(commands)
        }
    }

    initCommands(guild: Guild) {
        return guild.commands.set(this.cache.filter((s) => !s.options?.global).map((s) => s.options))
    }*/
}