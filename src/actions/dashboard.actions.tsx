"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { startOfMonth} from "date-fns";

export async function calculateAndGetUserSavings() {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const monthStart = startOfMonth(now);

    // 1. Desactivar registros UNIQUE fuera del mes actual
    await prisma.incomes.updateMany({
      where: {
        userId: currentUserId,
        type: "Unique",
        state: true,
        createdAt: { lt: monthStart }
      },
      data: { state: false },
    });

    await prisma.expenses.updateMany({
      where: {
        userId: currentUserId,
        type: "Unique",
        state: true,
        createdAt: { lt: monthStart },
      },
      data: { state: false },
    });

    // 2. Obtener incomes y expenses válidos para este mes
    const incomes = await prisma.incomes.findMany({
      where: {
        userId: currentUserId,
        state: true,
      },
    });

    const expenses = await prisma.expenses.findMany({
      where: {
        userId: currentUserId,
        state: true,
      },
    });

    // 3. Calcular total savings
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savings = totalIncome - totalExpenses;

    // 4. Insertar o actualizar savings del mes
    await prisma.monthlySavings.upsert({
      where: {
        userId_year_month: {
          userId: currentUserId,
          year,
          month,
        },
      },
      update: {
        savings,
      },
      create: {
        userId: currentUserId,
        year,
        month,
        savings,
      },
    });

    // 5. Devolver todos los savings del usuario
    const allSavings = await prisma.monthlySavings.findMany({
      where: { userId: currentUserId },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    // 6. Devolver todos los goals del usuario
    const goals = await prisma.goals.findMany({
      where: { userId: currentUserId },
    });

    const dashboardData = { allSavings, incomes, expenses, goals};
    return dashboardData;

  } catch (error) {
    console.error("Error Getting Dashboard:", error);
    throw error;
  }
}
