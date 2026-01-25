import { WebSocketServer, WebSocket } from "ws";
let wss = null;
export function initWebSocket(server) {
    wss = new WebSocketServer({ server, path: "/ws" });
    wss.on("connection", (socket) => {
        console.log("WS connected");
        socket.send(JSON.stringify({ type: "HELLO" }));
        socket.on("close", () => console.log("WS disconnected"));
    });
    console.log("WS ready on /ws");
}
export function wsBroadcast(event) {
    if (!wss)
        return;
    const msg = JSON.stringify(event);
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    }
}
//# sourceMappingURL=ws.js.map