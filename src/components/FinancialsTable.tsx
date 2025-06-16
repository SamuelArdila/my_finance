"use client";

import {
  Pagination,
  PaginationContent,
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
import React from "react";
import { getFinancials } from "@/actions/financial.actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CreateDialog } from "./CreateDialog";
import { EditDialog } from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import toast from "react-hot-toast"

type Financials = Awaited<ReturnType<typeof getFinancials>>;
type FinancialItem = NonNullable<NonNullable<Financials>['userFinancials']>[number];

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
  const [selectedType, setSelectedType] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<FinancialItem | null>(null);
  const [deletingItem, setDeletingItem] = React.useState<FinancialItem | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;


  const filteredColumns = financials?.userFinancials?.filter((column) =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === "" || column.type === selectedType)
  );
  const totalPages = Math.ceil((filteredColumns?.length ?? 0) / itemsPerPage);

  const paginatedColumns = filteredColumns?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSuccessToast = (message: string) => {
    if (message.toLowerCase().includes("error")) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex items-center justify-between py-4 w-full">
          {/* Left: Create Button */}
          <Button
            className="btn btn-primary"
            variant={"outline"}
            aria-label="Add"
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
          onSuccess={handleSuccessToast}
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
            {paginatedColumns?.map((column, index) => {
              const isGoal = financials?.category === "goals";
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
                  <TableCell className="pl-4">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="font-medium">{column.name}</TableCell>
                  <TableCell>{column.amount}</TableCell>
                  <TableCell>{column.createdAt.toDateString()}</TableCell>
                  <TableCell>{column.type}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label="Edit"
                      onClick={(e) => {
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
                      aria-label="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingItem(column);
                        setShowDeleteDialog(true);
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
            onSuccess={handleSuccessToast}
          />)}
        {deletingItem && (
          <DeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            category={isValidCategory(financials?.category) ? financials.category : "incomes"}
            id={deletingItem.id}
            onSuccess={handleSuccessToast}
          />
        )}
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <PaginationItem key={`page-${pageNumber}`}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
}

function isValidCategory(cat: unknown): cat is "incomes" | "expenses" | "goals" {
  return cat === "incomes" || cat === "expenses" || cat === "goals";
}
