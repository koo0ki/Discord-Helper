import { ButtonInteraction, ChannelSelectMenuInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, ModalMessageModalSubmitInteraction, UserSelectMenuInteraction } from "discord.js";
import Koo0kiClient from "../Client";

export type TButtonInteractionRun = (client: Koo0kiClient, interaction: ButtonInteraction<'cached'>, lang: string) => Promise<any>
export type TModalInteractionRun = (client: Koo0kiClient, interaction: (ModalSubmitInteraction<'cached'>), lang: string) => Promise<any>
export type TMessageModalInteractionRun = (client: Koo0kiClient, interaction: (ModalMessageModalSubmitInteraction<'cached'>), lang: string) => Promise<any>
export type TChannelSelectInteractionRun = (client: Koo0kiClient, interaction: ChannelSelectMenuInteraction<'cached'>, lang: string) => Promise<any>
export type TStringSelectInteractionRun = (client: Koo0kiClient, interaction: StringSelectMenuInteraction<'cached'>, lang: string) => Promise<any>
export type TUserSelectInteractionRun = (client: Koo0kiClient, interaction: UserSelectMenuInteraction<'cached'>, lang: string) => Promise<any>

export default class BaseInteraction {
    constructor(
        readonly name: string,
        public run: (TButtonInteractionRun | TModalInteractionRun | TMessageModalInteractionRun | TChannelSelectInteractionRun | TStringSelectInteractionRun | TUserSelectInteractionRun),
        readonly options: { onlyOwner?: boolean } = {}
    ) {}
}