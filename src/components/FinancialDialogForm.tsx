import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "./ui/combo-box";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

interface FinancialDialogFormProps {
  initialValues?: {
    name?: string;
    amount?: number;
    type?: string;
    imageURL?: string;
  };
  category: "incomes" | "expenses" | "goals";
  isPending: boolean;
  onSubmit: (values: { name: string; amount: number; type: string; imageURL?: string }) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function FinancialDialogForm({
  initialValues,
  category,
  isPending,
  onSubmit,
  onCancel,
  submitLabel,
}: Readonly <FinancialDialogFormProps>) {
  const [type, setType] = useState<string>(initialValues?.type ?? "");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [amount, setAmount] = useState(initialValues?.amount?.toString() ?? "");
  const [imageURL, setImageURL] = useState(initialValues?.imageURL ?? "");

  useEffect(() => {
    setType(initialValues?.type ?? "");
    setName(initialValues?.name ?? "");
    setAmount(initialValues?.amount?.toString() ?? "");
    setImageURL(initialValues?.imageURL ?? "");
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !name || !amount) return;
    onSubmit({ name, amount: Number(amount), type, imageURL });
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          type="number"
          min="1"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="type">Type</Label>
        <Combobox
          value={type}
          onChange={setType}
          options={[
            { value: "Unique", label: "Unique" },
            { value: "Monthly", label: "Monthly" },
          ]}
        />
      </div>
      {category === "goals" && (
        <div className="grid gap-3">
          <Label htmlFor="imageURL">Image URL</Label>
          <Input
            id="imageURL"
            name="imageURL"
            placeholder="Enter image URL"
            value={imageURL}
            onChange={e => setImageURL(e.target.value)}
          />
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isPending || !type || !name || !amount}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}