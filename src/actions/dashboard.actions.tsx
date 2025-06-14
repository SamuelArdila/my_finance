import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { startOfMonth, endOfMonth } from "date-fns";

export async function calculateAndGetUserSavings() {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // 1. Desactivar registros UNIQUE fuera del mes actual
    await prisma.incomes.updateMany({
      where: {
        userId: currentUserId,
        type: "unique",
        state: true,
        OR: [
          { createdAt: { lt: monthStart } },
          { createdAt: { gt: monthEnd } },
        ],
      },
      data: { state: false },
    });

    await prisma.expenses.updateMany({
      where: {
        userId: currentUserId,
        type: "unique",
        state: true,
        OR: [
          { createdAt: { lt: monthStart } },
          { createdAt: { gt: monthEnd } },
        ],
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
    const savingsUpsertResult = await prisma.monthlySavings.upsert({
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

    return allSavings;

  } catch (error) {
    console.error("Error Getting Dashboard:", error);
    throw error;
  }
}
