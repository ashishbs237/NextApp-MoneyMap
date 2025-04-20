import connectDB from "@/utils/api/connectDB";
import IncomeSchema from "@/models/Income";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/utils/api/jwt";

// create api for income
export async function GET() {
  await connectDB();
  try {
    const tokenData = await verifyJwtToken();

    const items = await IncomeSchema.find({ userId: tokenData._id }).sort({ amount: 1 }); // sort alphabetically
    return NextResponse.json({ data: items, message: "Received incomes." }, { status: 200 });
  } catch (err: any) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch income items", details: errorMessage },
      { status: err?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const tokenData = await verifyJwtToken();
    const body = await request.json();
    const { label, amount, yearlyIncrement } = body;

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const { _id } = await IncomeSchema.create({
      label,
      amount,
      yearlyIncrement,
      userId: tokenData._id
    });

    return NextResponse.json(
      { data: { _id }, message: "Income item created" },
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
