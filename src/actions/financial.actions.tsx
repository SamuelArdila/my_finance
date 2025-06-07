"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getFinancials(category: string, active: boolean, searchTerm?: string) {
  try {
    const currentUserId = await getUserId();

    const whereClause: any = {
      userId: currentUserId,
    };

    if (active !== undefined) {
      whereClause.state = true;
    }

    let userFinancials;

    if (category === "incomes") {
      userFinancials = await prisma.incomes.findMany({
        select: {
          id: true,
          amount: true,
          type: true,
          name: true,
          createdAt: true
        },
        where: whereClause,
      });
    } else if (category === "expenses") {
      userFinancials = await prisma.expenses.findMany({
        select: {
          id: true,
          amount: true,
          type: true,
          name: true,
          createdAt: true
        },
        where: whereClause,
      });
    } else if (category === "goals") {
      userFinancials = await prisma.goals.findMany({
        select: {
          id: true,
          amount: true,
          type: true,
          name: true,
          createdAt: true,
          imageURL: true
        },
        where: whereClause,
      });

    }

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    revalidatePath("/"); //makes render faster
    return { success: true, userFinancials, category };
  } catch (error) {
    console.log("Error in getIncome", error);
  }
}

export async function getGoalsById(id: string) {
  let returnVal;
  returnVal = await prisma.goals.findUnique({ where: { id } });
  return returnVal;
}
