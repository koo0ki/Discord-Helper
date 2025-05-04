import { Collection } from "discord.js";
import Client from "../struct/Client";
import mongoose from "mongoose";
import TicketManager from "./tickets/TicketManager";

export default class Mongoose {
    public inited: boolean = false
    public appeal: Set<string> = new Set()

    constructor(
        public client: Client
    ) {}

    public tickets = new TicketManager(this)

    async init() {
        await Promise.all([
            this.tickets.init()
        ])
        return (this.inited = true)
    }

}