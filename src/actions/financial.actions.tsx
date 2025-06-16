"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getFinancials(category: string, active: boolean, searchTerm?: string) {
  try {
    const currentUserId = await getUserId();

    const whereClause:  Record<string, unknown> = {
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
  const returnVal = await prisma.goals.findUnique({ where: { id: Number(id) } });
  return returnVal;
}

export type CreateFormInput = {
  name: string;
  amount: number;
  type: string;
  imageURL?: string;
  category: "incomes" | "expenses" | "goals";
};

export type EditFormInput = {
  id?: number;
  name: string;
  amount: number;
  type: string;
  imageURL?: string;
  category: "incomes" | "expenses" | "goals";
}

export async function createRegister(data: CreateFormInput) {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    let newRegister;

    if (data.category === "incomes") {
      newRegister = await prisma.incomes.create({
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type,
          userId: currentUserId,
        }
      });
      revalidatePath("/incomes");
    } else if (data.category === "expenses") {
      newRegister = await prisma.expenses.create({
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type,
          userId: currentUserId,
        }
      });
      revalidatePath("/expenses");
    } else if (data.category === "goals") {
      newRegister = await prisma.goals.create({
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type,
          imageURL: data.imageURL,
          userId: currentUserId,
        }
      });
      revalidatePath("/goals");
    }

    return newRegister;
  } catch (error) {
    console.error("Error Creating Register:", error);
    throw error;
  }
}

export async function editRegister(data: EditFormInput) {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    const id = data.id;

    let editedRegister;

    if (data.category === "incomes") {
      editedRegister = await prisma.incomes.update({
        where: { id },
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type
        }
      });
      revalidatePath("/incomes");
    } else if (data.category === "expenses") {
      editedRegister = await prisma.expenses.update({
        where: { id },
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type
        }
      });
      revalidatePath("/expenses");
    } else if (data.category === "goals") {
      editedRegister = await prisma.goals.update({
        where: { id },
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type,
          imageURL: data.imageURL
        }
      });
      revalidatePath("/goals");
    }

    return editedRegister;
  } catch (error) {
    console.error("Error deleting register:", error);
    throw error;
  }
}

export async function deleteRegister(
  category: string,
  id: number
) {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    let deletedRegister;

    if (category === "incomes") {
      deletedRegister = await prisma.incomes.update({
        where: { id },
        data: {
          state: false,
        }
      });
      revalidatePath("/incomes");
    } else if (category === "expenses") {
      deletedRegister = await prisma.expenses.update({
        where: { id },
        data: {
          state: false,
        }
      });
      revalidatePath("/expenses");
    } else if (category === "goals") {
      deletedRegister = await prisma.goals.update({
        where: { id },
        data: {
          state: false,
        }
      });
      revalidatePath("/goals");
    }

    return deletedRegister;
  } catch (error) {
    console.error("Error deleting register:", error);
    throw error;
  }
}