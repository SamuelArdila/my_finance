import { NextRequest, NextResponse } from "next/server";
import { createIncomes } from "@/actions/financial.actions";

export async function POST(req: NextRequest) {
  try {
    const { name, amount, type } = await req.json();
    const result = await createIncomes({ name, amount: Number(amount), type });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/incomes:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create income" },
      { status: 500 }
    );
  }
}