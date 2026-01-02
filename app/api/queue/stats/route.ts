import { NextRequest, NextResponse } from 'next/server';
import { getQueueStats, jobQueue } from '@/lib/queue';

// GET /api/queue/stats - Get queue statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await getQueueStats();

        return NextResponse.json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error('Queue stats error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get queue stats' },
            { status: 500 }
        );
    }
}
