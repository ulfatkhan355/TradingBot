import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, duration = 1.5 }: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            // Easing function (easeOutExpo)
            const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            
            setDisplayValue(value * easeOut);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return (
        <>{prefix}{displayValue.toFixed(decimals)}{suffix}</>
    );
}
