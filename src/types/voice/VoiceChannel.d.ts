import { VoiceChannel, Client } from "discord.js";

declare module "discord.js" {
  interface VoiceChannel {
    owner?: { id: string };
    creator?: { id: string };
  }
}
