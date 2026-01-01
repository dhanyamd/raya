import { createAuthClient } from "better-auth/react"

// Create a single auth client instance with polling disabled
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    fetchOptions: {
        // Disable automatic refetching
        onSuccess: () => { },
    },
})

// Export hooks and methods from the single client
export const { signIn, signUp, useSession } = authClient