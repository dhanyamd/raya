import { Worker, Job } from 'bullmq';
import { redis } from './redis';
import { JobData, AIGenerationJob, RequestExecutionJob } from './queue';

// This worker processes background jobs
// Run this as a separate process in production: `npx ts-node lib/worker.ts`

const worker = new Worker<JobData>(
    'raya-jobs',
    async (job: Job<JobData>) => {
        console.log(`Processing job ${job.id} of type ${job.data.type}`);

        switch (job.data.type) {
            case 'generate-body':
            case 'generate-name':
                return processAIGeneration(job.data as AIGenerationJob);

            case 'execute-request':
                return processRequestExecution(job.data as RequestExecutionJob);

            default:
                throw new Error(`Unknown job type: ${(job.data as any).type}`);
        }
    },
    {
        connection: redis,
        concurrency: 5, // Process up to 5 jobs simultaneously
    }
);

async function processAIGeneration(data: AIGenerationJob) {
    // TODO: Implement AI generation logic here
    // This would call your OpenAI/Google AI service
    console.log(`AI Generation job: ${data.prompt}`);

    // Placeholder - replace with actual AI call
    return {
        success: true,
        result: `Generated content for: ${data.prompt}`,
    };
}

async function processRequestExecution(data: RequestExecutionJob) {
    // TODO: Implement request execution logic here
    console.log(`Executing request: ${data.method} ${data.url}`);

    try {
        const response = await fetch(data.url, {
            method: data.method,
            headers: data.headers,
            body: data.body,
        });

        const responseData = await response.text();

        return {
            success: true,
            status: response.status,
            data: responseData,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Event listeners for monitoring
worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
    console.error('Worker error:', err);
});

console.log('Worker started and listening for jobs...');

export default worker;
