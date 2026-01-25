import type http from "http";
import { WebSocketServer, WebSocket } from "ws"

type WsEvent =
  | { type: "TASK_CREATED"; payload: { id: number } }
  | { type: "TASK_UPDATED"; payload: { id: number } }
  | { type: "TASK_DELETED"; payload: { id: number } }

let wss: WebSocketServer | null = null

export function initWebSocket(server: http.Server) {
  wss = new WebSocketServer({ server, path: "/ws" })

  wss.on("connection", (socket) => {
    console.log("WS connected")
    socket.send(JSON.stringify({ type: "HELLO" }))

    socket.on("close", () => console.log("WS disconnected"))
  });

  console.log("WS ready on /ws")
}

export function wsBroadcast(event: WsEvent) {
  if (!wss) return

  const msg = JSON.stringify(event)
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg)
    }
  }
}
