import React from 'react'
import GoalsCard from './goalsCard'
import { stackServerApp } from '@/stack';
import { SignIn } from '@stackframe/stack';
import { getGoalsById } from '@/actions/financial.actions';


export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {

  // Extract the id from the slug by splitting on the delimiter
  const [id] = params.slug.split("--");
  const goals = await getGoalsById(id);
  return {
    title: goals ? goals.name : "Goals Details",
  };
}


async function page({ params }: { params: { slug: string } }) {
  const user = await stackServerApp.getUser();
  const [id] = params.slug.split("--");
  const goals = await getGoalsById(id);

  if (!user) {
    return <SignIn />
  }

  return (
    <div className="mt-7 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-full">
        <GoalsCard financials={goals} />
      </div>
    </div>
  )
}

export default page