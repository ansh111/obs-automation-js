import { ClientManager } from "./clientManager.js";

export class VideoSource {

    static async createMediaSource(name, pathOrUrl) {
        const client = await ClientManager.getInstance().getClient();

        const isUrl = pathOrUrl.startsWith("http");
        let inputKind, settings;

        if (isUrl) {
            inputKind = "browser_source";
            settings = {
                url: pathOrUrl,
                width: 1280,
                height: 720,
                fps: 30,
                shutdown: false
            };
        } else {
            inputKind = "ffmpeg_source";
            settings = {
                local_file: pathOrUrl,
                looping: true,
                is_local_file: true,
                speed_percent: 100,
                restart_on_activate: true
            };
        }

        return client.call("CreateInput", {
            sceneName: "Scene",
            inputName: name,
            inputKind,
            inputSettings: settings,
            sceneItemEnabled: true
        });
    }

    static async setMedia(inputName, pathOrUrl) {
        const client = await ClientManager.getInstance().getClient();

        const { inputKind } = await client.call("GetInputSettings", { inputName });
        const isUrl = pathOrUrl.startsWith("http");

        let settings;

        if (inputKind === "browser_source") {
            if (!isUrl) throw new Error("Cannot set file on browser_source.");
            settings = { url: pathOrUrl };
        } else if (inputKind === "ffmpeg_source") {
            if (isUrl) throw new Error("Cannot set URL on ffmpeg_source.");
            settings = {
                local_file: pathOrUrl,
                looping: true,
                restart_on_activate: true
            };
        } else {
            throw new Error(`Unsupported input kind: ${inputKind}`);
        }

        return client.call("SetInputSettings", {
            inputName,
            inputSettings: settings,
            overlay: false
        });
    }

    static async createBrowserSource(name, url, width = 1920, height = 1080) {
        const client = await ClientManager.getInstance().getClient();

        return client.call("CreateInput", {
            sceneName: "Scene",
            inputName: name,
            inputKind: "browser_source",
            inputSettings: { url, width, height, fps: 30 },
            sceneItemEnabled: true
        });
    }

    static async setBrowser(inputName, url, width = 1920, height = 1080) {
        const client = await ClientManager.getInstance().getClient();

        return client.call("SetInputSettings", {
            inputName,
            inputSettings: { url, width, height },
            overlay: false
        });
    }
}