import Client from "../../struct/Client";
import BaseEvent from "../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'ready',
        once: true
    },
    async (client: Client) => {
        client.logger.success(`${client.user.tag} is init`)
        
        await client.storage.slashCommands.initGlobalApplicationCommands()
        
        await client.db.init()
    }
)