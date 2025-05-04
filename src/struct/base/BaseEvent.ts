import { Events } from "discord.js";
import Koo0kiClient from "../Client";

interface IEvent {
    name: `${Events}`
    disabled?: boolean
    once?: boolean
}

export default class BaseEvent {
    constructor(
        readonly options: IEvent,
        public run: (client: Koo0kiClient, ...any: any) => Promise<any>
    ) {}
}