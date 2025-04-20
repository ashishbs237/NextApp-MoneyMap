import { NextResponse } from "next/server";
import dbConnect from "@/utils/api/connectDB";
import IncomeLabel from "@/models/IncomeLabel";
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
    const { label, note } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Label is required" },
        { status: 400 }
      );
    }

    const updated = await IncomeLabel.findByIdAndUpdate(
      id,
      { label: label, note },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Income label not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: { _id: updated._id }, message: "Income label updated" },
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

    const deleted = await IncomeLabel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Income label not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: { _id: deleted._id }, message: "Income label deleted",
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
