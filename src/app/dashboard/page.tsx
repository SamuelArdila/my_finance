import { SignUp } from '@stackframe/stack';
import React from 'react'
import { stackServerApp } from "@/stack";
import { HistoricalChart } from '@/components/HistoricalChart';
import { SavingsPieChart } from '@/components/PieChart'
import { GoalsRadialChart } from '@/components/RadialChart'
import { calculateAndGetUserSavings } from '../../actions/dashboard.actions'



async function page() {
  const user = await stackServerApp.getUser();

  const dashboardData = await calculateAndGetUserSavings()
  
  const incomes = dashboardData?.incomes ?? []
  const expenses = dashboardData?.expenses ?? []
  const savings = dashboardData?.allSavings ?? []
  const goals = dashboardData?.goals ?? []


  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalSavings = savings.reduce((sum, e) => sum + e.savings, 0)
  const totalGoals = goals.reduce((sum, e) => sum + e.amount, 0)


  return (
    <>
      {user ? (

        // <HistoricalChart data={dashboardData?.allSavings ?? []} />
        // <SavingsPieChart incomes={totalIncome} expenses={totalExpenses} />
        <GoalsRadialChart incomes={totalIncome} expenses={totalExpenses} savings={totalSavings} goals={totalGoals}/>

      ) : (
        <div className='flex justify-center mt-20 items-center'>

          <SignUp />

        </div>

      )}
    </>
  )
}

export default page