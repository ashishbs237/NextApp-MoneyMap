import { NextResponse } from "next/server";
import dbConnect from "@/utils/api/connectDB";
import ExpenseSchema from "@/models/Expense";
import { verifyJwtToken } from "@/utils/api/jwt";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        await verifyJwtToken();
        const { id } = params;
        const body = await request.json();
        const { amount, label, tag } = body;

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

        const updated = await ExpenseSchema.findByIdAndUpdate(
            id,
            { amount, label, tag },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Expense item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Expense item updated", data: updated },
            { status: 200 }
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

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        await verifyJwtToken();
        const { id } = params;

        const deleted = await ExpenseSchema.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Expense item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: { ...deleted, message: "Expense item deleted" },
            status: 200,
        });
    } catch (err: any) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Server error", details: errorMessage },
            { status: err?.status || 500 }
        );
    }
}
