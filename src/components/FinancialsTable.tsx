"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Search } from "lucide-react";
import { Combobox } from "./ui/combo-box";
import { Input } from "./ui/input";
import { useState } from "react";
import { getFinancials } from "@/actions/financial.actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CreateDialog } from "./CreateDialog";
import { EditDialog } from "./EditDialog";

type Financials = Awaited<ReturnType<typeof getFinancials>>;

interface FinancialsTableProps {
  financials: Financials;
  searchPlaceholder?: string;
  createDialogTitlePlaceholder?: string;
}

export default function FinancialsTable({
  financials,
  searchPlaceholder = "Filter items...",
  createDialogTitlePlaceholder = "Add Item",
}: Readonly<FinancialsTableProps>) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  

  const filteredColumns = financials?.userFinancials?.filter((column) =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === "" || column.type === selectedType)
  );

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex items-center justify-between py-4 w-full">
          {/* Left: Create Button */}
          <Button
            className="btn btn-primary"
            variant={"outline"}
            onClick={() => setShowCreateDialog(true)}
          >+ Add</Button>

          <div className="flex items-center gap-2">
            <div className="relative max-w-sm w-full">
              <Input
                placeholder={searchPlaceholder}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute h-4 w-4 left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Combobox
              value={selectedType}
              onChange={(val) => setSelectedType(val)}
            />
          </div>
        </div>
        <CreateDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog}
          title={createDialogTitlePlaceholder}
          category={isValidCategory(financials?.category) ? financials.category : "incomes"}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount (USD)</TableHead>
              <TableHead>Registry Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColumns?.map((column) => {
              const isGoal = financials?.category === "goals";
              // Solo crear el slug si es una meta
              const slugifiedName = isGoal ? column.name.toLowerCase().replace(/\s+/g, "-") : "";
              const slug = isGoal ? `${column.id}--${slugifiedName}` : "";
              const financialUrl = isGoal ? `/${financials?.category}/${slug}` : "";

              return (
                <TableRow
                  key={column.id}
                  onClick={() => {
                    if (isGoal) router.push(financialUrl);
                  }}
                  className={isGoal ? "cursor-pointer" : "cursor-default"}
                >
                  <TableCell className="pl-4">{column.id}</TableCell>
                  <TableCell className="font-medium">{column.name}</TableCell>
                  <TableCell>{column.amount}</TableCell>
                  <TableCell>{column.createdAt.toDateString()}</TableCell>
                  <TableCell>{column.type}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingItem(column);
                        setShowEditDialog(true);
                      }}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={e => {
                        e.stopPropagation();
                        alert(`Delete ${column.name}`); // Implement delete logic here
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

        </Table>
        {editingItem && (
        <EditDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          title="Edit Item"
          category={isValidCategory(financials?.category) ? financials.category : "incomes"}
          item={editingItem}
        />
      )}
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function isValidCategory(cat: any): cat is "incomes" | "expenses" | "goals" {
  return cat === "incomes" || cat === "expenses" || cat === "goals";
}
