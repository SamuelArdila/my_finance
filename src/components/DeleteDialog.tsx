"use client";

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
    register: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        category: "incomes" | "expenses" | "goals";
        id: number;
    };
}

export default function DeleteDialog({ register }: Readonly<DeleteDialogProps>) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deleteRegister(register.category, register.id);
      register.onOpenChange(false); // cierra el diálogo después
    } catch (error) {
      console.error("Error deleting register:", error);
    }
  };

  return (
    <AlertDialog open={register.open} onOpenChange={register.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            This action cannot be undone. This will delete the register from the table.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
