import BaseInteraction from "@base/BaseInteraction";
import { ButtonInteraction } from "discord.js";
import Client from "src/struct/Client";

export default new BaseInteraction(
    "set-limit",
    async (client: Client, button: ButtonInteraction<"cached">) => {
        await button.showModal(client.storage.components.limitModal());
    },
);
