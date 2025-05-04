import { Collection } from "discord.js";
import { readdir } from "fs";
import Client from "../Client";
import BaseEvent from "../base/BaseEvent";
import { BaseHandler } from "@base/BaseHandler";

export default class EventHandler extends BaseHandler {
    readonly cache: Collection<string, BaseEvent> = new Collection()
    readonly globalDir: string = `${__dirname}/../../app/Global Events`

    constructor(
        private client: Client
    ) {
        super(`${__dirname}/../../app/${client.data.type}/Events`)
    }

    async load() {
        const files = this.getFiles()
        const directorys = this.getDirectories()

        const globalfiles = this.getFiles(this.globalDir)
        const globalDirectory = this.getDirectories(this.globalDir)

        for (const file of files) {
            const event = (await import(`${this.dir}/${file}`)).default
            if (event instanceof BaseEvent) {
                this.addListener(event)
            }
        }

        for (const dir of directorys) {
            const files = this.getFiles(`${this.dir}/${dir}`)
            for (const file of files) {
                const event = (await import(`${this.dir}/${dir}/${file}`)).default
                if (event instanceof BaseEvent) {
                    this.addListener(event)
                }
            }
        }

        for (const file of globalfiles) {
            const event = (await import(`${this.globalDir}/${file}`)).default
            if (event instanceof BaseEvent) {
                this.addListener(event)
            }
        }

        for (const dir of globalDirectory) {
            const files = this.getFiles(`${this.globalDir}/${dir}`)
            for (const file of files) {
                const event = (await import(`${this.globalDir}/${dir}/${file}`)).default
                if (event instanceof BaseEvent) {
                    this.addListener(event)
                }
            }
        }
    }

    addListener(file: BaseEvent) {
        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`Event ${file.options.name} is loaded!`)
        }

        if(file.options.disabled) return

        if(file.options.once) {
            this.client.once(file.options.name as any, file.run.bind(null, this.client))
        } else {
            this.client.on(file.options.name as any, file.run.bind(null, this.client))
        }
    }

    removeListener(name: string) {
        if(!this.cache.has(name)) {
            return this.client.logger.error(`Event ${name} is not loaded!`)
        }

        this.client.on(name, () => {})
    }
}