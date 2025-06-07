import { SignUp } from '@stackframe/stack';
import React from 'react'
import { stackServerApp } from "@/stack";
import FinancialsTable from '@/components/FinancialsTable';
import { getFinancials } from '@/actions/financial.actions';

async function page() {
  const user = await stackServerApp.getUser();
  const expenses = await getFinancials("expenses", true);
  
  return (
    <>
    {user ? (
        <div className="mt-7 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-full">
            <FinancialsTable financials={expenses}/>
          </div>
        </div>
    ) : (
        <div className='flex justify-center mt-20 items-center'>
            <SignUp/>
        </div>

    )}
    </>
  )
}

export default page