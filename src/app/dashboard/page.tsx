import { SignUp } from '@stackframe/stack';
import React from 'react'
import { stackServerApp } from "@/stack";

async function page() {
    const user = await stackServerApp.getUser();
    
  return (
    <>
    {user ? (
        <h1>Dashboard</h1>

    ) : (
        <div className='flex justify-center mt-20 items-center'>

            <SignUp/>

        </div>

    )}
    </>
  )
}

export default page