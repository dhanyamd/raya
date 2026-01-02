import { create } from 'zustand';

interface RateLimitState {
    aiRemaining: number | null;
    requestRemaining: number | null;
    resetIn: number | null;
    setAILimit: (remaining: number, resetIn?: number) => void;
    setRequestLimit: (remaining: number, resetIn?: number) => void;
}

export const useRateLimitStore = create<RateLimitState>((set) => ({
    aiRemaining: null,
    requestRemaining: null,
    resetIn: null,

    setAILimit: (remaining, resetIn) => set({
        aiRemaining: remaining,
        resetIn: resetIn ?? null
    }),

    setRequestLimit: (remaining, resetIn) => set({
        requestRemaining: remaining,
        resetIn: resetIn ?? null
    }),
}));
