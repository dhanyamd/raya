'use client';

import { Zap, AlertTriangle } from 'lucide-react';
import { useRateLimitStore } from '../store/rate-limit';
import { cn } from '@/lib/utils';

export function RateLimitIndicator() {
    const { aiRemaining, resetIn } = useRateLimitStore();

    // Don't show if we haven't made any AI requests yet
    if (aiRemaining === null) return null;

    const isLow = aiRemaining <= 5;
    const isExhausted = aiRemaining === 0;

    return (
        <div
            className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors',
                isExhausted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : isLow
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            )}
        >
            {isExhausted ? (
                <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Rate limited</span>
                    {resetIn && <span className="text-zinc-500">• {resetIn}s</span>}
                </>
            ) : (
                <>
                    <Zap className="w-3 h-3" />
                    <span>{aiRemaining} AI calls left</span>
                </>
            )}
        </div>
    );
}

export function RateLimitBadge({ remaining }: { remaining: number | null }) {
    if (remaining === null) return null;

    const isLow = remaining <= 5;
    const isExhausted = remaining === 0;

    return (
        <span
            className={cn(
                'text-[10px] px-1.5 py-0.5 rounded',
                isExhausted
                    ? 'bg-red-500/20 text-red-400'
                    : isLow
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-zinc-700 text-zinc-400'
            )}
        >
            {remaining} left
        </span>
    );
}
