import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
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
import { supabase } from "@/lib/supabaseClient";
import type { Listing } from "@/lib/mockData";

export const Route = createFileRoute("/admin/listings")({
  component: ManageListings,
});

function ManageListings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load listings: " + error.message);
        else setItems((data ?? []) as Listing[]);
        setLoading(false);
      });
  }, []);

  async function setStatus(id: string, status: Listing["status"]) {
    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update: " + error.message);
      return;
    }
    setItems((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success(`Listing ${status}`);
  }

  const pending = items.filter((l) => l.status === "pending");
  const others = items.filter((l) => l.status !== "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Manage Listings</h2>
        <p className="text-sm text-muted-foreground">
          Approve or reject incoming business submissions.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4 font-semibold">
            Pending approvals ({pending.length})
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No pending listings.
                  </TableCell>
                </TableRow>
              ) : (
                pending.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.business_name}</TableCell>
                    <TableCell>{l.owner_name ?? "—"}</TableCell>
                    <TableCell>{l.category}</TableCell>
                    <TableCell>
                      {new Date(l.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => setStatus(l.id, "approved")}>
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setStatus(l.id, "rejected")}
                        >
                          <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4 font-semibold">
            All listings ({others.length})
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {others.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No approved or rejected listings yet.
                  </TableCell>
                </TableRow>
              ) : (
                others.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.business_name}</TableCell>
                    <TableCell>{l.category}</TableCell>
                    <TableCell>
                      <Badge variant={l.status === "approved" ? "default" : "destructive"}>
                        {l.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(l.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
