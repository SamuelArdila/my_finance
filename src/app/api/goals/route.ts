import { NextRequest, NextResponse } from "next/server";
import { createGoals } from "@/actions/financial.actions";

export async function POST(req: NextRequest) {
  try {
    const { name, amount, type, imageURL } = await req.json();
    const result = await createGoals({ name, amount: Number(amount), type, imageURL });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}