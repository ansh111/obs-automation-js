import { ClientManager } from "./impl/clientManager.js";
import { Streamer } from "./impl/streamer.js";
import { VideoSource } from "./impl/videoSource.js";

export class ObsController {

    constructor() {
        this.manager = ClientManager.getInstance();
        this.client = null;
    }

    async connect(host = "localhost", port = 4455, password = "LocoTeam") {
        this.manager.configure({ host, port, password });
        this.client = await this.manager.getClient();
        return "Connected to OBS WebSocket";
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            return "Disconnected";
        }
        return "Already disconnected";
    }

    async createBrowserSource(name, url, width = 1920, height = 1080) {
        return VideoSource.createBrowserSource(name, url, width, height);
    }

    async setBrowserSourceUrl(inputName, url) {
        return VideoSource.setBrowser(inputName, url);
    }

    static async configureConnection(host = "localhost", port = 4455, password = "LocoTeam") {
        const manager = ClientManager.getInstance();
        manager.configure({ host, port, password });
    }

    async createMediaSource(name, fileOrUrl) {
        return VideoSource.createMediaSource(name, fileOrUrl);
    }

    async setMediaSource(inputName, fileOrUrl) {
        return VideoSource.setMedia(inputName, fileOrUrl);
    }

    async startStream() {
        return Streamer.start();
    }

    async stopStream() {
        return Streamer.stop();
    }

    async initStream(server, streamKey) {
        return Streamer.init(server, streamKey);
    }

    async setStreamKey(key) {
        return Streamer.setStreamKey(key);
    }
}

export const ObsAutomationJS = new ObsController();