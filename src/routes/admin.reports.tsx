import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Report = {
  id: string;
  business: string;
  reason: string;
  reporter: string;
  date: string;
  status: "open" | "resolved" | "dismissed";
};

const seed: Report[] = [
  {
    id: "r1",
    business: "Glow Beauty Lounge",
    reason: "Misleading pricing",
    reporter: "Aisha B.",
    date: "2025-05-24",
    status: "open",
  },
  {
    id: "r2",
    business: "TechFix Repairs",
    reason: "No response to messages",
    reporter: "Chinedu A.",
    date: "2025-05-20",
    status: "open",
  },
  {
    id: "r3",
    business: "Trendy Threads",
    reason: "Inappropriate images",
    reporter: "Sodiq O.",
    date: "2025-05-15",
    status: "resolved",
  },
];

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

function Reports() {
  const [items, setItems] = useState<Report[]>(seed);

  function resolve(id: string, status: Report["status"]) {
    setItems((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Report ${status}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports & Moderation</h2>
        <p className="text-sm text-muted-foreground">
          Review user-submitted reports against listings.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.business}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.reporter}
                  </TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "open"
                          ? "destructive"
                          : r.status === "resolved"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "open" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => resolve(r.id, "resolved")}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" /> Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolve(r.id, "dismissed")}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Dismiss
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}