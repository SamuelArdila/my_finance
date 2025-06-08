import { NextRequest, NextResponse } from "next/server";
import { createExpenses } from "@/actions/financial.actions";

export async function POST(req: NextRequest) {
  try {
    const { name, amount, type } = await req.json();
    const result = await createExpenses({ name, amount: Number(amount), type });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/expenses:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create expense" },
      { status: 500 }
    );
  }
}