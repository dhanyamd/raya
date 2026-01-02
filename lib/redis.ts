import Redis from 'ioredis';

// Redis client for caching and pub/sub
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
});

// Helper functions for common cache operations
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis GET error:', error);
        return null;
    }
}

export async function setCache(
    key: string,
    value: unknown,
    ttlSeconds: number = 3600
): Promise<void> {
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
        console.error('Redis SET error:', error);
    }
}

export async function deleteCache(key: string): Promise<void> {
    try {
        await redis.del(key);
    } catch (error) {
        console.error('Redis DEL error:', error);
    }
}

// Session cache helpers
export async function getCachedSession<T = unknown>(sessionToken: string): Promise<T | null> {
    return getCache<T>(`session:${sessionToken}`);
}

export async function setCachedSession(
    sessionToken: string,
    sessionData: unknown,
    ttlSeconds: number = 3600 // 1 hour default
) {
    return setCache(`session:${sessionToken}`, sessionData, ttlSeconds);
}

export async function invalidateSession(sessionToken: string) {
    return deleteCache(`session:${sessionToken}`);
}

// Rate limiting helper
export async function checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const current = await redis.incr(`ratelimit:${key}`);

    if (current === 1) {
        await redis.expire(`ratelimit:${key}`, windowSeconds);
    }

    const ttl = await redis.ttl(`ratelimit:${key}`);

    return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetIn: ttl > 0 ? ttl : windowSeconds,
    };
}
