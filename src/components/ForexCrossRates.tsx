import React, { memo } from 'react';

export const ForexCrossRates = memo(function ForexCrossRates() {
    const config = {
          "width": "100%",
          "height": "100%",
          "currencies": [
            "EUR",
            "USD",
            "JPY",
            "GBP",
            "CHF",
            "AUD",
            "CAD",
            "NZD"
          ],
          "isTransparent": true,
          "colorTheme": "dark",
          "locale": "en"
    };

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body, html { margin: 0; padding: 0; background: transparent; width: 100%; height: 100%; overflow: hidden; }
        </style>
      </head>
      <body>
        <div class="tradingview-widget-container" style="height:100%;width:100%;">
          <div class="tradingview-widget-container__widget" style="height:100%;width:100%;"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js" async>
          ${JSON.stringify(config)}
          </script>
        </div>
      </body>
    </html>
    `;

    return (
        <iframe 
            srcDoc={html} 
            style={{ width: '100%', height: '100%', minHeight: '400px', border: 'none' }} 
            title="Forex Cross Rates"
        />
    );
});
