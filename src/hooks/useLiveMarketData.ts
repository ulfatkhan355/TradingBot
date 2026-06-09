import { useState, useEffect } from 'react';
import { PairStat } from '../types';

class ApiWebSocketManager {
    private static instance: ApiWebSocketManager;
    private pairs: PairStat[] = [];
    private subscribers: Set<(pairs: PairStat[]) => void> = new Set();
    private ws: WebSocket | null = null;
    private isConnected: boolean = false;
    private reconnectTimeout: number | null = null;

    private constructor() {}

    public static getInstance(): ApiWebSocketManager {
        if (!ApiWebSocketManager.instance) {
            ApiWebSocketManager.instance = new ApiWebSocketManager();
        }
        return ApiWebSocketManager.instance;
    }

    public initialize(initialPairs: PairStat[]) {
        if (this.pairs.length === 0) {
            this.pairs = [...initialPairs];
        }
    }

    public subscribe(callback: (pairs: PairStat[]) => void) {
        this.subscribers.add(callback);
        if (this.pairs.length > 0) {
            callback(this.pairs);
        }
        return () => {
            this.subscribers.delete(callback);
        };
    }

    public connect() {
        if (this.isConnected || this.ws !== null) return;
        
        console.log("WebSocketManager: Connecting to Finnhub pricing feed...");
        
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY || "d8k1351r01qjgd6qck10d8k1351r01qjgd6qck1g";
        this.ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

        this.ws.onopen = () => {
            console.log("WebSocketManager: Connected to Finnhub.");
            this.isConnected = true;
            
            // Subscribe to all mapped currency pairs
            this.pairs.forEach(p => {
                if (p.symbol.length === 6) {
                    const finnhubSymbol = `OANDA:${p.symbol.slice(0, 3)}_${p.symbol.slice(3, 6)}`;
                    this.ws?.send(JSON.stringify({ type: 'subscribe', symbol: finnhubSymbol }));
                }
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'trade' && Array.isArray(message.data)) {
                    // Update pairs with new prices
                    let updated = false;
                    const pairsMap = new Map(this.pairs.map(p => [p.symbol, { ...p }]));
                    
                    message.data.forEach((trade: any) => {
                        // Finnhub format typically "OANDA:EUR_USD"
                        const symbol = trade.s.replace('OANDA:', '').replace('_', '');
                        if (pairsMap.has(symbol)) {
                            const pair = pairsMap.get(symbol)!;
                            pair.price = trade.p;
                            updated = true;
                        }
                    });

                    if (updated) {
                        this.pairs = Array.from(pairsMap.values());
                        this.notifySubscribers();
                    }
                }
            } catch (e) {
                console.error("Error parsing WS message:", e);
            }
        };

        this.ws.onclose = () => {
            console.log("WebSocketManager: Disconnected. Reconnecting...");
            this.isConnected = false;
            this.ws = null;
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
            this.reconnectTimeout = window.setTimeout(() => this.connect(), 3000);
        };
        
        this.ws.onerror = (err) => {
             console.error("WebSocketManager: Error:", err);
        }
    }

    public updatePairs(newPairs: PairStat[]) {
        this.pairs = newPairs;
        this.notifySubscribers();
    }

    private notifySubscribers() {
        const updatedPairs = [...this.pairs];
        this.subscribers.forEach(callback => callback(updatedPairs));
    }
}

export const wsManager = ApiWebSocketManager.getInstance();

export function useLiveMarketData(initialPairs: PairStat[]) {
    const [pairs, setPairs] = useState<PairStat[]>(initialPairs);

    useEffect(() => {
        wsManager.initialize(initialPairs);
        wsManager.connect();
        
        const unsubscribe = wsManager.subscribe((updatedPairs) => {
            setPairs(updatedPairs);
        });

        return () => unsubscribe();
    }, [initialPairs]);

    return { 
        pairs, 
        setPairs: (newPairs: PairStat[]) => wsManager.updatePairs(newPairs)
    };
}
