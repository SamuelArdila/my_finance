import { useState } from "react"
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


interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string; // Add this line
}

export function CreateDialog({ open, onOpenChange, title = "Create New Item" }: CreateDialogProps) {
  // Add state for the type selection
  const [type, setType] = useState<string>("");

  // Add state for name and amount if you want to save those as well
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return; // Prevent submit if type is not selected
    // Save logic here (call API, update parent, etc.)
    // Reset fields and close dialog
    setName("");
    setAmount("");
    setType("");
    onOpenChange(false);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Enter name" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" placeholder="Enter amount" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="type">Type</Label>
            <Combobox
              value=""
              onChange={(value) => console.log("Selected type:", value)}
              options={[
                { value: "Unique", label: "Unique" },
                { value: "Monthly", label: "Monthly" },
              ]}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}