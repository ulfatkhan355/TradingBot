import React, { memo } from 'react';

export const TickerTape = memo(function TickerTape() {
    const config = {
          "symbols": [
            { "proName": "FX:EURUSD", "title": "EUR/USD" },
            { "proName": "FX:GBPUSD", "title": "GBP/USD" },
            { "proName": "FX:USDJPY", "title": "USD/JPY" },
            { "proName": "FX:USDCHF", "title": "USD/CHF" },
            { "proName": "FX:AUDUSD", "title": "AUD/USD" },
            { "proName": "FX:USDCAD", "title": "USD/CAD" },
            { "proName": "FX:NZDUSD", "title": "NZD/USD" }
          ],
          "showSymbolLogo": true,
          "colorTheme": "dark",
          "isTransparent": true,
          "displayMode": "adaptive",
          "locale": "en"
    };

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body, html { margin: 0; padding: 0; background: transparent; overflow: hidden; height: 100%; color { color: white } }
        </style>
      </head>
      <body>
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
          ${JSON.stringify(config)}
          </script>
        </div>
      </body>
    </html>
    `;

    return (
        <div className="w-full h-[40px] bg-[#1e222d] border-b border-gray-800 shrink-0 overflow-hidden flex items-center pt-[20px]">
            <iframe 
                srcDoc={html} 
                style={{ width: '100%', height: '70px', border: 'none' }} 
                title="Ticker Tape"
                className="w-full"
            />
        </div>
    );
});
