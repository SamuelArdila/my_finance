import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, amount, type } = await req.json();
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
    }
    const updated = await prisma.goals.update({
      where: { id },
      data: { name, amount: Number(amount), type },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/goals/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update goal" },
      { status: 500 }
    );
  }
}