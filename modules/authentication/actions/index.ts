"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCachedSession, setCachedSession } from "@/lib/redis";

// Define the user type for caching
type CachedUser = {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export const currentUser = async (): Promise<CachedUser | null> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return null;
        }

        // Check Redis cache first
        const cacheKey = session.user.id;
        const cachedUser = await getCachedSession<CachedUser>(cacheKey);

        if (cachedUser) {
            console.log("Cache HIT: Returning cached user");
            return cachedUser;
        }

        console.log("Cache MISS: Fetching from database");
        const user = await db.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // Cache the user for 1 hour (3600 seconds)
        if (user) {
            await setCachedSession(cacheKey, user, 3600);
        }

        return user;
    } catch (error) {
        console.error("Error fetching current user:", JSON.stringify(error, null, 2));
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return null;
    }
};
