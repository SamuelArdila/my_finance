import { SignUp } from '@stackframe/stack';
import React from 'react'
import { stackServerApp } from "@/stack";
import { HistoricalChart } from '@/components/HistoricalChart';
import { SavingsPieChart } from '@/components/PieChart';
import { GoalsRadialChart } from '@/components/RadialChart';
import { GoalsList } from '@/components/GoalsList';
import { calculateAndGetUserSavings } from '../../actions/dashboard.actions';



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

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-4 lg:mr-80 lg:ml-80" >
          <div className="w-full h-[42vh] shadow rounded-xl">
            <SavingsPieChart incomes={totalIncome} expenses={totalExpenses} /> </div>
          < div className="w-full h-[42vh] border-gray-270 border-2 shadow rounded-xl col-span-2" >
            <GoalsList goals={goals} /> </div>
          <div className="w-full h-[42vh] shadow rounded-xl col-span-2" >
            <HistoricalChart data={dashboardData?.allSavings ?? []} /> </div >
          <div className="w-full h-[42vh] shadow rounded-xl" >
            <GoalsRadialChart incomes={totalIncome} expenses={totalExpenses} savings={totalSavings} goals={totalGoals} /> </div >
        </div>

      ) : (
        
        <div className='flex justify-center mt-20 items-center'>
          <SignUp />
        </div>

      )}
    </>
  )
}

export default page