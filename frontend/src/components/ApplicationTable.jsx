import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChevronUp, ChevronDown, ChevronsUpDown, CheckCircle2 } from "lucide-react";
import { updateApplication, deleteApplication } from "../api";

const statusBadgeVariant = (status) => {
  switch (status) {
    case "Applied":
      return "secondary";
    case "Interview":
      return "default";
    case "Offer":
      return "success";
    case "Rejected":
      return "danger";
    default:
      return "outline";
  }
};

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const columns = [
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "company",
    header: "Company",
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <span className="text-sm text-muted-foreground">{val}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <span className="text-sm text-muted-foreground">{val}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "work_type",
    header: "Work Type",
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <span className="text-sm text-muted-foreground">{val}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "employment_type",
    header: "Type",
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <span className="text-sm text-muted-foreground">{val}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <span className="text-sm text-muted-foreground">{val}</span>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <Badge variant={statusBadgeVariant(val)} className="w-20 justify-center">
          {val}
        </Badge>
      ) : null;
    },
  },
  {
    accessorKey: "applied_at",
    header: "Applied At",
    cell: (info) => (
      <span className="text-muted-foreground text-sm">{new Date(info.getValue()).toLocaleDateString()}</span>
    ),
  },
];

function SortIcon({ column }) {
  if (column.getIsSorted() === "asc") return <ChevronUp className="w-3 h-3" />;
  if (column.getIsSorted() === "desc") return <ChevronDown className="w-3 h-3" />;
  return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
}

function ApplicationTable({ data, page, totalPages, onPageChange, search, onSearchChange, onUpdate }) {
  const [sorting, setSorting] = useState([]);
  const [inputValue, setInputValue] = useState(search);
  const [pageInput, setPageInput] = useState(page);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPageInput(page);
  }, [page]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearchChange(inputValue);
  };

  const handlePageInput = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val);
    } else {
      setPageInput(page);
    }
  };

  const handleRowClick = (row) => {
    setSelected(row.original);
    setEditData({ ...row.original, applied_at: row.original.applied_at?.split("T")[0] });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(false);
    updateApplication(editData.id, editData)
      .then(() => {
        setSaved(true);
        onUpdate();
      })
      .catch(console.error);
  };

  const handleDelete = async () => {
    if (!editData?.id) return;

    try {
      await deleteApplication(editData.id);
      setSelected(null);
      setEditData(null);
      onUpdate(); // refresh table
    } catch (err) {
      console.error(err);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search applications... (press Enter)"
      />

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon column={header.column} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className={`border-t border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-muted/10"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            Prev
          </Button>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={handlePageInput}
            onKeyDown={(e) => e.key === "Enter" && handlePageInput(e)}
            className="w-14 text-center appearance-none"
          />
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editData && (
            <>
              <DialogHeader className="pb-4 border-b border-border/50">
                <div className="flex items-start justify-between gap-2 pr-6">
                  <div>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                      {editData.title || "Application"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{editData.company || "Unknown company"}</p>
                  </div>
                  <Badge variant={statusBadgeVariant(editData.status)} className="w-20 justify-center mt-1">
                    {editData.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="flex flex-col gap-5 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Title">
                    <Input
                      value={editData.title || ""}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Company">
                    <Input
                      value={editData.company || ""}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Location">
                    <Input
                      value={editData.location || ""}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Work Type">
                    <Select
                      value={editData.work_type || ""}
                      onValueChange={(val) => setEditData({ ...editData, work_type: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Status">
                    <Select
                      value={editData.status || ""}
                      onValueChange={(val) => setEditData({ ...editData, status: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Applied At">
                    <Input
                      type="date"
                      value={editData.applied_at || ""}
                      onChange={(e) => setEditData({ ...editData, applied_at: e.target.value })}
                    />
                  </FormField>
                  <FormField label="URL">
                    <Input
                      value={editData.url || ""}
                      onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Salary">
                    <Input
                      value={editData.salary || ""}
                      onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                      placeholder="e.g. £30,000 - £40,000"
                    />
                  </FormField>

                  <FormField label="Employment Type">
                    <Input
                      value={editData.employment_type || ""}
                      onChange={(e) => setEditData({ ...editData, employment_type: e.target.value })}
                      placeholder="e.g. Full-time, Contract"
                    />
                  </FormField>
                </div>

                <FormField label="Description">
                  <Textarea
                    className="h-40 resize-none text-sm"
                    value={editData.description || ""}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                </FormField>
              </div>

              <DialogFooter className="border-t border-border/50 pt-4">
                <div className="flex items-center gap-3 w-full">
                  {saved && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      Saved successfully!
                    </div>
                  )}

                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>

                  <Button onClick={handleSave} className="ml-auto">
                    Save Changes
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApplicationTable;
