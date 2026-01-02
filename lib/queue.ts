import { Queue, Worker, Job } from 'bullmq';
import { redis } from './redis';

// Define job types
export interface AIGenerationJob {
    type: 'generate-body' | 'generate-name';
    prompt: string;
    userId: string;
    requestId?: string;
}

export interface RequestExecutionJob {
    type: 'execute-request';
    requestId: string;
    userId: string;
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
}

export type JobData = AIGenerationJob | RequestExecutionJob;

// Create the main queue
export const jobQueue = new Queue<JobData>('raya-jobs', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
    },
});

// Helper to add jobs
export async function addJob(
    name: string,
    data: JobData,
    options?: { priority?: number; delay?: number }
) {
    return jobQueue.add(name, data, {
        priority: options?.priority,
        delay: options?.delay,
    });
}

// Queue an AI body generation job
export async function queueBodyGeneration(
    prompt: string,
    userId: string,
    requestId?: string
) {
    return addJob('ai-generation', {
        type: 'generate-body',
        prompt,
        userId,
        requestId,
    });
}

// Queue a request execution job (for batch testing)
export async function queueRequestExecution(
    requestId: string,
    userId: string,
    method: string,
    url: string,
    headers?: Record<string, string>,
    body?: string
) {
    return addJob('request-execution', {
        type: 'execute-request',
        requestId,
        userId,
        method,
        url,
        headers,
        body,
    });
}

// Get queue statistics
export async function getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
        jobQueue.getWaitingCount(),
        jobQueue.getActiveCount(),
        jobQueue.getCompletedCount(),
        jobQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
}
