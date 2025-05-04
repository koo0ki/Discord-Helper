import { VoiceState, ChannelType, GuildMember, VoiceChannel, GuildBasedChannel } from "discord.js";
import Client from "../Client";

class RoomManager {
    constructor(private client: Client) {
        this.client = client
    }

    async execute(oldState: VoiceState, newState: VoiceState) {
        const guild = oldState.guild;
        const member = oldState.member as GuildMember
        const user = member.user;

        if (newState.channel?.id === this.client.config.room.createPrivateChannelId) {
        const existingChannel = guild.channels.cache.find(
            (channel: GuildBasedChannel) => 
            channel instanceof VoiceChannel && channel.owner?.id === user.id,
        ) as VoiceChannel | undefined;

        if (existingChannel) {
            return newState.setChannel(existingChannel);
        }

        const text = "Создание комнаты";

        try {
            const channel = (await guild.channels.create({
            name: this.client.config.room.defaultName.replace(`{username}`, user.username),
            type: ChannelType.GuildVoice,
            parent: this.client.config.room.privateCategoryId,
            reason: text,
            permissionOverwrites: [
                { id: user.id, allow: 40136506082048n, deny: 0n },
            ],
            })) as VoiceChannel;

            channel.owner = user;
            channel.creator = user;
            newState.setChannel(channel, text);
        } catch (err) {}
        }

        if (
            oldState.channel?.parentId === this.client.config.room.privateCategoryId &&
            oldState.channel?.id !== this.client.config.room.createPrivateChannelId
        ) {
            const channel = oldState.channel as VoiceChannel;

            if (channel.members.size === 0) {
                await channel.delete().catch(() => {})
            }
        }
    }
}

export default RoomManager;