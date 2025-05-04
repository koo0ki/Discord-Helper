import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface ITicket {
    guildId: string,
    userId: string,

    topic: string,
    staffId: string,
    requested: boolean,
    opened: boolean,
    tag: string,
    channelId: string,
    messageId: string,
    messages: { userId: string, content: string, sendedTimestamp: number, username: string }[],
    members: { id: string, removed: boolean }[],
    closedTimestamp: number
}

export type TTicket = ITicket & Document

export default model(
    'Ticket',
    new Schema<ITicket>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            userId: { type: SchemaTypes.String, required: true },

            topic: { type: SchemaTypes.String, default: 'Без темы' },
            staffId: { type: SchemaTypes.String, default: '0' },
            requested: { type: SchemaTypes.Boolean, default: true },
            opened: { type: SchemaTypes.Boolean, default: false },
            tag: { type: SchemaTypes.String, default: 'None' },
            channelId: { type: SchemaTypes.String, default: '0' },
            messageId: { type: SchemaTypes.String, default: '0' },
            messages: { type: [], default: [] },
            members: { type: [], default: [] },
            closedTimestamp: { type: SchemaTypes.Number, default: 0 },

        }
    ),
    'tickets'
)