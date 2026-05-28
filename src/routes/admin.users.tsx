import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, ShieldCheck } from "lucide-react";
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
import { mockUsers, type AppUser } from "@/lib/mockData";

export const Route = createFileRoute("/admin/users")({
  component: ManageUsers,
});

function ManageUsers() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);

  function makeAdmin(id: string) {
    setUsers((p) =>
      p.map((u) => (u.id === id ? { ...u, role: "admin" } : u)),
    );
    toast.success("User promoted to admin");
  }

  function deleteUser(id: string) {
    setUsers((p) => p.filter((u) => u.id !== id));
    toast.success("User deleted");
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
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                    >
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => makeAdmin(u.id)}
                        >
                          <ShieldCheck className="mr-1 h-4 w-4" /> Make Admin
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(u.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </div>
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