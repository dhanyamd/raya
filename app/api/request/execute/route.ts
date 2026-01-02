import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/redis';
import { currentUser } from '@/modules/authentication/actions';
import axios, { AxiosRequestConfig } from 'axios';

export async function POST(request: NextRequest) {
    try {
        // Get current user for rate limiting
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Rate limit: 100 requests per minute per user
        const rateLimit = await checkRateLimit(`request:${user.id}`, 100, 60);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please slow down.',
                    remaining: rateLimit.remaining,
                    resetIn: rateLimit.resetIn
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { method, url, headers, params, requestBody } = body;

        if (!method || !url) {
            return NextResponse.json(
                { error: 'Method and URL are required' },
                { status: 400 }
            );
        }

        const config: AxiosRequestConfig = {
            method,
            url,
            headers,
            params,
            data: requestBody,
            validateStatus: () => true,
            timeout: 30000, // 30 second timeout
        };

        const start = performance.now();

        try {
            const res = await axios(config);
            const end = performance.now();
            const duration = end - start;

            const size = res.headers['content-length'] ||
                new TextEncoder().encode(JSON.stringify(res.data)).length;

            return NextResponse.json({
                success: true,
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(Object.entries(res.headers)),
                data: res.data,
                duration: Math.round(duration),
                size,
                rateLimitRemaining: rateLimit.remaining,
            });
        } catch (error: any) {
            const end = performance.now();
            return NextResponse.json({
                success: false,
                error: error.message,
                duration: Math.round(end - start),
            });
        }

    } catch (error) {
        console.error('Request execution error:', error);
        return NextResponse.json(
            { error: 'Failed to execute request' },
            { status: 500 }
        );
    }
}
