import BaseEvent from "@base/BaseEvent";
import { VoiceState } from "discord.js";
import Client from "src/struct/Client";

export default new BaseEvent(
    {
        name: "voiceStateUpdate",
        once: false,
    },
    async (client: Client, old: VoiceState, state: VoiceState) => {
        client.managers.voice.execute(old, state);
    },
);
