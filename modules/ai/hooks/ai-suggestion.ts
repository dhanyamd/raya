import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateJsonBody, suggestRequestName } from "../services";
import { JsonBodyGenerationParams, RequestSuggestionParams } from "../types";
import { useRateLimitStore } from "../store/rate-limit";

export function useSuggestRequestName() {
    const queryClient = useQueryClient();
    const { setAILimit } = useRateLimitStore();

    return useMutation({
        mutationFn: (params: RequestSuggestionParams) => suggestRequestName(params),
        onSuccess: (data: any, variables) => {
            queryClient.setQueryData(["request-suggestions", variables], data, {
                updatedAt: Date.now(),
            });

            // Track rate limit
            if (data.rateLimitRemaining !== undefined) {
                setAILimit(data.rateLimitRemaining);
            }

            toast.success(`Generated ${data.suggestion.length} name suggestions`);
        },
    });
}


export function useGenerateJsonBody() {
    const queryClient = useQueryClient();
    const { setAILimit } = useRateLimitStore();

    return useMutation({
        mutationFn: (params: JsonBodyGenerationParams) => generateJsonBody(params),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["json-body"] });

            // Track rate limit
            if (data.rateLimitRemaining !== undefined) {
                setAILimit(data.rateLimitRemaining);
            }

            toast.success("JSON body generated successfully");
        },
        onError: (error: any) => {
            if (error.message?.includes('Rate limit')) {
                toast.error("Rate limit exceeded. Please wait a moment.");
            } else {
                toast.error("Failed to generate JSON body");
            }
        }
    })
}