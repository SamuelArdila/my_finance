"use client";
import React from "react";
import { deleteRegister } from "@/actions/financial.actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: "incomes" | "expenses" | "goals";
  id: number;
  onSuccess?: (message: string) => void;
}

export default function DeleteDialog({ 
  open,
  onOpenChange,
  category,
  id,
  onSuccess
}: Readonly<DeleteDialogProps>) {

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deleteRegister(category, id);
      onOpenChange(false); // cierra el diálogo después
      onSuccess?.("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting register:", error);
      onSuccess?.("Error deleting item.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            This action cannot be undone. This will delete the register from the table.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleDelete}>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
