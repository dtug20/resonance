import { Suspense } from "react";
import { HealthCheck } from "./health-check";
import {
    prefetch,
    trpc,
    HydrateClient
} from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

export default async function TestPage() {
    prefetch(trpc.health.queryOptions());

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <HealthCheck />
                </Suspense>
            </ErrorBoundary>

        </HydrateClient>
    );
};