import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, ShieldCheck, Loader2 } from "lucide-react";
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
import type { AppUser } from "@/lib/mockData";

export const Route = createFileRoute("/admin/users")({
  component: ManageUsers,
});

function ManageUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load users: " + error.message);
        else setUsers((data ?? []) as AppUser[]);
        setLoading(false);
      });
  }, []);

  async function makeAdmin(id: string) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", id);

    if (error) { toast.error("Failed: " + error.message); return; }
    setUsers((p) => p.map((u) => u.id === id ? { ...u, role: "admin" } : u));
    toast.success("User promoted to admin");
  }

  async function deleteUser(id: string) {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { toast.error("Failed: " + error.message); return; }
    setUsers((p) => p.filter((u) => u.id !== id));
    toast.success("User removed");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <p className="text-sm text-muted-foreground">
          Promote, verify, or remove platform users.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.is_verified ? (
                        <Badge variant="outline">Yes</Badge>
                      ) : (
                        <Badge variant="destructive">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {u.role !== "admin" && (
                          <Button size="sm" variant="outline" onClick={() => makeAdmin(u.id)}>
                            <ShieldCheck className="mr-1 h-4 w-4" /> Make Admin
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deleteUser(u.id)}>
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
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
    </div>
  );
}
