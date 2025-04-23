import { NextResponse } from "next/server";
import dbConnect from "@/utils/api/connectDB";
import EmiSchema from "@/models/Emi";
import { verifyJwtToken } from "@/utils/api/jwt";
import { validateRequest } from "@/utils/api/keysValidator";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    await verifyJwtToken();
    const { id } = params;
    const body = await request.json();

    const validation = validateRequest("emi", body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }
    const { label, amount, totalEmis, deductionDate, startMonth, startYear, tag } = body;

    const updated = await EmiSchema.findByIdAndUpdate(
      id,
      { amount, label, tag, totalEmis, deductionDate, startMonth, startYear },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Emi item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Emi item updated", data: updated },
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

    const deleted = await EmiSchema.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Emi item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { _id: deleted._id }, message: "Emi item deleted",
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
