"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getFinancials(category: string, active: boolean, searchTerm?: string) {
  try {
    const currentUserId = await getUserId();
    console.log("Current userId:", currentUserId);

    const whereClause: any = {
      userId: currentUserId,
    };

    if (active !== undefined) {
      whereClause.state = true;
    }

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
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

    

    revalidatePath("/"); //makes render faster
    return { success: true, userFinancials, category };
  } catch (error) {
    console.log("Error in getIncome", error);
  }
}

export async function getGoalsById(id: string) {
  let returnVal;
  returnVal = await prisma.goals.findUnique({ where: { id: Number(id) } });
  return returnVal;
}

export type IncomeFormInput = {
  name: string;
  amount: number;
  type: string;
};

export type ExpenseFormInput = {
  name: string;
  amount: number;
  type: string;
};

export type GoalFormInput = {
  name: string;
  amount: number;
  type: string;
  imageURL?: string;
};

export async function createIncomes(data: IncomeFormInput) {
  console.log("creating income");
  console.log(data);
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    const newIncome = await prisma.incomes.create({
      data: {
        ...data,
        userId: currentUserId,
      },
    });
    console.log("Created income in DB:", newIncome);
    revalidatePath("/incomes");
    return newIncome;
  } catch (error) {
    console.error("Error Creating Income:", error);
    throw error;
  }
}

export async function createExpenses(data: ExpenseFormInput) {
  const currentUserId = await getUserId();
  if (!currentUserId) return;

  const newExpense = await prisma.expenses.create({
    data: {
      ...data,
      userId: currentUserId,
    },
  });
  revalidatePath("/expenses");
  return newExpense;
}

export async function createGoals(data: GoalFormInput) {
  const currentUserId = await getUserId();
  if (!currentUserId) return;

  const newGoal = await prisma.goals.create({
    data: {
      ...data,
      userId: currentUserId,
    },
  });
  revalidatePath("/goals");
  return newGoal;
}
