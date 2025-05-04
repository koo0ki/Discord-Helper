import { Collection, GuildMember } from "discord.js";
import TicketSchema, { TTicket } from "./TicketSchema";
import Mongoose from "../Mongoose";
import CentralCache from "../CentralCache";

export default class TicketManager {
    private readonly cache = CentralCache.tickets;
    public readonly channels: Set<string> = new Set();

    constructor(private db: Mongoose) {}

    async init() {
        const array = await this.array();
        for (let i = 0; array.length > i; i++) {
            const doc = array[i];
            this.cache.set(`${doc.guildId}.${doc.userId}`, doc);
            if (doc.channelId !== "0") {
                this.channels.add(doc.channelId);
            }
        }
    }

    async array(cache: boolean = false) {
        return cache ? this.cache.map((g) => g) : await TicketSchema.find();
    }

    async getTicket(guildId: string, userId: string, tag: string) {
        const find = this.cache.find(
            (v, k) =>
                k === `${guildId}.${userId}` && v.requested && v.tag === tag,
        );
        if (find) return find;
        else {
            return await TicketSchema.findOne({
                guildId,
                userId,
                tag,
                requested: true,
            });
        }
    }

    async getMessage(messageId: string) {
        const get = this.cache.find((v) => v.messageId === messageId);
        if (get) return get;
        else {
            return await TicketSchema.findOne({ messageId });
        }
    }

    async getChannel(channelId: string) {
        const get = this.cache.find((v) => v.channelId === channelId);
        if (get) return get;
        else {
            return await TicketSchema.findOne({ channelId });
        }
    }

    async get(guildId: string, userId: string) {
        const get = this.cache.get(`${guildId}.${userId}`);
        if (get) return get;
        else {
            return (
                (await TicketSchema.findOne({ guildId, userId })) ??
                (await this.create(guildId, userId))
            );
        }
    }

    async onlyCreate(member: GuildMember) {
        return await TicketSchema.create({
            guildId: member.guild.id,
            userId: member.id,
        });
    }

    async create(guildId: string, userId: string) {
        const doc = await TicketSchema.create({ guildId, userId });
        return this.save(doc);
    }

    async save(doc: TTicket) {
        const saved = await doc.save();
        this.cache.set(`${saved.guildId}.${saved.userId}`, saved);
        return saved;
    }
}
