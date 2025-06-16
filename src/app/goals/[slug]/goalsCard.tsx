
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getGoalsById } from "@/actions/financial.actions";
import Image from "next/image";


type Financials = Awaited<ReturnType<typeof getGoalsById>>;

interface GoalsCardProps {
  financials: Financials;
}

export default function goalsCard({ financials }: Readonly<GoalsCardProps>) {


  if (!financials) {
    return <div>Data is not available.</div>;
  }

  return (
    <Card className="max-w">
      <div className="flex flex-row">
        <div className="basis-2/4">
          <CardHeader>
          {financials.imageURL && (
            <div className="rounded-lg overflow-hidden">
              <Image
                  src={financials.imageURL}
                  alt="Post content"
                  className="w-full h-auto object-cover"
                  width={1000}
                  height={1000}
                />
            </div>
          )}

           
          </CardHeader>
        </div>
        <div className="basis-2/4 flex flex-col justify-between">
          <CardContent className="mt-8 space-y-3">
            <CardTitle className="text-5xl font-bold">{financials.name}</CardTitle>
            <CardTitle className="text-3xl font-bold">${financials.amount}</CardTitle>
            <CardDescription>{financials.createdAt.toDateString()}</CardDescription>
            <CardDescription className="text-white">
              {financials.type}
            </CardDescription>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}