import { ClientManager } from "./clientManager.js";

export class Streamer {

    static async init(server, streamKey) {
        const client = await ClientManager.getInstance().getClient();

        await client.call("SetStreamServiceSettings", {
            streamServiceType: "rtmp_custom",
            streamServiceSettings: {
                server,
                key: streamKey,
                use_auth: false
            }
        });
    }

    static async setStreamKey(streamKey) {
        const client = await ClientManager.getInstance().getClient();

        const { streamServiceSettings } = await client.call("GetStreamServiceSettings");
        streamServiceSettings.key = streamKey;

        await client.call("SetStreamServiceSettings", {
            streamServiceType: "rtmp_custom",
            streamServiceSettings
        });
    }

    static async start() {
        const client = await ClientManager.getInstance().getClient();
        return client.call("StartStream");
    }

    static async stop() {
        const client = await ClientManager.getInstance().getClient();
        return client.call("StopStream");
    }
}