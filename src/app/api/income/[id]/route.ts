import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDB";
import IncomeSchema from "@/models/Income";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await request.json();
        const { amount, label, yearlyIncrement } = body;

        if (!amount) {
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }
        if (!label) {
            return NextResponse.json(
                { error: "Label is required" },
                { status: 400 }
            );
        }

        const updated = await IncomeSchema.findByIdAndUpdate(
            id,
            { amount, label, yearlyIncrement },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Income item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Income item updated", data: updated },
            { status: 200 }
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

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const { id } = params;

        const deleted = await IncomeSchema.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Income item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: { ...deleted, message: "Income item deleted" },
            status: 200,
        });
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Server error", details: errorMessage },
            { status: 500 }
        );
    }
}
