import { Client, GatewayIntentBits, Partials } from "discord.js";
import DiscordStorage from "./discord.js/DiscordStorage";
import Mongoose from "../db/Mongoose";
import ClientLogger from "./helpers/Logger";
import * as config from "../config";
import ClientUtil from "./helpers/Utils";
import RoomManager from "./managers/RoomManager";
import { DiscordTogether } from "discord-together";

export default class extends Client<true> {
    readonly config = config;
    public storage: DiscordStorage;
    public logger: ClientLogger;
    public util: ClientUtil;
    public db: Mongoose;
    public discordTogether: DiscordTogether<any>;
    public managers: {
        voice: RoomManager;
    };

    constructor(public data: IClients) {
        super({
            intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
            partials: [Partials.GuildMember, Partials.Channel, Partials.User],
            allowedMentions: {
                parse: ["roles", "users"],
                repliedUser: true,
            },
        });

        this.data = data;
        this.storage = new DiscordStorage(this);
        this.logger = new ClientLogger();
        this.util = new ClientUtil(this);
        this.db = new Mongoose(this);
        this.discordTogether = new DiscordTogether(this);
        this.managers = {
            voice: new RoomManager(this),
        };
    }

    async init() {
        this.loadAll();
        this.login(this.data.token);
    }

    loadAll() {
        this.storage.slashCommands.load();
        this.storage.channelMenus.load();
        this.storage.stringMenus.load();
        this.storage.userMenus.load();
        this.storage.buttons.load();
        this.storage.modals.load();
        this.storage.events.load();
    }
}
