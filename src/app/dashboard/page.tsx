import { SignUp } from '@stackframe/stack';
import React from 'react'
import { stackServerApp } from "@/stack";
import { ChartAreaInteractive } from '@/components/ui/chart-area-interactive';
import { calculateAndGetUserSavings } from '../../actions/dashboard.actions'



async function page() {
  const user = await stackServerApp.getUser();

  const savingsData = await calculateAndGetUserSavings()
  return (
    <>
      {user ? (
        <ChartAreaInteractive data={savingsData ?? []} />

      ) : (
        <div className='flex justify-center mt-20 items-center'>

          <SignUp />

        </div>

      )}
    </>
  )
}

export default page