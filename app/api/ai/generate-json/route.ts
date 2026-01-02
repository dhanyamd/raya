import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '@/lib/env';

const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});
import { generateText } from 'ai';
import { checkRateLimit } from '@/lib/redis';
import { currentUser } from '@/modules/authentication/actions';

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

        // Rate limit: 10 AI requests per minute per user (conservative for free tier)
        const rateLimit = await checkRateLimit(`ai:${user.id}`, 10, 60);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please wait a moment.',
                    remaining: rateLimit.remaining,
                    resetIn: rateLimit.resetIn
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { prompt, context } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an API request body generator. Generate valid JSON bodies for API requests.
    
Rules:
- Always return valid JSON
- Use realistic sample data
- Follow common API conventions
- If the prompt mentions specific fields, include them
- Keep responses concise but complete

Context: ${context || 'General API request'}`;

        const { text } = await generateText({
            model: google('gemini-1.5-flash-latest'), // Using latest stable flash model
            system: systemPrompt,
            prompt: `Generate a JSON request body for: ${prompt}. Return ONLY the JSON, no markdown or explanation.`,
        });

        // Try to parse and format the JSON
        let jsonBody;
        try {
            // Remove any markdown code blocks if present
            const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
            jsonBody = JSON.parse(cleanedText);
        } catch {
            // If parsing fails, return the raw text
            jsonBody = text;
        }

        return NextResponse.json({
            success: true,
            body: typeof jsonBody === 'string' ? jsonBody : JSON.stringify(jsonBody, null, 2),
            rateLimitRemaining: rateLimit.remaining - 1,
        });

    } catch (error: any) {
        console.error('AI generation error:', error);

        // Check for Google AI quota errors
        if (error?.message?.includes('RESOURCE_EXHAUSTED') ||
            error?.message?.includes('quota') ||
            error?.data?.error?.code === 429) {

            // Try to extract retry delay
            const retryMatch = error?.message?.match(/retryDelay['":\s]+(\d+)s/);
            const retryIn = retryMatch ? parseInt(retryMatch[1]) : 60;

            return NextResponse.json(
                {
                    error: `Google AI quota exceeded. Please wait ${retryIn} seconds.`,
                    retryIn,
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate JSON body. Please try again.' },
            { status: 500 }
        );
    }
}
