import OBSWebSocket from "obs-websocket-js";

export class ClientManager {
    static _instance = null;

    constructor() {
        this._client = null;
        this._config = {
            host: "localhost",
            port: 4455,
            password: "LocoTeam"
        };
    }

    static getInstance() {
        if (!ClientManager._instance) {
            ClientManager._instance = new ClientManager();
        }
        return ClientManager._instance;
    }

    configure({ host, port, password } = {}) {
        if (this._client) {
            throw new Error("Cannot reconfigure after connection is created");
        }
        if (host) this._config.host = host;
        if (port) this._config.port = port;
        if (password) this._config.password = password;
    }

    /**
     * Return a connected client. This method is defensive: it first attempts
     * the modern object-form connect({ address, password }), and if that
     * fails with an address/URL-related error, it falls back to the older
     * string signature connect(address, password).
     */
    async getClient() {
        if (this._client) return this._client;

        this._client = new OBSWebSocket();

        const address = `ws://${this._config.host}:${this._config.port}`;
        const password = this._config.password;

        // First try modern form (object)
        try {
            await this._client.connect({ address, password });
            console.log("[ClientManager] Connected using object-form connect({address, password})");
        } catch (err) {
            // If the library forwarded an object into WebSocket (Invalid URL: [object Object])
            // the message often contains 'Invalid URL' or similar. We'll detect that and try
            // the string-form fallback.
            const msg = err && err.message ? err.message : String(err);
            console.warn("[ClientManager] object-form connect failed:", msg);

            // Fallback: try older string signature connect(address, password)
            try {
                await this._client.connect(address, password);
                console.log("[ClientManager] Connected using fallback string-form connect(address, password)");
            } catch (err2) {
                // both attempts failed — clean up and rethrow (preserve last error)
                this._client = null;
                console.error("[ClientManager] both connect attempts failed:", err2 && err2.message ? err2.message : err2);
                throw err2;
            }
        }

        console.log("[ClientManager] client.call is", typeof this._client.call, "| client.send is", typeof this._client.send);
        return this._client;
    }

    async disconnect() {
        if (!this._client) return;
        try {
            await this._client.disconnect();
        } catch (err) {
            console.warn("[ClientManager] disconnect error:", err && err.message ? err.message : err);
        } finally {
            this._client = null;
        }
    }
}