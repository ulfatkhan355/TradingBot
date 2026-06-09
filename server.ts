import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket as WS } from "ws";
import http from "http";

let mockWsInterval: NodeJS.Timeout | null = null;
const connectedClients = new Set<WS>();

function initMockWebsocket() {
    // Start mock interval as fallback
    mockWsInterval = setInterval(() => {
        const symbols = ['OANDA:EUR_USD', 'OANDA:GBP_USD', 'OANDA:USD_JPY', 'OANDA:AUD_USD', 'OANDA:USD_CHF', 'OANDA:USD_CAD', 'OANDA:EUR_JPY'];
        const data = symbols.map(sym => {
            const isJpy = sym.includes('JPY');
            const basePrice = isJpy ? (Math.random() * 20 + 130) : (Math.random() * 0.5 + 0.9);
            return {
                s: sym,
                p: basePrice + (Math.random() * 0.0004 - 0.0002), // slight change
            };
        });
        const msg = JSON.stringify({ type: 'trade', data });
        connectedClients.forEach(c => {
            if (c.readyState === WS.OPEN) {
                c.send(msg);
            }
        });
    }, 500);
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const server = http.createServer(app);
  
  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Attach WebSocket Server
  const wss = new WebSocketServer({ server, path: '/api/ws/market' });
  
  wss.on('connection', (ws) => {
      connectedClients.add(ws);
      ws.on('close', () => {
          connectedClients.delete(ws);
      });
  });

  // Start Mock Connection
  initMockWebsocket();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
