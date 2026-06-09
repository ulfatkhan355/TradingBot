import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket as WS } from "ws";
import http from "http";

let mockWsInterval: NodeJS.Timeout | null = null;
const connectedClients = new Set<WS>();

function initMockWebsocket() {
    if (mockWsInterval) return;
    console.log("Starting mock fallback WS generator...");
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

function initFinnhubWebsocket() {
    const key = process.env.VITE_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
    if (!key) {
        console.warn('FINNHUB_API_KEY missing - will generate mock ticks on server');
        initMockWebsocket();
        return;
    }

    try {
        const finnhubWs = new WS(`wss://ws.finnhub.io?token=${key}`);
        
        finnhubWs.on('unexpected-response', (request, response) => {
            if (response.statusCode === 429) {
                console.warn("Finnhub WS error: Unexpected server response: 429 (Rate Limit). Falling back to mock data.");
                initMockWebsocket();
            }
        });

        finnhubWs.on('open', () => {
            console.log('Connected to Finnhub WebSocket proxy');
            const symbols = [
                'OANDA:EUR_USD', 
                'OANDA:GBP_USD', 
                'OANDA:USD_JPY', 
                'OANDA:AUD_USD', 
                'OANDA:USD_CHF', 
                'OANDA:USD_CAD', 
                'OANDA:EUR_JPY'
            ];
            symbols.forEach(sym => {
                finnhubWs.send(JSON.stringify({ type: 'subscribe', symbol: sym }));
            });
        });

        finnhubWs.on('message', (data: any) => {
            const msg = data.toString();
            connectedClients.forEach(c => {
                if (c.readyState === WS.OPEN) {
                    c.send(msg);
                }
            });
        });

        finnhubWs.on('close', () => {
            console.log('Finnhub connection closed. Reconnecting in 5s...');
            setTimeout(initFinnhubWebsocket, 5000);
            initMockWebsocket(); // fallback while reconnecting
        });

        finnhubWs.on('error', (err: any) => {
            console.error('Finnhub WS error:', err.message);
            initMockWebsocket(); // fallback
        });
    } catch (e) {
        console.error('Error initializing Finnhub:', e);
        initMockWebsocket();
    }
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

  // Start Finnhub connection with Mock fallback
  initFinnhubWebsocket();

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
