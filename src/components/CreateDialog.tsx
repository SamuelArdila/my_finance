"use client";
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FinancialDialogForm } from "./FinancialDialogForm";
import { createRegister } from "@/actions/financial.actions";


interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  category: "incomes" | "expenses" | "goals";
  onSuccess?: (message: string) => void;
}

export function CreateDialog({
  open,
  onOpenChange,
  title = "Create New Item",
  category,
  onSuccess
}: Readonly<CreateDialogProps>) {
  const [isPending] = useState(false);

  const handleCreate = async (values: {
    name: string; amount: number; type: string; imageURL?: string;
  }) => {
    try {
      await createRegister({
        name: values.name,
        amount: values.amount,
        type: values.type,
        imageURL: values.imageURL,
        category: category
      });
      onOpenChange(false);
      onSuccess?.("Item created successfully!");
    } catch (error) {
      console.error("Error creating item:", error);
      onSuccess?.("Error creating item.");
    }
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