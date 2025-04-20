// utils/api/withApiHandler.ts
import { NextResponse } from "next/server";

export function withApiHandler(handler: () => Promise<NextResponse>) {
    return async () => {
        try {
            return await handler();
        } catch (err: any) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error occurred";
            const status = err?.status || 500;

            return NextResponse.json(
                { error: "Something went wrong", details: errorMessage },
                { status }
            );
        }
    };
}
