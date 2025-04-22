import connectDB from "@/utils/api/connectDB";
import EmiSchema from "@/models/Emi";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/utils/api/jwt";
import { validateRequest } from "@/utils/api/keysValidator";

// create api for income
export async function GET() {
    await connectDB();
    try {
        const tokenData = await verifyJwtToken();

        const items = await EmiSchema.find({ userId: tokenData._id }).sort({ amount: 1 }); // sort alphabetically
        return NextResponse.json({ data: items, message: "Received emis." }, { status: 200 });
    } catch (err: any) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Failed to fetch emis items", details: errorMessage },
            { status: err?.status || 500 }
        );
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const tokenData = await verifyJwtToken();
        const body = await request.json();
        const validation = validateRequest("emi", body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error }, { status: 400 });
        }
        const { label, amount, tag, totalEmis, deductionDate } = body;

        const { _id } = await EmiSchema.create({
            label,
            amount,
            totalEmis,
            deductionDate,
            tag,
            userId: tokenData._id
        });

        return NextResponse.json(
            { data: { _id }, message: "EMI item created" },
            { status: 201 }
        );
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Server error", details: errorMessage },
            { status: 500 }
        );
    }
}
