"use client";
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FinancialDialogForm } from "./FinancialDialogForm";
import { editRegister } from "@/actions/financial.actions";

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  category: "incomes" | "expenses" | "goals";
  item: {
    id: number;
    name: string;
    amount: number;
    type: string;
    imageURL?: string;
  };
  onSuccess?: (message: string) => void;
}

export function EditDialog({
  open, onOpenChange, title = "Edit Item", category, item, onSuccess
}: Readonly<EditDialogProps>) {
  const [isPending] = React.useState(false);

  const handleEdit = async (values: {
    id?: number, name: string; amount: number; type: string; imageURL?: string;
  }) => {
    try {
      await editRegister({
        id: values.id,
        name: values.name,
        amount: values.amount,
        type: values.type,
        imageURL: values.imageURL,
        category: category
      });
      onOpenChange(false);
      onSuccess?.("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      onSuccess?.("Error updating item.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Edit the fields and save your changes.
          </DialogDescription>
        </DialogHeader>
        <FinancialDialogForm
          initialValues={item}
          category={category}
          isPending={isPending}
          onSubmit={handleEdit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Edit"
        />
      </DialogContent>
    </Dialog>
  );
}