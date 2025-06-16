"use client"

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Goal {
  readonly name: string;
  readonly id: number;
  readonly type: string;
  readonly amount: number;
  readonly state: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly userId: string;
  readonly imageURL: string | null;
}

interface GoalsListProps {
  readonly goals: readonly Goal[]; 
}

export function GoalsList({ goals }: GoalsListProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-2 snap-y snap-mandatory">
      {goals.map((goal) => (
        <Card key={goal.id} className="mb-2 snap-start h-[calc(100%/3)]"> 
          <CardContent className="flex flex-row items-center p-4 gap-4 h-full">
            {goal.imageURL && (
              <div className="flex-shrink-0 h-[80%] max-w-[45%]">
                <Image
                  src={goal.imageURL}
                  alt={goal.name}
                  className="h-full w-full object-cover rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{goal.name}</span>
              <span className="text-sm text-muted-foreground">{goal.type}</span>
              <span className="text-sm font-medium mt-1">${goal.amount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
