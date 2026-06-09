import React from 'react';

interface TradingViewChartProps {
    symbol?: string;
}

export function TradingViewChart({ symbol = 'FX:EURUSD' }: TradingViewChartProps) {
    return (
        <div className="w-full h-full relative bg-[#131722] rounded-xl overflow-hidden border border-gray-800">
            {/* We'll use a functional iframe pointing to TradingView's advanced chart widget */}
            <iframe 
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_1&symbol=${symbol}&interval=15&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${symbol}`}
                className="w-full h-full border-0 absolute inset-0"
                title="TradingView Chart"
            />
        </div>
    );
}
