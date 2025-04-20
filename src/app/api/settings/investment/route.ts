import { NextResponse } from "next/server";
import dbConnect from "@/utils/api/connectDB";
import InvestmentLabel from "@/models/InvestmentLabel";
import { verifyJwtToken } from "@/utils/api/jwt";

// GET /api/settings/income-source
export async function GET() {
    await dbConnect();

    try {
        const tokenData = await verifyJwtToken();
        const labels = await InvestmentLabel.find({ userId: tokenData._id }).sort({ label: 1 }); // sort alphabetically
        return NextResponse.json({ data: labels, message: 'Received all investment label.' }, { status: 200 });
    } catch (err: any) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Failed to fetch investment labels", details: errorMessage },
            { status: err?.status || 500 }
        );
    }
}

// POST /api/settings/income-labels
export async function POST(request: Request) {
    await dbConnect();

    try {
        const tokenData = await verifyJwtToken();
        const body = await request.json();
        const { label, note } = body;

        if (!label) {
            return NextResponse.json(
                { error: "Label is required" },
                { status: 400 }
            );
        }

        const { _id } = await InvestmentLabel.create({ label, note, userId: tokenData._id });

        return NextResponse.json(
            { data: { _id }, message: "Investment label created" },
            { status: 201 }
        );
    } catch (err: any) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Server error", details: errorMessage },
            { status: err?.status || 500 }
        );
    }
}
