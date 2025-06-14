import { SignUp } from '@stackframe/stack';
import React from 'react'
import { stackServerApp } from "@/stack";
import { HistoricalChart } from '@/components/HistoricalChart';
import { SavingsPieChart } from '@/components/PieChart'
import { calculateAndGetUserSavings } from '../../actions/dashboard.actions'



async function page() {
  const user = await stackServerApp.getUser();

  const dashboardData = await calculateAndGetUserSavings()
  
  const incomes = dashboardData?.incomes ?? []
  const expenses = dashboardData?.expenses ?? []

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  return (
    <>
      {user ? (

        <HistoricalChart data={dashboardData?.allSavings ?? []} />
        // <SavingsPieChart incomes={totalIncome} expenses={totalExpenses} />

      ) : (
        <div className='flex justify-center mt-20 items-center'>

          <SignUp />

        </div>

      )}
    </>
  )
}

export default page