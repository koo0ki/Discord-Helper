import { ActivityType, ChannelType, StringSelectMenuBuilder } from "discord.js";
import BaseEvent from "../../../struct/base/BaseEvent";
import moment from "moment-timezone";
import Client from "src/struct/Client";

export default new BaseEvent(
    {
        name: "ready",
        once: true,
    },
    async (client: Client) => {
        client.storage.emoji.init();
        client.storage.emoji.on("ready", async () => {
            const guild = client.guilds.cache.get(client.config.meta.guildId);
            if (guild) {
                const manageRoom = guild.channels.cache.get(
                    client.config.room.manageChannelId,
                );
                if (manageRoom && manageRoom.type === ChannelType.GuildText) {
                    (await manageRoom.messages.fetch())
                        .filter((m) => m.author.id === client.user.id)
                        .map(async (m) => await m.delete().catch(() => {}));
                    await manageRoom.send({
                        embeds: [client.storage.embeds.roomPanel()],
                        components: client.storage.components.roomPanel(),
                    });
                }
            }
        });
    },
);
