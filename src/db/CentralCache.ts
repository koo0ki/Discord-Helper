import { Collection } from "discord.js";
import { TTicket } from "./tickets/TicketSchema";

export class CentralCache {
    public tickets: Collection<string, TTicket> = new Collection();
}

export default new CentralCache();
