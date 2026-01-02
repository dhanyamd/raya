import "dotenv/config";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
        REDIS_URL: z.string().default('redis://localhost:6379'),
    },


    experimental__runtimeEnv: process.env
});