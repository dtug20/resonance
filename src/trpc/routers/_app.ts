import {
    baseProcedure,
    createTRPCRouter
} from '../init';
export const appRouter = createTRPCRouter({
    health: baseProcedure.query(async () => {
        // throw new Error("Failed to fetch health");
        return {
            status: "OK", code: 123
        };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
