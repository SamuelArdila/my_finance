"use client";
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "./combo-box";
import { createIncomes } from "@/actions/financial.actions"


interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  category: "incomes" | "expenses" | "goals";
}

export function CreateDialog({ open, onOpenChange, title = "Create New Item", category }: CreateDialogProps) {
  const [type, setType] = useState<string>("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [imageURL, setImageURL] = useState(""); // <-- Add this line
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !name || !amount) return;

    let url = "/api/incomes";
    let body: any = { name, amount, type };
    if (category === "expenses") url = "/api/expenses";
    if (category === "goals") {
      url = "/api/goals";
      body.imageURL = imageURL; // Add imageURL only for goals
    }

    setIsPending(true);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setName("");
    setAmount("");
    setType("");
    setImageURL(""); // Reset imageURL
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
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !type || !name || !amount}>
              {isPending ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}