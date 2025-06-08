"use client";
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import { FinancialDialogForm } from "./FinancialDialogForm";


interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  category: "incomes" | "expenses" | "goals";
}

export function CreateDialog({
  open,
  onOpenChange,
  title = "Create New Item",
  category,
}: Readonly<CreateDialogProps>) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  
  const handleCreate = async (values: { name: string; amount: number; type: string; imageURL?: string }) => {
    let url = "/api/incomes";
    let body: any = { name: values.name, amount: values.amount, type: values.type };
    if (category === "expenses") url = "/api/expenses";
    if (category === "goals") {
      url = "/api/goals";
      body.imageURL = values.imageURL;
    }

    setIsPending(true);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh(); // Refresh the page to show the new item
    setIsPending(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new item.
          </DialogDescription>
        </DialogHeader>
        <FinancialDialogForm
          category={category}
          isPending={isPending}
          onSubmit={handleCreate}
          onCancel={() => onOpenChange(false)}
          submitLabel="Create"
        />
      </DialogContent>
    </Dialog>
  );
}