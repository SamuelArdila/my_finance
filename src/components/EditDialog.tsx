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
}

export function EditDialog({
  open,
  onOpenChange,
  title = "Edit Item",
  category,
  item,
}: Readonly<EditDialogProps>) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleEdit = async (values: { name: string; amount: number; type: string; imageURL?: string }) => {
    let url = `/api/${category}/${item.id}`;
    let body: any = { name: values.name, amount: values.amount, type: values.type };
    if (category === "goals") {
      body.imageURL = values.imageURL;
    }

    setIsPending(true);
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    setIsPending(false);
    onOpenChange(false);
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