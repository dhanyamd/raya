import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
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
        const { method, url, body: requestBody } = body;

        if (!method || !url) {
            return NextResponse.json(
                { error: 'Method and URL are required' },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an API naming expert. Generate concise, descriptive names for API requests.

Rules:
- Names should be 2-5 words
- Use action verbs (Get, Create, Update, Delete, Fetch, List)
- Be specific but concise
- Follow RESTful naming conventions
- Return exactly 3 suggestions as a JSON array of strings`;

        const { text } = await generateText({
            model: google('gemini-1.5-flash-latest'), // Using latest stable flash model
            system: systemPrompt,
            prompt: `Generate 3 name suggestions for this API request:
Method: ${method}
URL: ${url}
${requestBody ? `Body: ${requestBody}` : ''}

Return ONLY a JSON array of 3 strings, no markdown or explanation.`,
        });

        let suggestions: string[];
        try {
            const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
            suggestions = JSON.parse(cleanedText);
        } catch {
            // Fallback suggestions
            suggestions = [`${method} Request`, `API ${method}`, `${method} Endpoint`];
        }

        return NextResponse.json({
            success: true,
            suggestion: suggestions,
            rateLimitRemaining: rateLimit.remaining,
        });

    } catch (error) {
        console.error('AI suggestion error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestions' },
            { status: 500 }
        );
    }
}
