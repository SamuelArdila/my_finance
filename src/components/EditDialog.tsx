"use client";
import { useState, useEffect } from "react"
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
import { Combobox } from "./ui/combo-box";
import { useRouter } from "next/navigation";

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
  const [type, setType] = useState<string>(item.type ?? "");
  const [name, setName] = useState(item.name ?? "");
  const [amount, setAmount] = useState(item.amount?.toString() ?? "");
  const [imageURL, setImageURL] = useState(item.imageURL ?? "");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setType(item.type ?? "");
    setName(item.name ?? "");
    setAmount(item.amount?.toString() ?? "");
    setImageURL(item.imageURL ?? "");
  }, [item]);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !name || !amount) return;

    let url = `/api/${category}/${item.id}`;
    let body: any = { name, amount: Number(amount), type };
    if (category === "goals") {
      body.imageURL = imageURL;
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
              {isPending ? "Saving..." : "Edit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}